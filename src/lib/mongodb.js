// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_DATA_URI;
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  console.log(">>> Creating NEW MongoClient connection"); // Debug
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
} else {
  console.log(">>> Reusing existing MongoClient connection"); // Debug
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
