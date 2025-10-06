import express from "express";
import { ApiResponse, IdeaRow } from "@root/types";
import { database } from "@/db";

const getIdeas = async (
  req: express.Request,
  res: express.Response<ApiResponse<IdeaRow[]>>,
) => {
  const result: ApiResponse<IdeaRow[]> = {
    success: false,
    data: [],
  };

  try {
    // Возвращаем только поля таблицы БД, без вычисляемых полей
    const ideas: IdeaRow[] = await database.any(
      `
      SELECT 
        i.id,
        i.name
      FROM Idea i
      ORDER BY (
        SELECT COUNT(*) FROM Vote v2 WHERE v2.ideaId = i.id
      ) DESC, i.id ASC
      `
    );

    result.data = ideas;
    result.success = true;
  } catch (error) {
    console.error("[getIdeas][error]:", error);
    if (error instanceof Error) {
      result.error = error.message;
    }
  }
  res.status(200).json(result);
};

export { getIdeas };
