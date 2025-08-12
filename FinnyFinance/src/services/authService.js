import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Criar nova conta de usuário
 */
export const createAccount = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Criar documento do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      monthlyGoal: 2000, // Meta padrão de R$ 2000
      finnyOutfits: ['default'], // Roupas desbloqueadas do Finny
      achievements: [],
      createdAt: new Date().toISOString(),
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Fazer login
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Fazer logout
 */
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Obter dados do usuário
 */
export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'Usuário não encontrado' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Observar mudanças no estado de autenticação
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};