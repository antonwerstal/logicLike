import pgPromise from "pg-promise";

const pgp = pgPromise();

const config = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "logic_like",
  password: process.env.DB_PASSWORD || "postgres",
  port: Number(process.env.DB_PORT || 5432),
};

const connectionUrl = `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;

const database = pgp(connectionUrl);

export { database };
