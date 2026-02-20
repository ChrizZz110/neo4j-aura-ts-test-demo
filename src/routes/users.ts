import { Router } from "express";
import { getDriver } from "../db";
import { config } from "../config";
import { v4 as uuidv4 } from "uuid";

export const usersRouter = Router();

/**
 * POST /users
 * body: { name: string }
 * returns: { id, name }
 */
usersRouter.post("/", async (req, res) => {
    const name = String(req.body?.name ?? "").trim();
    if (!name) return res.status(400).json({ error: "name is required" });

    const id = uuidv4();
    const driver = getDriver();
    const session = driver.session({ database: config.neo4jDatabase });

    try {
        const result = await session.run(
            `
      CREATE (u:User {id: $id, name: $name})
      RETURN u { .id, .name } AS user
      `,
            { id, name }
        );

        const user = result.records[0]?.get("user");
        return res.status(201).json(user);
    } catch (e: any) {
        // if uniqueness constraint fails etc.
        return res.status(500).json({ error: "failed to create user", details: e?.message });
    } finally {
        await session.close();
    }
});

/**
 * GET /users
 * returns: [{ id, name }]
 */
usersRouter.get("/", async (_req, res) => {
    const driver = getDriver();
    const session = driver.session({ database: config.neo4jDatabase });

    try {
        const result = await session.run(
            `
      MATCH (u:User)
      RETURN u { .id, .name } AS user
      ORDER BY u.name ASC
      `
        );

        const users = result.records.map((r) => r.get("user"));
        return res.json(users);
    } catch (e: any) {
        return res.status(500).json({ error: "failed to list users", details: e?.message });
    } finally {
        await session.close();
    }
});

/**
 * GET /users/:id
 * returns: { id, name } or 404
 */
usersRouter.get("/:id", async (req, res) => {
    const id = String(req.params.id);
    const driver = getDriver();
    const session = driver.session({ database: config.neo4jDatabase });

    try {
        const result = await session.run(
            `
      MATCH (u:User {id: $id})
      RETURN u { .id, .name } AS user
      `,
            { id }
        );

        if (result.records.length === 0) return res.status(404).json({ error: "not found" });
        return res.json(result.records[0].get("user"));
    } catch (e: any) {
        return res.status(500).json({ error: "failed to fetch user", details: e?.message });
    } finally {
        await session.close();
    }
});