import express from 'express';

import 'dotenv/config';

import { fetchRecipes } from './openAIRequests.js';

const app = express();

const PORT = process.env.PORT || 8080;

// Middleware for body parsing
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Hello, Express with openAI!');
});

app.post("/import-recipe", async (req, res) => {
  const {url} = req.body;
  console.log("Received data:", req.body);
  const recipe = await fetchRecipes(url)

  res.json({
    message: "Data received successfully",
    response: {recipe},
  });
});



app.listen(PORT, () => {
    console.log("The Server is observing incoming at port: " + PORT);
    // console.log("Import Payload:", searchPayload);
})