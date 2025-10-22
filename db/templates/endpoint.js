import { getDb } from '../config';

// Ejemplo de conexión a la base de datos en un endpoint
export const getUsers = async () => {
  const db = await getDb();
  const collection = db.collection('users');
  const users = await collection.find().toArray();
  return users;
};
