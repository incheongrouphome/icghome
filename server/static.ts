import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "client", "dist");

  if (!fs.existsSync(distPath)) {
    console.warn(
      `Static file directory not found: ${distPath}. Build the client first.`
    );
    return;
  }

  app.use(express.static(distPath));

  // Fallback for SPA
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
} 