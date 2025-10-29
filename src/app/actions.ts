'use server';

import * as admin from 'firebase-admin';
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { initializeFirebase as initializeClientFirebase } from '@/firebase/client-provider';

// Initialize Firebase Admin SDK
// This should only run once
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
    });
  } catch (e) {
    console.error('Firebase Admin Initialization Error', e);
  }
}

const authAdmin = admin.auth();
const firestoreAdmin = admin.firestore();

type CreateOperatorData = {
    email: string;
    password: string;
    UserName: string;
    SuperAdmin: 'Yes' | 'No';
    Attributes?: string;
    Remarks?: string;
};

export async function createOperator(data: CreateOperatorData) {
  try {
    // 1. Create user in Firebase Auth using Admin SDK
    const userRecord = await authAdmin.createUser({
      email: data.email,
      password: data.password,
      displayName: data.UserName,
    });

    const uid = userRecord.uid;

    // 2. Create operator document in Firestore
    const operatorDocRef = firestoreAdmin.collection('operators').doc(uid);
    const operatorData = {
      UID: uid,
      UserName: data.UserName,
      SuperAdmin: data.SuperAdmin,
      Attributes: data.Attributes || '',
      Remarks: data.Remarks || '',
    };

    await operatorDocRef.set(operatorData);
    
    // Set custom claim if SuperAdmin is 'Yes'
    if (data.SuperAdmin === 'Yes') {
        await authAdmin.setCustomUserClaims(uid, { superAdmin: true });
    }

    return { success: true, uid };
  } catch (error: any) {
    console.error('Error creating operator:', error);
    // Provide a more specific error message if available
    const message = error.code ? `Error (${error.code}): ${error.message}` : error.message;
    return { success: false, error: message };
  }
}

export async function sendContactMessage(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Basic validation
  if (!name || !email || !message) {
    return { success: false, message: 'Missing required fields.' };
  }

  // In a real application, you would send this data to an email service,
  // a database, or a CRM.
  // For this example, we'll just log it to the console.
  console.log('New Contact Message Received:');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);

  // Simulate a successful submission
  return { success: true, message: "Thanks for reaching out! We'll get back to you soon." };
}
