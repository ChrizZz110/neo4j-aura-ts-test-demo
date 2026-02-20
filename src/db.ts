import neo4j, { Driver } from "neo4j-driver";
import { config } from "./config";

let driver: Driver | null = null;

export function getDriver(): Driver {
    if (driver) return driver;

    driver = neo4j.driver(
        config.neo4jUri,
        neo4j.auth.basic(config.neo4jUser, config.neo4jPassword),
        {
            // Aura is TLS by default; neo4j+s / bolt+s URIs handle encryption automatically.
            // Keep defaults; tune later if needed (pool size, timeouts, etc.)
        }
    );

    return driver;
}

export async function verifyConnectivity(): Promise<void> {
    const d = getDriver();
    await d.verifyConnectivity();
}

export async function closeDriver(): Promise<void> {
    if (driver) {
        await driver.close();
        driver = null;
    }
}