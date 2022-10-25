const http = require("http");

const server = http.createServer((req, res) => {
  const routes = {
    "/testCache": () => {
      res.setHeader("cache-control", "max-age=100");
      res.setHeader("age", "90");
      res.end("Cache 100s");
    }
  };

  for (const [path, handle] of Object.entries(routes)) {
    if (req.url === path) {
      handle();
    }
  }
});

server.listen(3000, () => {
  console.log("Listening");
});
