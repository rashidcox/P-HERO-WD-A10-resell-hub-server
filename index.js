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
      .db("auth_next_db")
      .collection("user")
      .find()
      .toArray();
    res.json(users);
  },
);

// Add a new user
app.post("/api/job", async (req, res) => {
  const job = req.body;
  const result = await await client
    .db("auth_next_db")
    .collection("Jobs")
    .insertOne(job);
  res.send(result);
});

// Get jobs
app.get("/api/jobs", async (req, res) => {
  const jobs = await client
    .db("auth_next_db")
    .collection("Jobs")
    .find()
    .toArray();
  res.json(jobs);
});

// add company
app.post("/api/company", async (req, res) => {
  const company = req.body;
  const result = await await client
    .db("auth_next_db")
    .collection("company")
    .insertOne(company);
  res.send(result);
});

app.get("/", (req, res) => {
  res.send("You can access the server APIII");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
