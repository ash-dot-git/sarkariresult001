import { MongoClient } from 'mongodb';

/**
 * MongoDB Connection Singleton
 * 
 * Uses a global cached client to prevent creating new connections on every
 * request in serverless environments (Netlify, Vercel). The connection is
 * pooled and reused across all server-side code (API routes, server components).
 * 
 * Configuration:
 *   - maxPoolSize: 10 connections (sufficient for serverless; prevents overloading Atlas)
 *   - minPoolSize: 2 connections (keeps warm connections ready for fast queries)
 *   - maxIdleTimeMS: 30s (closes idle connections to free Atlas resources)
 *   - serverSelectionTimeoutMS: 5s (fail fast if Atlas is unreachable)
 */

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'datavault';

if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI environment variable is not defined. ' +
    'Add it to your .env file: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/'
  );
}

// Replaced by clientPromise architecture
// let cachedClient = null;
// let cachedDb = null;

/**
 * Connection options tuned for serverless deployment.
 * Keeps a small pool of ready connections while respecting Atlas free-tier limits.
 */
const CONNECTION_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // Force IPv4 resolution to prevent 'querySrv EREFUSED' in Node.js 18+
  family: 4, 
  retryWrites: true,
  retryReads: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, CONNECTION_OPTIONS);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI, CONNECTION_OPTIONS);
  clientPromise = client.connect();
}

export async function getClient() {
  return clientPromise;
}

export async function getDb() {
  const client = await getClient();
  return client.db(DB_NAME);
}

/**
 * Returns a specific collection from the default database.
 * Convenience wrapper to avoid repeating db.collection() everywhere.
 *
 * @param {string} collectionName - The name of the collection.
 * @returns {Promise<import('mongodb').Collection>} The requested collection.
 */
export async function getCollection(collectionName) {
  const db = await getDb();
  return db.collection(collectionName);
}

export async function closeConnection() {
  if (clientPromise) {
    const client = await clientPromise;
    await client.close();
    clientPromise = null;
  }
}
