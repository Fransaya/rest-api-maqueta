import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let db;

export const connectToDb = async () => {
  if (db) return db;

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db(process.env.DB_NAME);
  return db;
};

export const getDb = () => {
  if (!db) {
    throw 'La base de datos no está conectada';
  }

  return db;
};
