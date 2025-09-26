import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp();

export async function setInitRequest(link) {

    const db = getFirestore(app);

    // set a random document in a test collection
    const docRef = await db.collection("recipes").doc();

    // Save data to it
    await docRef.set({
        linkRequest: link,
        createdAt: new Date(),
    });

    // return the docID
    return docRef.id;

}


