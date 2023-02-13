import path from "node:path";

import { config } from "dotenv";
import { app, BrowserWindow, dialog, Menu, screen, shell } from "electron";
import log from "electron-log";
import { autoUpdater } from "electron-updater";

import { ConsoleLogger, createConsoleLogger } from "./consoleLogger.js";
import { createConsoleServer } from "./consoleServer.js";
import { WING_PROTOCOL_SCHEME } from "./protocol.js";
import { SegmentAnalytics } from "./segmentAnalytics.js";
import { createCloudAppState } from "./utils/cloudAppState.js";
import { createWingApp } from "./utils/createWingApp.js";

config();

log.info("Application entrypoint");

log.transports.console.bind(process.stdout);

if (process.env.SEGMENT_WRITE_KEY) {
  const segment = new SegmentAnalytics(process.env.SEGMENT_WRITE_KEY);
  segment.analytics.track({
    anonymousId: segment.anonymousId,
    event: "Console Application started",
  });
}

class AppUpdater {
  constructor() {
    log.info("init auto-updater");
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    void autoUpdater.checkForUpdatesAndNotify();
    autoUpdater.addListener("update-available", () => {
      log.info("update is available");
    });
    autoUpdater.addListener("update-downloaded", () => {
      log.info("update was downloaded");
    });
  }
}

const ROOT_PATH = {
  dist: path.join(__dirname, "../.."),
  public: path.join(__dirname, "../.."),
};

async function createWindow(options: { title?: string; port: number }) {
  log.info("createWindow", { options });
  await app.whenReady();

  const window = new BrowserWindow({
    title: options.title ?? "Get Started",
    icon: path.join(ROOT_PATH.public, "icon.ico"),
    width: Math.round(screen.getPrimaryDisplay().workAreaSize.width * 0.9),
    height: Math.round(screen.getPrimaryDisplay().workAreaSize.height * 0.9),
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      nodeIntegration: true,
    },
  });

  if (import.meta.env.DEV) {
    log.info("DEV mode");
    log.info("loadURL", `${import.meta.env.BASE_URL}?port=${options.port}`);
    void window.loadURL(`${import.meta.env.BASE_URL}?port=${options.port}`);
    if (!process.env.PLAYWRIGHT_TEST && !process.env.CI) {
      window.webContents.openDevTools();
    }
  } else {
    log.info("PROD mode");
    log.info("loadFile", path.join(ROOT_PATH.dist, "index.html"));
    void window.loadFile(path.join(ROOT_PATH.dist, "index.html"), {
      query: {
        port: options.port.toString(),
      },
    });
  }

  return window;
}

/**
 * Creates a window manager, which reuses windows if the file is already open.
 */
function createWindowManager() {
  const windows = new Map<string, BrowserWindow>();

  return {
    async open(simfile: string) {
      simfile = path.resolve(process.cwd(), simfile);

      const window = windows.get(simfile);
      if (window) {
        window.focus();
        return window;
      }

      let newWindow: BrowserWindow | undefined;
      let lastErrorMessage: string = "";

      const consoleLogger: ConsoleLogger = createConsoleLogger(
        (level, message) => {
          lastErrorMessage = "";
          if (level === "error") {
            lastErrorMessage = message;
            newWindow?.webContents.send("trpc.invalidate", "app.error");
          }
          newWindow?.webContents.send("trpc.invalidate", "app.logs");
        },
      );

      const cloudAppStateService = createCloudAppState((state) => {
        log.info("cloud app new state was sent to renderer process", state);
        newWindow?.webContents.send("app.cloudAppState", state);
        if (state === "success") {
          log.info("simulator loaded, invalidate trpc queries");
          // Clear the logs.
          consoleLogger.messages = [];
          // TODO: Use TRPC websockets.
          newWindow?.webContents.send("trpc.invalidate");
        }
      });

      const simulatorPromise = createWingApp({
        inputFile: simfile,
        sendCloudAppStateEvent: cloudAppStateService.send,
        consoleLogger,
      });

      // Create the express server and router for the simulator. Start
      // listening but don't wait for it, yet.
      consoleLogger.verbose("Starting the dev server...");

      const server = await createConsoleServer({
        cloudAppStateService,
        consoleLogger,
        simulatorPromise,
        errorMessage() {
          return lastErrorMessage;
        },
      });

      newWindow = await createWindow({
        title: path.basename(simfile),
        port: server.port,
      });

      newWindow.webContents.on(
        "ipc-message",
        async (event, channel, message) => {
          log.verbose("ipc-message", { channel, message });
          if (channel === "open-external-url") {
            await shell.openExternal(message);
            return;
          }
          if (channel === "webapp.ready") {
            log.verbose("webapp ready event sending current state");
            newWindow?.webContents.send(
              "app.cloudAppState",
              cloudAppStateService.getSnapshot().value,
            );
          }
        },
      );

      newWindow.setRepresentedFilename(simfile);
      windows.set(simfile, newWindow);

      const simulatorPromiseResolved = await simulatorPromise;
      const simulatorInstance = await simulatorPromiseResolved.get();

      simulatorInstance.onTrace({
        callback(event) {
          // TODO: Refactor the whole logs and events so we support all of the fields that the simulator uses.
          const message = `[${event.sourceType}] ${
            event.data.message ?? JSON.stringify(event.data, undefined, 2)
          }`;
          if (event.type === "log") {
            consoleLogger.log(message, "simulator");
          } else {
            consoleLogger.verbose(message, "simulator");
          }
        },
      });

      newWindow.on("closed", async () => {
        windows.delete(simfile);
        try {
          await Promise.all([server.server.close(), simulatorInstance.stop()]);
        } catch (error) {
          consoleLogger.error(error);
        }
      });

      return newWindow;
    },

    async showOpenFileDialog() {
      await app.whenReady();
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Wing File", extensions: ["wsim", "w"] }],
      });
      if (canceled) {
        return;
      }

      const [simfile] = filePaths;
      if (!simfile) {
        return;
      }

      return this.open(simfile);
    },
  };
}

