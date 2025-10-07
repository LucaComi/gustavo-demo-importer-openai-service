import express from 'express';

import 'dotenv/config';

import { fetchRecipes } from './openAIRequests.js';
import { parseResultOnFirebase } from './firebaseManager.js';
import {getLanguage} from "./languageManager.js"

const app = express();

const PORT = process.env.PORT || 8080;

// Middleware for body parsing
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  testConnection()
  res.send('Hello, Express with openAI!');
});

app.post("/process-import-recipe", async (req, res) => {
  const {url, languageCode} = req.body;
  console.log("Received data:", req.body);
  const language = getLanguage(languageCode); 
  const recipe = await fetchRecipes(url, language);
  console.log("RR:", recipe)
  await parseResultOnFirebase(recipe); 

  res.json({
    message: "Data received successfully",
    response: {recipe},
  });
});


app.listen(PORT, () => {
    console.log("The Server is observing incoming at port: " + PORT);
    
})