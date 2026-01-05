const dotenv = require("dotenv")
dotenv.config()
const http = require("http");
const { WebSocketServer } = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");
const logger = require("./utils/logger");

const server = http.createServer((req, res) => {

  if (req.url === "/health") {
    res.writeHead(200).end("Yjs alive");
    return;
  }
  res.writeHead(404).end("Yjs WebSocket server — connect via ws://");
});

const yjsWss = new WebSocketServer({ noServer: true });

yjsWss.on("connection", (ws, req) => {
  logger.info("✅ Yjs connected", { path: req.url });
  setupWSConnection(ws, req);
});

server.on("upgrade", (req, socket, head) => {
  yjsWss.handleUpgrade(req, socket, head, (ws) => {
    yjsWss.emit("connection", ws, req);
  });
});

const PORT = process.env.PORT || 5001; 
server.listen(PORT,() => logger.info(`Yjs on ${PORT}`));
