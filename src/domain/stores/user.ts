import { writable, derived } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

import type { AuthService } from '../../services/authService/interface';
import { firebaseAuthService } from '../../services/authService/firebaseAuthService';


import type { User } from '../models/user';

const createStore = (authService: AuthService) => {
  const currentUser = writable<User | null>(null);
  const authIsRestoring = writable(true);

  authService.checkAuth().then((user) => {
    if (user) {
      currentUser.set(user);
    }

		if (browser && !user && window.location.pathname !== '/') {
			goto('/');
		}

    authIsRestoring.set(false);
  });

  
  return {
    currentUser,
    userIsLoggedIn: derived(currentUser, $currentUser => !!$currentUser),
    authIsRestoring,
    signInWithGoogle: async () => {
      const user = await authService.signInWithGoogle();
      currentUser.set(user);
    },
  }
}
const userStore = createStore(firebaseAuthService);

export { userStore };