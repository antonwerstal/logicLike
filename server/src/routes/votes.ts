import express from "express";
import { createVote, getVoteStatus } from "@/controllers/voteController";
const router = express.Router();

// Создание голоса
router.post("/", createVote);

// Получение статуса голосов для списка идей
router.get("/status", getVoteStatus);

export default router;
