import { 
  auth, 
  googleProvider,
  db
} from './firebase.config';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  // @ts-ignore
  type User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';


// Helper function to check if user document exists
const checkUserExists = async (uid: string): Promise<boolean> => {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists();
};

// All your authentication functions
export const loginWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  
  await setDoc(doc(db, "users", userCredential.user.uid), {
    name,
    email,
    emailVerified: false,
    createdAt: new Date()
  });
  
  return userCredential;
};

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  
  // Check if user exists in Firestore to determine if they're new
  const userExists = await checkUserExists(result.user.uid);
  
  if (!userExists) {
    await setDoc(doc(db, "users", result.user.uid), {
      name: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      createdAt: new Date()
    });
  }
  
  return result;
};

export const logout = async () => {
  await signOut(auth);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user");
  
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};