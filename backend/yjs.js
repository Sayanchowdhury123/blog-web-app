const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const { WebSocketServer } = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");
const logger = require("./utils/logger");
const jwt = require("jsonwebtoken");

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
  try {
    const origin = req.headers.origin;
    const allowed = [
      "http://localhost:5173",
      "https://blog-app-frontend-beta-nine.vercel.app",
    ];

    if (origin && !allowed.includes(origin)) {
      logger.info("🚫 Blocked Yjs from:", origin);
      socket.destroy();
      return;
    }

    const { pathname, searchParams } = new URL(
      req.url,
      `http://${req.headers.host}`
    );
    const token = decodeURIComponent(searchParams.get("token") || "");

    if (!token) {
      logger.info("🚫 Rejected: Missing token", { url: req.url });
      socket.destroy();
      return;
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT);
    } catch (err) {
      logger.info("🚫 Rejected: Invalid/expired token", {
        token: token.substring(0, 10) + "...",
      });
      socket.destroy();
      return;
    }

    yjsWss.handleUpgrade(req, socket, head, (ws) => {
      yjsWss.emit("connection", ws, req);
    });

    logger.info("✅ Authenticated Yjs connection", {
      userId: payload.id,
      doc: pathname,
    });
  } catch (error) {
    logger.info("❌ Upgrade handler error", error.message);
    socket.destroy();
  }
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => logger.info(`Yjs on ${PORT}`));
