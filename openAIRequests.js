import OpenAI from "openai";
import 'dotenv/config';
import { zodTextFormat } from "openai/helpers/zod";
import { RecipesResponseSchema } from "./requestSchema.js";


const openai = new OpenAI({
  apiKey: process.env.SECRET_OPENAI,
});


export async function fetchRecipes(link, language) {

  const response = await openai.responses.parse({
  model: "gpt-5-mini",
  input: `From the following link: ${link}, extract the recipe and return the information in structured format with the following fields:

      - Title of the recipe
      - Short description (2–3 sentences)
      - Country
      - Category (choose one: Appetizer, Main, Side, Dessert, Snack)
      - Ingredients scaled for 1 portion (each ingredient as a separate item)
      - COMPLETE step-by-step instructions (MUST include every single cooking step, don't number the steps)
      - Preparation time 
      - Cooking time

    CRITICAL: The instructions array MUST contain ALL steps from the recipe. Make sure the output is well-structured and easy to parse. Translate the output in ${language}
    
    Set the field importStatus in the output to true only if you can successfully extract the recipe
    `,

  text: {
    format: zodTextFormat(RecipesResponseSchema, "recipes_results"),
  },
  reasoning: {
    // by reducithg the effort, we can speed up the response time 
    "effort": "low",
    "summary": "auto"
  },
  tools: [
    {
      "type": "web_search",
      "user_location": {
        "type": "approximate"
      },
      // try to reduce to small
      "search_context_size": "low"
    }
  ],
  store: false,
  include: [
    "reasoning.encrypted_content",
    "web_search_call.action.sources"
  ]
});

  return {
    recipeResponse: response.output_parsed,
    requestUsage: response.usage,
  };

}

