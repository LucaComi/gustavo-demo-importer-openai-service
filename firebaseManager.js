import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp();

export const updateAIusage = async () => {
  // every request needs to be tracked 
}


export async function parseResultOnFirebase(recipeData, requestUsage, url) {

    const db = getFirestore(app);

    // set a random document in a test collection
    const docRef = await db.collection("recipes").doc();

    // Extract the recipe from nested structure
    const recipe = recipeData.result[0]


    // Save all data to Firestore
    await docRef.set({
        title: recipe.title,
        description: recipe.description,
        country: recipe.country,
        categorisation: recipe.categorisation,
        preparationTime: {
            hours: recipe.preparation_time.hours,
            minutes: recipe.preparation_time.minutes
        },
        cookingTime: {
            hours: recipe.cooking_time.hours,
            minutes: recipe.cooking_time.minutes
        },
        ingredients: recipe.ingredients.map(ing => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes
        })),
        steps: recipe.steps,
        urlRequest: url,
        createdAt: new Date(),
        importCompleted: true,
        reqeuestUsage: requestUsage,
        nutrition: {
            "calories": recipe.nutrition.calories,
            "protein":  recipe.nutrition.protein,
            "fat": recipe.nutrition.fat,
            "carbs": recipe.nutrition.carbs
        }
    });
    
    // Return the document ID
    return docRef.id;

}


