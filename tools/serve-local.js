const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "127.0.0.1";
const port = Number(process.env.PORT || 5501);
const root = path.resolve(process.cwd());
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

http
  .createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
    const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const filePath = path.resolve(root, relativePath);

    if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    fs.stat(filePath, (statError, stats) => {
      const target = !statError && stats.isDirectory() ? path.join(filePath, "index.html") : filePath;
      fs.readFile(target, (readError, data) => {
        if (readError) {
          response.writeHead(readError.code === "ENOENT" ? 404 : 500).end("Not found");
          return;
        }
        response.writeHead(200, {
          "Cache-Control": "no-store",
          "Content-Type": mimeTypes[path.extname(target).toLowerCase()] || "application/octet-stream",
        });
        response.end(data);
      });
    });
  })
  .listen(port, host, () => {
    console.log(`Servidor local: http://${host}:${port}/`);
  });
