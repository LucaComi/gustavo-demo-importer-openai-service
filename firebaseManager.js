import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp();


export async function parseResultOnFirebase(recipeData) {

    const db = getFirestore(app);

    // set a random document in a test collection
    const docRef = await db.collection("recipes").doc();

    // Extract the recipe from nested structure
    const recipe = recipeData.result[0]

    // Save all data to Firestore
    await docRef.set({
        title: recipe.title,
        link: recipe.link,
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
        linkRequest: link,
        createdAt: new Date(),
        importCompleted: true
    });
    
    // Return the document ID
    return docRef.id;

}


