'use server';

// IMPORTANT: Do not import firebase-admin at the top level.
// Instead, dynamically import it inside the function where it's used.

/**
 * Checks if a player document exists in the 'players' collection.
 * This function is a server action and uses the Firebase Admin SDK.
 * @param uid The user's UID to check.
 * @returns A boolean indicating if the player exists.
 */
export async function checkPlayerExists(uid: string): Promise<boolean> {
  // Dynamically import admin SDKs within the function
  const { initializeApp, getApps, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');

  // Initialize the app if it's not already initialized
  if (getApps().length === 0) {
    // In a real production environment, you would use service account credentials
    // from environment variables, not hardcoded. For this context, initializeApp()
    // will likely work with application default credentials.
    initializeApp();
  }
  
  try {
    const db = getFirestore();
    const playerDocRef = db.collection('players').doc(uid);
    const playerDoc = await playerDocRef.get();
    
    return playerDoc.exists;
  } catch (error) {
    console.error("Error checking player existence:", error);
    // In case of an error, we conservatively return false.
    // This prevents locking out a user if the check fails.
    return false;
  }
}
