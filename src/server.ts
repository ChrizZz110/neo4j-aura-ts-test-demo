import { createApp } from "./app";
import { closeDriver, verifyConnectivity } from "./db";
import { config } from "./config";

async function main() {
    // Optional: fail fast if DB is unreachable at startup
    await verifyConnectivity();

    const app = createApp();
    const server = app.listen(config.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server listening on port ${config.port}`);
    });

    const shutdown = async (signal: string) => {
        // eslint-disable-next-line no-console
        console.log(`Received ${signal}. Shutting down...`);
        server.close(async () => {
            await closeDriver();
            process.exit(0);
        });
    };

    process.on("SIGTERM", () => void shutdown("SIGTERM"));
    process.on("SIGINT", () => void shutdown("SIGINT"));
}

main().catch((e) => {
    // eslint-disable-next-line no-console
    console.error("Fatal startup error:", e);
    process.exit(1);
});