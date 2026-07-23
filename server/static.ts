import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // __dirname will be dist/ in production
  const distDir = path.resolve(__dirname);
  const projectRoot = path.resolve(distDir, "..");

  // Serve the static landing page (church website) at root /
  const staticPath = path.resolve(projectRoot, "static");
  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));
  }

  // Handle root route - serve static index.html
  const staticIndex = path.resolve(staticPath, "index.html");
  app.get("/", (_req, res) => {
    if (fs.existsSync(staticIndex)) {
      res.sendFile(staticIndex);
    } else {
      // Fallback if static doesn't exist
      const distPublicPath = path.resolve(distDir, "public");
      res.sendFile(path.resolve(distPublicPath, "index.html"));
    }
  });

  // Serve the React admin app at /admin
  const distPublicPath = path.resolve(distDir, "public");
  if (!fs.existsSync(distPublicPath)) {
    throw new Error(
      `Could not find the build directory: ${distPublicPath}, make sure to build the client first`,
    );
  }

  // Serve admin assets (JS, CSS, images) from the React build
  app.use("/admin/assets", express.static(path.resolve(distPublicPath, "assets")));

  // All other /admin/* routes serve the React app's index.html (SPA fallback)
  app.get("/admin*", (_req, res) => {
    res.sendFile(path.resolve(distPublicPath, "index.html"));
  });
}
