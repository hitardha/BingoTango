
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, IdTokenResult } from 'firebase/auth';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

type OperatorData = {
  UserName: string;
  SuperAdmin: 'Yes' | 'No';
  Attributes: string;
};

interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  operatorData: OperatorData | null;
  isOperatorLoading: boolean;
  isSuperAdmin: boolean;
}

export interface FirebaseContextState extends UserAuthState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

export interface FirebaseServicesAndUser extends UserAuthState {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export interface UserHookResult extends UserAuthState {}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true,
    userError: null,
    operatorData: null,
    isOperatorLoading: true,
    isSuperAdmin: false,
  });

  useEffect(() => {
    if (!auth || !firestore) {
      setUserAuthState({
        user: null,
        isUserLoading: false,
        userError: new Error("Auth or Firestore service not provided."),
        operatorData: null,
        isOperatorLoading: false,
        isSuperAdmin: false,
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          // User is signed out or no user is found on initial load
          setUserAuthState({ user: null, isUserLoading: false, userError: null, operatorData: null, isOperatorLoading: false, isSuperAdmin: false });
          return;
        }

        // A user is detected. Start the loading sequence.
        // We keep previous operator data to avoid UI flickering until new data is loaded.
        setUserAuthState(prevState => ({ ...prevState, user: firebaseUser, isUserLoading: true, isOperatorLoading: true }));

        try {
          // CRITICAL: Force a refresh of the ID token to get the latest custom claims.
          // This is essential to solve race conditions after login or claim changes.
          const idTokenResult: IdTokenResult = await firebaseUser.getIdTokenResult(true);
          const isSuperAdmin = idTokenResult.claims.superAdmin === true;

          let operatorData: OperatorData | null = null;
          
          // Only attempt to fetch operator data if the user is a super admin.
          if (isSuperAdmin) {
            const operatorRef = doc(firestore, 'operators', firebaseUser.uid);
            const operatorSnap = await getDoc(operatorRef);
            if (operatorSnap.exists()) {
              operatorData = operatorSnap.data() as OperatorData;
            } else {
               // This case handles a Super Admin claim without a corresponding Firestore document.
               // It's a potential state to be aware of.
               console.warn(`User ${firebaseUser.uid} has superAdmin claim but no operator document.`);
            }
          }
          
          // Set the final, complete state once all data is fetched.
          setUserAuthState({
            user: firebaseUser,
            isUserLoading: false,
            userError: null,
            operatorData: operatorData,
            isOperatorLoading: false,
            isSuperAdmin: isSuperAdmin,
          });

        } catch (error) {
          console.error("FirebaseProvider: Error fetching user data or claims:", error);
          // Set an error state but keep the user object if it exists.
          setUserAuthState({ 
            user: firebaseUser, 
            isUserLoading: false, 
            userError: error as Error, 
            operatorData: null, 
            isOperatorLoading: false, 
            isSuperAdmin: false 
          });
        }
      },
      (error) => {
        // This callback handles errors during the listener setup itself.
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error, operatorData: null, isOperatorLoading: false, isSuperAdmin: false });
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, firestore]);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      ...userAuthState,
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
    operatorData: context.operatorData,
    isOperatorLoading: context.isOperatorLoading,
    isSuperAdmin: context.isSuperAdmin,
  };
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

export const useUser = (): UserHookResult => { 
  const { user, isUserLoading, userError, operatorData, isOperatorLoading, isSuperAdmin } = useFirebase();
  return { user, isUserLoading, userError, operatorData, isOperatorLoading, isSuperAdmin };
};
