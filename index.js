const Utils = require("./utils");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const cors = require("cors");
const websocket = require("./wsserver");
const task = require("./routes/task");

const uri =
  "mongodb+srv://superant_1:43Wq8m6vc4Qdgi4z@cluster0.59usi.mongodb.net/db1?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => Utils.log("Connected to MongoDB..."))
  .catch((err) => Utils.error("Could not connect to MongoDB..."));

const app = express();
app.use(
  cors({
    origin: "http://localhost:3001", // Replace with your Next.js app URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use("/api/v1/tasks", task);

// // Custom middleware (applied on all routes)
// app.use(function(req, res, next)) {
// // …
// next();
// }

// // Custom middleware (applied on routes starting with /api/admin)
// app.use(‘/api/admin’, function(req, res, next)) {
// // …
// next();
// }

const server = http.createServer(app);
websocket.initializeWebSocket(server);

// Store connected cli
const port = process.env.PORT || 3000;
app.listen(port, () => Utils.log(`Listening on port ${port}...`));

const wsport = process.env.PORT || 3030;
server.listen(wsport, () => {
  Utils.log(`WebSocket server is listening on ws://localhost:${wsport}`);
});

// Graceful shutdown
const shutdown = () => {
  Utils.log("Shutting down server...");
  server.close(() => {
    Utils.log("HTTP server closed.");
    websocket.shutdown(); // Close WebSocket connections
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
