import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { registerRoutes } from "./routes.js";
import { serveStatic, log } from "./static.js"; // vite.js -> static.js

const app = express();
app.set('trust proxy', 1); // Add this line to trust the first proxy
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware (existing code is fine)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});


(async () => {
  // Production or Development, just register routes.
  // Vite is no longer handled here.
  await registerRoutes(app);
})();

export default app;
