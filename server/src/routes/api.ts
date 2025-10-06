import express from "express";

// импорты api моделей
import ideasRoutes from "./ideas";
import votesRoutes from "./votes";

const router = express.Router();

// Регистрируем роуты для каждой модели данных
router.use("/ideas", ideasRoutes);
router.use("/votes", votesRoutes);

export default router;
