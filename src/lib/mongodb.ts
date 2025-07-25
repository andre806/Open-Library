import { MongoClient, Db, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://andrepaulomaialaurentino327:tmPl173rgtjNUhF5@openlibrary.rpmnbkm.mongodb.net/";

let client: MongoClient;
let db: Db;

export async function run() {
  if (db) return db; // reutiliza se já existe

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  await client.connect();
  db = client.db("open_library"); // ou o nome do seu banco
  return db;
}