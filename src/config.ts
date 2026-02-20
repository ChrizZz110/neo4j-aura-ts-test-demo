export type AppConfig = {
    port: number;
    neo4jUri: string;
    neo4jUser: string;
    neo4jPassword: string;
    neo4jDatabase?: string; // optional; Aura default often "neo4j"
};

function requireEnv(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing required environment variable: ${name}`);
    return v;
}

export const config: AppConfig = {
    port: Number(process.env.PORT ?? "8080"),
    neo4jUri: requireEnv("NEO4J_URI"),
    neo4jUser: requireEnv("NEO4J_USER"),
    neo4jPassword: requireEnv("NEO4J_PASSWORD"),
    neo4jDatabase: process.env.NEO4J_DATABASE
};