import express from "express";
import { ApiResponse, Vote, VoteStatus } from "@root/types";
import { database } from "@/db";

const LIMIT_VOTES_PER_IP = 10;

const createVote = async (
  req: express.Request,
  res: express.Response<ApiResponse<Vote | null>>,
) => {
  let status: number = 200;
  const result: ApiResponse<Vote | null> = {
    success: false,
    data: null,
  };

  try {
    const clientIp = req.clientIp || "";
    const { ideaId } = req.body;

    // Если пустой IP, то возвращаем ошибку
    if (!clientIp || typeof ideaId !== "number" || isNaN(ideaId)) {
      status = 400;
      result.success = false;
      throw new Error("Неверные параметры");
    }

    // Запрашиваем все голоса от текущего ip, для валидации лимита и существования
    const votesByIp = await database.any(
      'SELECT id, ip, ideaId as "ideaId" FROM Vote WHERE ip = $1',
      [clientIp],
    );

    if (votesByIp.length >= LIMIT_VOTES_PER_IP) {
      status = 409;
      result.success = false;
      throw new Error("Превышен лимит голосов");
    }

    if (votesByIp.some((r) => r.ideaId === ideaId)) {
      status = 409;
      result.success = false;
      throw new Error("Голос уже был учтен");
    }

    // Создаем голос
    const [newVote] = await database.any(
      'INSERT INTO Vote (ideaId, ip) VALUES ($1, $2) RETURNING id, ip, ideaId AS "ideaId"',
      [ideaId, clientIp],
    );
    result.success = true;
    result.data = newVote;
  } catch (error) {
    console.error("[createVote]:", error);
    if (error instanceof Error) {
      result.error = error.message;
    }
  }

  res.status(status).json(result);
};

const getVoteStatus = async (
  req: express.Request,
  res: express.Response<ApiResponse<VoteStatus[]>>,
) => {
  const result: ApiResponse<VoteStatus[]> = {
    success: false,
    data: [],
  };

  try {
    const clientIp = req.clientIp || "";
    const { ideaIds } = req.query;

    if (!ideaIds || typeof ideaIds !== "string") {
      result.success = false;
      result.error =
        "Необходимо передать ideaIds как JSON строку в query параметре";
      return res.status(400).json(result);
    }

    let ideaIdsArray: number[];
    try {
      ideaIdsArray = JSON.parse(ideaIds);
    } catch (parseError) {
      result.success = false;
      result.error = "ideaIds должен быть валидной JSON строкой";
      return res.status(400).json(result);
    }

    if (!Array.isArray(ideaIdsArray)) {
      result.success = false;
      result.error = "ideaIds должен быть массивом";
      return res.status(400).json(result);
    }

    // Фильтруем только валидные ID
    const validIds = ideaIdsArray.filter(
      (id) => typeof id === "number" && !isNaN(id),
    );

    if (validIds.length === 0) {
      result.data = [];
      result.success = true;
      return res.status(200).json(result);
    }

    // Получаем статус голосов для переданных идей
    const voteStatuses: VoteStatus[] = await database.any(
      `
      SELECT 
        i.id AS "ideaId",
        NOT EXISTS (
          SELECT 1 FROM Vote v WHERE v.ideaId = i.id AND v.ip = $1
        ) AS "canVoting"
      FROM Idea i
      WHERE i.id = ANY($2)
      `,
      [clientIp, validIds],
    );

    result.data = voteStatuses;
    result.success = true;
  } catch (error) {
    console.error("[getVoteStatus][error]:", error);
    if (error instanceof Error) {
      result.error = error.message;
    }
  }
  res.status(200).json(result);
};

export { createVote, getVoteStatus };
