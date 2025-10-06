import express from "express";
import { getIdeas } from "@/controllers/ideaController";
const router = express.Router();

// Получение списка идей
router.get("/", getIdeas);

export default router;
