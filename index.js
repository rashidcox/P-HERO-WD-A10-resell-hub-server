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


// API endpoint to fetch all products
app.get("/api/products", async (req, res) => {
  try {
    const productsCollection = client.db("resellHubDB").collection("products");
    const products = await productsCollection.find().toArray();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// API endpoint to add a new product
app.post("/api/products", async (req, res) => {
  try {
    const productsCollection = client.db("resellHubDB").collection("products");
    const product = req.body;
    const result = await productsCollection.insertOne(product);
    res.json(result);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = app;
