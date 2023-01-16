import type { User } from '../../domain/models/user';

export interface AuthService {
  signInWithGoogle: () => Promise<User>;
  checkAuth: () => Promise<User | null>,
  logout: () => Promise<void>;
}