bring cloud;
bring util;

let q = new cloud.Queue(cloud.QueueProps{retentionPeriod: 5s});

test "retentionPeriod" {
  q.push("hello");
  q.push("world");
  
  util.sleep(10s);

  assert(util.waitUntil((): bool => {
    return q.approxSize() == 2;
  }));
}
