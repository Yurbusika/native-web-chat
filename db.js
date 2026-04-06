import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath =
  process.env.DATABASE_PATH ?? path.join(__dirname, 'database.db');

export const db = await new Promise((resolve, reject) => {
  const instance = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.log("Database connection failed", err);
      reject(err);
      return;
    }
    console.log("Database connected");
    resolve(instance);
  });
});