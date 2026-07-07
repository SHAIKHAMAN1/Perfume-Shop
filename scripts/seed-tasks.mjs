import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/my-app";
const dbName = process.env.MONGODB_DB_NAME ?? "my-app";

const seedTasks = [
  {
    title: "Configure MongoDB MCP in Cursor",
    status: "todo",
    createdAt: new Date(),
  },
  {
    title: "Wire Next.js to MongoDB with a cached client",
    status: "done",
    createdAt: new Date(Date.now() - 86_400_000),
  },
  {
    title: "Add a compound index on status + createdAt",
    status: "done",
    createdAt: new Date(Date.now() - 172_800_000),
  },
];

const client = new MongoClient(uri, {
  maxPoolSize: 5,
  connectTimeoutMS: 10_000,
});

try {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("tasks");

  await collection.deleteMany({});
  await collection.insertMany(seedTasks);
  await collection.createIndex(
    { status: 1, createdAt: -1 },
    { name: "status_createdAt" }
  );

  const count = await collection.countDocuments();
  console.log(`Seeded ${count} tasks in ${dbName}.tasks`);
} finally {
  await client.close();
}
