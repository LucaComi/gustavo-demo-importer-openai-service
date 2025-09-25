import { z } from "zod";

const TimeSchema = z.object({
  hours: z.number().int().min(0),
  minutes: z.number().int().min(0).max(59),
});


const IngredientSchema = z.object({
  name: z.string(),
  quantity: z.number().nullable().optional(),
  unit: z
    .enum([
      "g",
      "kg",
      "mg",
      "ml",
      "l",
      "tsp",
      "tbsp",
      "cup",
      "piece",
      "slice",
      "pinch",
      "dash",
      "can",
      "packet",
      "stick",
      "bunch",
    ])
    .nullable()
    .optional(),
  notes: z.string().nullable().optional(),
});

export const RecipeSearchSchema = z.object({
  title: z.string(), // maps recipe_title
  link: z.string(), // maps recipe_link
  description: z.string().nullable().optional(),
  country: z.string().nullable().optional(),

  preparation_time: TimeSchema,
  cooking_time: TimeSchema,

  ingredients: z.array(IngredientSchema).default([]),
  steps: z.array(z.string()).default([]),

  categorisation: z.enum([
    "Appetizer",
    "Main Dishes",
    "Side Dishes",
    "Dessert",
    "Snack",
  ]),

});


export const RecipesResponseSchema = z.object({
  result: z.array(RecipeSearchSchema).min(1).max(1),
});