log.info("Create window manager");
const windowManager = createWindowManager();

async function main() {
  if (!app.requestSingleInstanceLock()) {
    log.info("Another instance is already running, exiting");
    app.quit();
    return;
  }

  if (process.defaultApp) {
    const filename = process.argv[1];
    if (filename) {
      app.setAsDefaultProtocolClient(WING_PROTOCOL_SCHEME, process.execPath, [
        path.resolve(filename),
      ]);
    }
  } else {
    app.setAsDefaultProtocolClient(WING_PROTOCOL_SCHEME);
  }

  app.on("activate", (event, hasVisibleWindows) => {
    if (!hasVisibleWindows) {
      void windowManager.showOpenFileDialog();
    }
  });

  // If the application started by opening it directly, we should show the Get Started window.
  // Otherwise, the application was open using a file and we should start the simulator.
  let shouldShowGetStarted = true;

  app.on("open-url", (event, url) => {
    shouldShowGetStarted = false;

    const filename = url.slice(`${WING_PROTOCOL_SCHEME}://`.length);
    log.info("open-url", { url, filename });
    void windowManager.open(filename);
  });

  app.on("open-file", (event, filename) => {
    shouldShowGetStarted = false;

    log.info("open-file", { filename });
    void windowManager.open(filename);
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin" || import.meta.env.DEV) {
      app.quit();
    }
  });

  log.info("waiting for app to be ready...");
  await app.whenReady();
  log.info("app is ready");

  if (process.platform === "darwin") {
    // The default menu from Electron come with very useful items. We're going to reuse everything
    // except for the File menu, which is the second entry on the list.
    // TODO: Test it in different environments, since `Menu.getApplicationMenu()` may return null.
    const defaultMenuItems = Menu.getApplicationMenu()?.items!;
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([
        {
          ...defaultMenuItems[0]!,
          submenu: defaultMenuItems[0]!.submenu!.items.map((item) => ({
            ...item,
            label: item.label.replace("wing-console", "Wing Console"),
          })) as any,
        },
        {
          label: "File",
          submenu: [
            {
              label: "Open",
              accelerator: "Command+O",
              async click() {
                const { canceled, filePaths } = await dialog.showOpenDialog({
                  properties: ["openFile"],
                  filters: [{ name: "Wing File", extensions: ["wsim", "w"] }],
                });
                if (canceled) {
                  return;
                }

                const [simfile] = filePaths;
                if (simfile) {
                  void windowManager.open(simfile);
                }
              },
            },
            { type: "separator" },
            {
              label: "Close Window",
              accelerator: "Command+W",
              click() {
                BrowserWindow.getFocusedWindow()?.close();
              },
            },
          ],
        },
        ...defaultMenuItems.slice(2),
      ]),
    );
  }

  if (import.meta.env.DEV || process.env.PLAYWRIGHT_TEST || process.env.CI) {
    log.info("Running in dev mode, skipping Get Started window");
    if (!process.env.PLAYWRIGHT_TEST && !process.env.CI) {
      const installExtension = await import("electron-devtools-installer");
      await installExtension.default(installExtension.REACT_DEVELOPER_TOOLS.id);
    }
    // Open the demo Wing file (includes compiling).
    await windowManager.open(`${__dirname}/../../../../demo/index.w`);

    // Open the Construct Hub.
    // await windowManager.open(
    //   `${__dirname}/../../../../demo/constructHub/index.wsim`,
    // );
  } else {
    new AppUpdater();

    if (shouldShowGetStarted && BrowserWindow.getAllWindows().length === 0) {
      await windowManager.showOpenFileDialog();
    }
  }
}

log.info("Application start: main()");
void main();
