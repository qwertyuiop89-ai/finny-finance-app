import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously
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
      isGuest: false,
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
 * Login como visitante (anônimo)
 */
export const signInAsGuest = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    
    // Criar documento temporário para visitante
    await setDoc(doc(db, 'users', user.uid), {
      name: 'Visitante',
      email: null,
      monthlyGoal: 2000,
      finnyOutfits: ['default'],
      achievements: [],
      isGuest: true,
      createdAt: new Date().toISOString(),
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Login com Google
 * Nota: Para funcionar completamente, precisa configurar Google Sign-In no Firebase Console
 */
export const signInWithGoogle = async () => {
  try {
    // Para implementação completa, seria necessário:
    // 1. Configurar Google Sign-In no Firebase Console
    // 2. Adicionar configurações específicas para iOS/Android
    // 3. Implementar o fluxo completo do Google Sign-In
    
    // Por enquanto, retornamos um erro informativo
    return { 
      success: false, 
      error: 'Login com Google precisa ser configurado no Firebase Console. Use email/senha ou modo visitante.' 
    };
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
 * Converter conta de visitante em conta permanente
 */
export const convertGuestAccount = async (email, password, name) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.isAnonymous) {
      return { success: false, error: 'Usuário não é visitante' };
    }

    // Para implementação completa, seria necessário usar linkWithCredential
    // Por enquanto, orientamos o usuário a criar uma nova conta
    return { 
      success: false, 
      error: 'Para salvar seus dados, faça logout e crie uma conta nova.' 
    };
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