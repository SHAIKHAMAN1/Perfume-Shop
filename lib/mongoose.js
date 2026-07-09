/**
 * Mongoose connection — reuses the existing MONGODB_URI from .env.local.
 * Caches the connection on globalThis to survive Next.js hot reloads in dev.
 * Does NOT replace lib/mongodb.js (native driver still used where needed).
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

/** @type {{ conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }} */
const globalForMongoose = globalThis;

if (!globalForMongoose.mongooseCache) {
  globalForMongoose.mongooseCache = { conn: null, promise: null };
}

const cached = globalForMongoose.mongooseCache;

/**
 * Connect to MongoDB via Mongoose.
 * Returns a cached connection in development to avoid new connections per hot reload.
 * @returns {Promise<typeof mongoose>}
 */
export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands   : false,
      maxPoolSize      : 5,
      minPoolSize      : 0,
      maxIdleTimeMS    : 20_000,
      connectTimeoutMS : 10_000,
      socketTimeoutMS  : 30_000,
      dbName           : process.env.MONGODB_DB_NAME ?? "my-app",
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectDB;
