import express from 'express';

import 'dotenv/config';

import { fetchRecipes } from './openAIRequests.js';
import { parseResultOnFirebase } from './firebaseManager.js';
import {getLanguage} from "./languageManager.js"

import {requestStatusHandler} from "./requestHandler.js"

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
  try {
    // Parse and validate input
    const { url, languageCode } = req.body;

    if (!url || !languageCode) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_FIELDS",
        message: "Both 'url' and 'languageCode' are required.",
      });
    }

    console.log("Received data:", req.body);

    // 2️⃣ Fetch recipe data from OpenAI (may fail)
    const {recipeResponse, requestUsage} = await fetchRecipes(url, getLanguage(languageCode));


    // 3️⃣ Evaluate the response validity
    if (requestStatusHandler(recipeResponse)) {
      // ✅ Success: store result in Firebase
      let docRefID = await parseResultOnFirebase(recipeResponse, requestUsage, url);
      return res.status(200).json({
        success: true,
        message: "Recipe imported successfully.",
        data: recipeResponse,
        docRefID: docRefID
      });
    } else {
      // OpenAI or parsing failed
      console.warn("⚠️ Recipe import failed:", recipeResponse);

      return res.status(422).json({
        success: false,
        errorCode:  "RECIPE_PARSE_FAILED",
        message: "Could not import recipe from the provided link.",
      });
    }
  } catch (error) {
    // 4️⃣ Catch unexpected or network-level errors
    console.error("Error in /process-import-recipe:", error);

    return res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "An unexpected error occurred while processing the recipe.",
    });
  }
});


app.listen(PORT, () => {
    console.log("The Server is observing incoming at port: " + PORT);
    
})