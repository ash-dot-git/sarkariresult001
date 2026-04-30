import { MongoClient } from 'mongodb';

/**
 * MongoDB Connection Singleton — Serverless-Resilient
 * 
 * Uses a global cached client to prevent creating new connections on every
 * request in serverless environments (Netlify, Vercel). The connection is
 * pooled and reused across all server-side code (API routes, server components).
 * 
 * Key resilience features:
 *   - Automatic reconnection when the cached connection goes stale
 *   - withRetry() utility for transient failure recovery (timeout, network blips)
 *   - Ping-based health check before reusing cached connections
 * 
 * Configuration:
 *   - maxPoolSize: 10 connections (sufficient for serverless; prevents overloading Atlas)
 *   - minPoolSize: 0 connections (let the pool scale down fully between cold starts)
 *   - maxIdleTimeMS: 60s (closes idle connections to free Atlas resources)
 *   - serverSelectionTimeoutMS: 15s (a bit more room for cold-start DNS resolution)
 */

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'datavault';

if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI environment variable is not defined. ' +
    'Add it to your .env file: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/'
  );
}

/**
 * Connection options tuned for serverless deployment.
 */
const CONNECTION_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 0,           // Don't hold minimum connections in serverless (they go stale)
  maxIdleTimeMS: 60000,     // 60s — generous idle window to survive brief gaps between requests
  serverSelectionTimeoutMS: 15000, // 15s — more room for DNS + TLS on cold starts
  socketTimeoutMS: 45000,
  connectTimeoutMS: 15000,  // Match server selection timeout
  // Force IPv4 resolution to prevent 'querySrv EREFUSED' in Node.js 18+
  family: 4, 
  retryWrites: true,
  retryReads: true,
};

/**
 * Creates a fresh MongoClient and returns the connect() promise.
 */
function createClientPromise() {
  const c = new MongoClient(MONGODB_URI, CONNECTION_OPTIONS);
  return c.connect();
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise();
  }
} else {
  // In production mode, use a module-scoped variable.
  // If it goes stale, getClient() will recreate it.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise();
  }
}

/**
 * Returns a healthy MongoClient, reconnecting automatically if the
 * cached connection has gone stale (common in serverless cold starts).
 */
export async function getClient() {
  try {
    const client = await global._mongoClientPromise;
    // Quick health check — if the connection is stale this will throw
    await client.db('admin').command({ ping: 1 });
    return client;
  } catch (error) {
    console.warn('[MongoDB] Cached connection stale, reconnecting…', error.message);
    // Tear down the old client silently
    try {
      const oldClient = await global._mongoClientPromise;
      await oldClient.close();
    } catch { /* ignore close errors */ }
    // Create a fresh connection
    global._mongoClientPromise = createClientPromise();
    return global._mongoClientPromise;
  }
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

/**
 * Executes a database operation with automatic retry on transient failures.
 * Retries up to `maxRetries` times with exponential backoff.
 * 
 * Transient errors include: server selection timeout, network errors,
 * topology closed, pool cleared, etc.
 *
 * @param {() => Promise<T>} operation - The async DB operation to execute.
 * @param {number} [maxRetries=2] - Maximum number of retry attempts.
 * @returns {Promise<T>} The result of the operation.
 */
export async function withRetry(operation, maxRetries = 2) {
  const TRANSIENT_ERROR_PATTERNS = [
    'Server selection timed out',
    'topology was destroyed',
    'Topology is closed',
    'connection pool was cleared',
    'socket was unexpectedly closed',
    'ECONNRESET',
    'ETIMEDOUT',
    'ECONNREFUSED',
    'querySrv EREFUSED',
    'MongoNetworkError',
    'MongoServerSelectionError',
  ];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const isTransient = TRANSIENT_ERROR_PATTERNS.some(
        (pattern) => error.message?.includes(pattern) || error.name?.includes(pattern)
      );

      if (!isTransient || attempt === maxRetries) {
        throw error; // Not transient, or exhausted retries — propagate
      }

      const delayMs = Math.min(1000 * Math.pow(2, attempt), 4000); // 1s, 2s, 4s
      console.warn(
        `[MongoDB] Transient error on attempt ${attempt + 1}/${maxRetries + 1}, ` +
        `retrying in ${delayMs}ms: ${error.message}`
      );

      // Force reconnection before retrying
      try {
        const oldClient = await global._mongoClientPromise;
        await oldClient.close();
      } catch { /* ignore */ }
      global._mongoClientPromise = createClientPromise();

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export async function closeConnection() {
  if (global._mongoClientPromise) {
    try {
      const client = await global._mongoClientPromise;
      await client.close();
    } catch { /* ignore */ }
    global._mongoClientPromise = null;
  }
}
