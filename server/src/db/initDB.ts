import { database } from "../db";

export const initDB = async (): Promise<boolean> => {
  let result: boolean = false;
  try {
    const sql = `
        DO $$ 
        DECLARE 
            r RECORD;
        BEGIN
            -- Отключаем триггеры для избежания ошибок при удалении
            SET session_replication_role = 'replica';
            
            -- Удаляем все таблицы в схеме public
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
            LOOP
                EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
            END LOOP;
            
            -- Удаляем все последовательности
            FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') 
            LOOP
                EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
            END LOOP;
            
            -- Включаем триггеры обратно
            SET session_replication_role = 'origin';
        END $$;
        
        -- Создаем таблицу Idea
        CREATE TABLE Idea (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
        
        -- Создаем таблицу Vote
        CREATE TABLE Vote (
            id SERIAL PRIMARY KEY,
            ip VARCHAR(45) NOT NULL, -- IPv6 поддерживает до 45 символов
            ideaId INTEGER NOT NULL,
            
            -- Создаем связь между Vote и Idea
            CONSTRAINT fk_vote_idea 
                FOREIGN KEY (ideaId) 
                REFERENCES Idea(id) 
                ON DELETE CASCADE
        );
        
        -- Заполняем таблицу Idea тестовыми данными
        INSERT INTO Idea (name) VALUES 
            ('Улучшение пользовательского интерфейса'),
            ('Добавление темной темы'),
            ('Интеграция с социальными сетями'),
            ('Мобильное приложение'),
            ('Система уведомлений'),
            ('Расширенная аналитика'),
            ('API для разработчиков'),
            ('Система достижений'),
            ('Оффлайн-режим'),
            ('Поддержка нескольких языков'),
            ('Улучшение поиска'),
            ('Упрощение процесса регистрации'),
            ('Увеличение функциональности админки'),
            ('Добавление функции онлайн-чата'),
            ('Улучшение производительности'),
            ('Увеличение безопасности'),
            ('Добавление функции поиска по истории'),
            ('Улучшение процесса голосования'),
            ('Увеличение функциональности клиента'),
            ('Добавление функции отчета результатов голосования');
        
        -- Создаем индекс для улучшения производительности связей
        CREATE INDEX idx_vote_idea_id ON Vote(ideaId);
        CREATE INDEX idx_vote_ip ON Vote(ip);    
    `;
    await database.query(sql);
    result = true;
  } catch (error) {
    console.error("[initDB]:", error);
  }
  return result;
};
