import { User, UserRole, DemoAccount } from '../types/user';
import { storageService, DEMO_ACCOUNTS, GUEST_USER } from './storageService';

// Detect whether optional Firebase config is present safely
const hasFirebaseConfig = Boolean(
  (import.meta as any).env?.VITE_FIREBASE_API_KEY &&
  (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID
);

export const authService = {
  isFirebaseActive(): boolean {
    return hasFirebaseConfig;
  },

  getCurrentUser(): User {
    return storageService.getCurrentUser();
  },

  getDemoAccounts(): DemoAccount[] {
    return DEMO_ACCOUNTS;
  },

  loginAsDemoAccount(account: DemoAccount): User {
    const user: User = {
      userId: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      reportsCount: account.role === 'Citizen' ? 3 : 0,
      createdAt: new Date().toISOString(),
      avatarUrl: account.avatar
    };
    storageService.saveCurrentUser(user);
    return user;
  },

  loginAsGuest(): User {
    storageService.saveCurrentUser(GUEST_USER);
    return GUEST_USER;
  },

  loginWithCredentials(email: string, _password: string, role: UserRole = 'Citizen'): User {
    // Check if matches a demo account
    const foundDemo = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (foundDemo) {
      return this.loginAsDemoAccount(foundDemo);
    }

    // Dynamic login for demo purposes
    const user: User = {
      userId: `user_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role,
      reportsCount: 0,
      createdAt: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };
    storageService.saveCurrentUser(user);
    return user;
  },

  register(name: string, email: string, _password: string): User {
    const user: User = {
      userId: `user_${Date.now()}`,
      name,
      email,
      role: 'Citizen',
      reportsCount: 0,
      createdAt: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };
    storageService.saveCurrentUser(user);
    return user;
  },

  logout(): User {
    return this.loginAsGuest();
  }
};
