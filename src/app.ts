import express from "express";
import { usersRouter } from "./routes/users";
import { verifyConnectivity } from "./db";

export function createApp() {
    const app = express();

    app.use(express.json());

    // Liveness probe: doesn't need DB
    app.get("/health/live", (_req, res) => res.json({ status: "live" }));

    // Readiness probe: checks DB connectivity
    app.get("/health/ready", async (_req, res) => {
        try {
            await verifyConnectivity();
            res.json({ status: "ready" });
        } catch (e: any) {
            res.status(503).json({ status: "not-ready", details: e?.message });
        }
    });

    app.use("/users", usersRouter);

    // basic error handler
    app.use((err: any, _req: any, res: any, _next: any) => {
        res.status(500).json({ error: "internal error", details: err?.message ?? String(err) });
    });

    return app;
}