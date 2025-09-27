import OpenAI from "openai";
import 'dotenv/config';
import { zodTextFormat } from "openai/helpers/zod";
import { RecipesResponseSchema } from "./requestSchema.js";


const openai = new OpenAI({
  apiKey: process.env.SECRET_OPENAI,
});


export async function fetchRecipes(link) {

  const response = await openai.responses.parse({
  model: "gpt-5-nano",
  input: `From the following link: ${link}, extract the recipe and return the information in structured format with the following fields:

      - Title of the recipe
      - Short description (2–3 sentences)
      - Country or region of origin
      - Category (choose one: Appetizer, Main Dish, Side Dish, Dessert, Snack)
      - Ingredients (scaled for 1 portion)
      - Step-by-step cooking instructions (detailed)
      - Preparation time 
      - Cooking time

    Make sure the output is well-structured and easy to parse.`,

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
      "search_context_size": "medium"
    }
  ],
  store: false,
  include: [
    "reasoning.encrypted_content",
    "web_search_call.action.sources"
  ]
});

// const recipes = 
// console.log(recipes);

//console.log(response); 

return response.output_parsed;


}

