// serve.ts — serve app/ on http://localhost:8080 for a local look.
// Usage: node serve.ts [--port 8080]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("./app", import.meta.url));
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
const port = Number(process.argv.find((a) => a.startsWith("--port="))?.split("=")[1] ?? 8080);

createServer(async (req, res) => {
  const path = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  }
}).listen(port, () => console.log("NusaStatistik at http://localhost:" + port));
