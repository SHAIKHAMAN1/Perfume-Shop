import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

/**
 * Next.js reuses modules across hot reloads in dev and across serverless
 * invocations in production. Cache the client promise on globalThis so we
 * don't open a new connection pool on every request.
 *
 * Pool settings follow the MongoDB connection skill's serverless guidance:
 * small max pool, minPoolSize 0, and short idle timeout.
 */
const options = {
  maxPoolSize: 5,
  minPoolSize: 0,
  maxIdleTimeMS: 20_000,
  connectTimeoutMS: 10_000,
  socketTimeoutMS: 30_000,
};

/** @type {Promise<MongoClient> | undefined} */
let clientPromise;

export function isMongoConfigured() {
  return Boolean(uri);
}

export function getMongoClient() {
  if (!uri) {
    throw new Error(
      'Missing MONGODB_URI. Copy .env.example to .env.local and start MongoDB.'
    );
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, options);

    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      clientPromise = client.connect();
    }
  }

  return clientPromise;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB_NAME ?? "my-app");
}
