import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Status endpoint to check if the server is running
  app.get("/api/status", (req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      message: 'Server is running', 
      mode: 'client-side database',
      timestamp: new Date().toISOString()
    });
  });

  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ healthy: true });
  });

  // All other API routes will be handled client-side using localforage
  app.all("/api/*", (req: Request, res: Response) => {
    // This will only be triggered if no other route matched
    res.status(404).json({ 
      status: 'error', 
      message: 'API endpoint not found', 
      note: 'This application uses a client-side database. All data operations are performed directly in the browser.' 
    });
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
