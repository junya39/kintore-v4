import * as SQLite from "expo-sqlite";

// —— データベースは「非同期で1回だけ」開く
const dbPromise = SQLite.openDatabaseAsync("kintore.db");

// —— スキーマ初期化（この Promise が解決したらDBは準備完了）
export const ready = (async () => {
  const db = await dbPromise;
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      body_part TEXT
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL,
      started_at TEXT NOT NULL,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL,
      set_index INTEGER NOT NULL,
      weight REAL,
      reps INTEGER,
      FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
    );
  `);
})();

// ========== API（必ず await ready の後で実行） ==========

export async function insertExercise(name: string, bodyPart?: string | null) {
  await ready;
  const db = await dbPromise;
  const r = await db.runAsync(
    `INSERT INTO exercises (name, body_part) VALUES (?, ?)`,
    [name.trim(), bodyPart ?? null]
  );
  return r.lastInsertRowId!;
}

/** 追加：名前から exercises を検索→無ければ作成して id を返す */
export async function getOrCreateExerciseByName(name: string, bodyPart?: string | null) {
  await ready;
  const db = await dbPromise;

  const found = await db.getFirstAsync<{ id: number }>(
    `SELECT id FROM exercises WHERE name = ? LIMIT 1`,
    [name]
  );
  if (found?.id) return found.id;

  const r = await db.runAsync(
    `INSERT INTO exercises (name, body_part) VALUES (?, ?)`,
    [name.trim(), bodyPart ?? null]
  );
  return r.lastInsertRowId!;
}

export async function insertWorkout(exerciseId: number, startedAtISO: string) {
  await ready;
  const db = await dbPromise;
  const r = await db.runAsync(
    `INSERT INTO workouts (exercise_id, started_at) VALUES (?, ?)`,
    [exerciseId, startedAtISO]
  );
  return r.lastInsertRowId!;
}

export async function insertSet(
  workoutId: number,
  setIndex: number,
  weight?: number | null,
  reps?: number | null
) {
  await ready;
  const db = await dbPromise;
  await db.runAsync(
    `INSERT INTO sets (workout_id, set_index, weight, reps) VALUES (?, ?, ?, ?)`,
    [workoutId, setIndex, weight ?? null, reps ?? null]
  );
}

export type HistoryRow = {
  id: number;
  started_at: string;
  exercise_name: string | null;
  set_count: number;
};

export async function getSessionsWithCounts(limit = 50) {
  await ready;
  const db = await dbPromise;
  const rows = await db.getAllAsync<HistoryRow>(
    `
    SELECT
      w.id,
      w.started_at,
      e.name AS exercise_name,
      COUNT(s.id) AS set_count
    FROM workouts w
    LEFT JOIN exercises e ON e.id = w.exercise_id
    LEFT JOIN sets s ON s.workout_id = w.id
    GROUP BY w.id
    ORDER BY datetime(w.started_at) DESC
    LIMIT ?;
    `,
    [limit]
  );
  return rows;
}

export async function debugDump(tag: string) {
  await ready;
  const db = await dbPromise;
  console.log("==== DB DUMP:", tag);
  const tables = await db.getAllAsync<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table'`
  );
  for (const t of tables) {
    const rows = await db.getAllAsync<any>(`SELECT * FROM ${t.name} LIMIT 20`);
    console.log(t.name, rows);
  }
}
