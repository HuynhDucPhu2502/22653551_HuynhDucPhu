import { SQLiteDatabase } from "expo-sqlite";

export const initTable = async (db: SQLiteDatabase) => {
  // Tạo bảng nếu chưa có
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS grocery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      category TEXT,
      bought INTEGER DEFAULT 0,
      created_at INTEGER
    )
  `);

  const result = await db.getAllSync("SELECT * FROM grocery_items");

  if (result.length === 0) {
    await db.execAsync(`
      INSERT INTO grocery_items (name, quantity, bought, created_at) VALUES
      ('Sữa', 1, 0, ${Date.now()}),
      ('Trứng', 1, 0, ${Date.now()}),
      ('Bánh mì', 1, 0, ${Date.now()})
    `);
  }
};
