import request from "supertest";
import { createApp } from "../src/app";
import { closeDriver } from "../src/db";

describe("integration: users API against Aura", () => {
    const app = createApp();

    afterAll(async () => {
        await closeDriver();
    });

    it("should be live", async () => {
        const res = await request(app).get("/health/live");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("live");
    });

    it("should be ready (connect to Neo4j)", async () => {
        const res = await request(app).get("/health/ready");
        expect([200, 503]).toContain(res.status);
        if (res.status === 503) {
            throw new Error(`DB not ready: ${JSON.stringify(res.body)}`);
        }
        expect(res.body.status).toBe("ready");
    });

    it("should create and retrieve a user", async () => {
        const createRes = await request(app)
            .post("/users")
            .send({ name: "Ada Lovelace" });

        expect(createRes.status).toBe(201);
        expect(createRes.body.id).toBeDefined();
        expect(createRes.body.name).toBe("Ada Lovelace");

        const id = createRes.body.id;

        const getRes = await request(app).get(`/users/${id}`);
        expect(getRes.status).toBe(200);
        expect(getRes.body.id).toBe(id);
        expect(getRes.body.name).toBe("Ada Lovelace");
    });

    it("should list users", async () => {
        const res = await request(app).get("/users");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});