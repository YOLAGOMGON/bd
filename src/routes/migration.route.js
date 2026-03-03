import { Router } from "express";
import { loadMigration } from "../controllers/migration.controller.js";

export const migrationRoutes = Router();

migrationRoutes.post("/", loadMigration);
