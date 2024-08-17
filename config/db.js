const { MongoClient, ServerApiVersion } = require("mongodb");

const url = process.env.DB_URL;
const dbName = "super-shop";

let db;

const connectDB = async () => {
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  // Return the cached connection if it already exists
  if (db) return db;
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  // Cache the database connection
  db = client.db(dbName);
  return db;
};

module.exports = connectDB;
