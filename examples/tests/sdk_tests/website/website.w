bring cloud;
bring http;

let w = new cloud.Website(path: "./website");
let config = Json { json: 1 };

class Util {
  extern "../external/fs.js" static readFile(path: str): str;    
}
 
let indexFile = Util.readFile("./website/website/index.html");
let otherFile = Util.readFile("./website/website/inner-folder/other.html");

w.addJson("config.json", config);

// asserting the website path exists and points to the right folder
assert(w.path.endsWith("sdk_tests/website/website") || w.path.endsWith("sdk_tests\\website\\website"));


test "access files on the website" {
    assert(http.get(w.url).body == indexFile);
    assert(http.get(w.url + "/inner-folder/other.html").body == otherFile);
    assert(http.get(w.url + "/config.json").body == Json.stringify(config));
}  
