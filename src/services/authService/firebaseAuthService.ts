
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';

import type { AuthService } from './interface';
import { app } from '../firebase';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);


class FirebaseAuthService implements AuthService {
  private _restoringPromise: null | Promise<void> = null;

  constructor() {
    this._restoringPromise = new Promise(resolve => {
      onAuthStateChanged(auth, () => resolve());
    });
  }

  signInWithGoogle = async () => {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    return {
      id: user.uid,
      email: user.email as string,
      name: user.displayName || 'unknown',
    }
  }

  logout = async () => {
    throw new Error('implement this!');
  }

  checkAuth = async () => {
    if (this._restoringPromise) {
      await this._restoringPromise;
    }

    const user = auth.currentUser;
    
    return user ? {
      id: user.uid,
      email: user.email as string,
      name: user.displayName || 'unknown',
    } : null;
  };
}

const firebaseAuthService = new FirebaseAuthService();

export { firebaseAuthService };