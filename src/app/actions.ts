
'use server';

import * as admin from 'firebase-admin';

// --- Singleton pattern for Firebase Admin Initialization ---
// This ensures that the SDK is initialized only once per server instance.
// CRITICAL: This function is NOT exported. It's a private helper.
const getAdmin = () => {
  if (admin.apps.length === 0) {
    try {
      admin.initializeApp({
        // Using applicationDefault() automatically finds the credentials
        // in a Google Cloud environment (like Firebase App Hosting).
        credential: admin.credential.applicationDefault(),
        // The databaseURL is not strictly necessary for Auth and Firestore but is good practice.
        // It's constructed from the GCLOUD_PROJECT env variable, standard in Google Cloud.
        databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
      });
    } catch (e) {
      console.error('Firebase Admin Initialization Error', e);
    }
  }
  return admin;
};

// --- Operator Data Types ---
type CreateOperatorData = {
    email: string;
    password: string;
    UserName: string;
    SuperAdmin: 'Yes' | 'No';
    Attributes?: string;
    Remarks?: string;
};

export type UpdateOperatorData = {
  UID: string;
  UserName: string;
  SuperAdmin: 'Yes' | 'No';
  Attributes?: string;
  Remarks?: string;
};

// --- Server Actions ---

/**
 * Creates a new operator in Firebase Auth and Firestore.
 * Does not sign in the new user, keeping the admin's session active.
 */
export async function createOperator(data: CreateOperatorData) {
  const adminInstance = getAdmin();
  const authAdmin = adminInstance.auth();
  const firestoreAdmin = adminInstance.firestore();

  try {
    const userRecord = await authAdmin.createUser({
      email: data.email,
      password: data.password,
      displayName: data.UserName,
    });
    const { uid } = userRecord;
    
    const operatorsCollection = firestoreAdmin.collection('operators');
    const snapshot = await operatorsCollection.limit(1).get();

    // The first user created in the 'operators' collection is automatically a Super Admin.
    const isFirstOperator = snapshot.empty;
    const isSuperAdmin = isFirstOperator ? 'Yes' : data.SuperAdmin;
    
    if (isSuperAdmin === 'Yes') {
        await authAdmin.setCustomUserClaims(uid, { superAdmin: true });
    }

    const operatorDocRef = operatorsCollection.doc(uid);
    await operatorDocRef.set({
      UID: uid,
      UserName: data.UserName,
      SuperAdmin: isSuperAdmin,
      Attributes: data.Attributes || '',
      Remarks: data.Remarks || '',
    });
    
    return { success: true, uid };
  } catch (error: any) {
    console.error('Error creating operator:', error);
    const message = error.code ? `Error (${error.code}): ${error.message}` : error.message;
    return { success: false, error: message };
  }
}


/**
 * Updates an existing operator's data in Firestore and their custom claims.
 */
export async function updateOperator(data: UpdateOperatorData) {
    const adminInstance = getAdmin();
    const authAdmin = adminInstance.auth();
    const firestoreAdmin = adminInstance.firestore();

    try {
        const { UID, ...operatorData } = data;
        const operatorDocRef = firestoreAdmin.collection('operators').doc(UID);

        await operatorDocRef.update({
            UserName: operatorData.UserName,
            SuperAdmin: operatorData.SuperAdmin,
            Attributes: operatorData.Attributes || '',
            Remarks: operatorData.Remarks || '',
        });

        if (operatorData.SuperAdmin === 'Yes') {
            await authAdmin.setCustomUserClaims(UID, { superAdmin: true });
        } else {
            // Remove the claim if they are no longer a super admin
            await authAdmin.setCustomUserClaims(UID, { superAdmin: false });
        }

        return { success: true };
    } catch (error: any) {
        console.error('Error updating operator:', error);
        const message = error.code ? `Error (${error.code}): ${error.message}` : error.message;
        return { success: false, error: message };
    }
}


/**
 * Deletes an operator from Firestore and Firebase Authentication.
 */
export async function deleteOperator(uid: string) {
    const adminInstance = getAdmin();
    const authAdmin = adminInstance.auth();
    const firestoreAdmin = adminInstance.firestore();

    try {
        // Delete from Firestore first
        const operatorDocRef = firestoreAdmin.collection('operators').doc(uid);
        await operatorDocRef.delete();

        // Then delete from Firebase Authentication
        await authAdmin.deleteUser(uid);

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting operator:', error);
        const message = error.code ? `Error (${error.code}): ${error.message}` : error.message;
        return { success: false, error: message };
    }
}
