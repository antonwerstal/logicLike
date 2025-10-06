import { database } from "../db";
import { initDB } from "./initDB";

/**
 * Скрипт для сброса базы данных
 * Удаляет все таблицы и пересоздает их с тестовыми данными
 */
const resetDatabase = async (): Promise<void> => {
  try {
    console.log("🔄 Начинаем сброс базы данных...");
    
    // Проверяем подключение к БД
    await database.one("select 1 as value");
    console.log("✅ Подключение к базе данных установлено");
    
    // Выполняем сброс и инициализацию
    const success = await initDB();
    
    if (success) {
      console.log("✅ База данных успешно сброшена и инициализирована");
      console.log("📊 Созданы таблицы: Idea, Vote");
      console.log("🌱 Загружены тестовые данные (10 идей)");
    } else {
      console.error("❌ Ошибка при сбросе базы данных");
      process.exit(1);
    }
    
  } catch (error) {
    console.error("❌ Ошибка подключения к базе данных:", error);
    process.exit(1);
  } finally {
    // Закрываем соединение с БД
    await database.$pool.end();
    console.log("🔌 Соединение с базой данных закрыто");
    process.exit(0);
  }
};

// Запускаем сброс БД
resetDatabase();
