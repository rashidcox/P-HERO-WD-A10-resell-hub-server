const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client
  .connect(() => {
    console.log("Connected to MongoDB");
  })
  .catch();


app.get(
  "/api/users",
  (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);
    next();
  },
  async (req, res) => {
    const users = await client
      .db("resellHubDB")
      .collection("users")
      .find()
      .toArray();
    res.json(users);
  },
);

// Get all products
app.get("/api/products", async (req, res) => {
  const products = await client
    .db("resellHubDB") 
    .collection("products")
    .find()
    .toArray();
  res.json(products);
});


app.get("/", (req, res) => {
  res.send("Resell Hub Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
