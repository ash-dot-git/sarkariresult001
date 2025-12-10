// src/lib/mongo-pool.js
import { MongoClient } from 'mongodb';

const clients = new Map();

export async function getMongoClient(uri) {
  if (!uri) throw new Error('MongoDB URI is missing');

  // console.log(`\nRequested MongoDB connection for URI ending with: ${uri.slice(-15)}`);

  if (clients.has(uri)) {
    // console.log('Reusing EXISTING connection (POOL HIT)');
  } else {
    // console.log('Creating NEW connection (FIRST TIME)');
    const client = new MongoClient(uri, {
      maxPoolSize: 20,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    const connectPromise = client.connect();
    clients.set(uri, connectPromise);

    // Log when connection actually succeeds
    connectPromise.then(() => {
      // console.log('NEW MongoDB connection SUCCESSFULLY established');
    }).catch(err => {
      console.error('MongoDB connection FAILED:', err.message);
      clients.delete(uri);
    });
  }

  const client = await clients.get(uri);
  // console.log('Connection returned to caller — ready to use\n');
  return client;
}