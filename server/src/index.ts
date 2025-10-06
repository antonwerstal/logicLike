import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRoutes from "./routes/api";
import { database } from "@/db";
import { ApiResponse } from "@root/types";
import { clientIpMiddleware } from "@/middleware/clientIp";

const app = express();
const PORT = process.env.PORT || 4444;

// Middleware
// Доверяем заголовку X-Forwarded-For от прокси (если сервер работает за прокси/балансировщиком)
app.set("trust proxy", true);
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clientIpMiddleware);

// Функция монтирования всех API-роутов. Вызывается ТОЛЬКО при успешном подключении к БД
function mountApi(app: express.Express) {
  // Health внутри /api доступен только если БД в порядке на старте
  app.get(
    "/api/health",
    async (
      req: express.Request,
      res: express.Response<ApiResponse>,
    ): Promise<void> => {
      res.status(200).json({ success: true });
    },
  );

  // Менеджер API моделей
  app.use("/api", apiRoutes);
}

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

// Инициализация: проверяем БД и условно монтируем API, затем регистрируем 404 и обработчик ошибок
(async () => {
  try {
    await database.one("select 1 as value");
    mountApi(app);
    console.log(`📡 API доступно по адресу: http://localhost:${PORT}/api`);
    console.log("💡 Для сброса БД используйте: npm run reset-db");
  } catch (error) {
    console.error(
      "❌ Не удалось подключиться к базе данных на старте. API не смонтирован.",
      error,
    );
  } finally {
    // Обработка 404
    app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        error: "Эндпоинт не найден",
        path: req.originalUrl,
      });
    });

    // Обработка ошибок (должна быть последней)
    app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        console.error(err.stack);
        res.status(500).json({
          error: "Внутренняя ошибка сервера",
          message: err.message,
        });
      },
    );
  }
})();
