import { getDb, isMongoConfigured } from "@/lib/mongodb";

const COLLECTION = "tasks";

/**
 * Tasks live in a single collection — no joins needed for the homepage list.
 * Index supports the primary read pattern: filter by status, sort newest first.
 */
export async function ensureTaskIndexes() {
  const db = await getDb();
  await db
    .collection(COLLECTION)
    .createIndex({ status: 1, createdAt: -1 }, { name: "status_createdAt" });
}

export async function listTasks({ status, limit = 20 } = {}) {
  const db = await getDb();
  const filter = status ? { status } : {};
  return db
    .collection(COLLECTION)
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getTaskStats() {
  const db = await getDb();
  const [total, done] = await Promise.all([
    db.collection(COLLECTION).countDocuments(),
    db.collection(COLLECTION).countDocuments({ status: "done" }),
  ]);

  return { total, done, todo: total - done };
}

export async function getTasksForPage() {
  if (!isMongoConfigured()) {
    return {
      configured: false,
      tasks: [],
      stats: null,
      error: null,
    };
  }

  try {
    await ensureTaskIndexes();
    const [tasks, stats] = await Promise.all([listTasks(), getTaskStats()]);

    return {
      configured: true,
      tasks,
      stats,
      error: null,
    };
  } catch (error) {
    return {
      configured: true,
      tasks: [],
      stats: null,
      error: error instanceof Error ? error.message : "Could not reach MongoDB",
    };
  }
}
