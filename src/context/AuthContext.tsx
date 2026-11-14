import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DemoAccount, UserRole } from '../types/user';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User;
  isFirebaseActive: boolean;
  demoAccounts: DemoAccount[];
  loginAsDemo: (account: DemoAccount) => void;
  loginAsGuest: () => void;
  loginWithCredentials: (email: string, password: string, role?: UserRole) => User;
  register: (name: string, email: string, password: string) => User;
  logout: () => void;
  setCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => authService.getCurrentUser());

  useEffect(() => {
    // Sync to storage
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const loginAsDemo = (account: DemoAccount) => {
    const user = authService.loginAsDemoAccount(account);
    setCurrentUser(user);
  };

  const loginAsGuest = () => {
    const user = authService.loginAsGuest();
    setCurrentUser(user);
  };

  const loginWithCredentials = (email: string, password: string, role?: UserRole) => {
    const user = authService.loginWithCredentials(email, password, role);
    setCurrentUser(user);
    return user;
  };

  const register = (name: string, email: string, password: string) => {
    const user = authService.register(name, email, password);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    const user = authService.logout();
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isFirebaseActive: authService.isFirebaseActive(),
        demoAccounts: authService.getDemoAccounts(),
        loginAsDemo,
        loginAsGuest,
        loginWithCredentials,
        register,
        logout,
        setCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
