export type UserRole = 'Citizen' | 'Admin' | 'Guest';

export interface User {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  reportsCount: number;
  createdAt: string;
  avatarUrl?: string;
}

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  description: string;
  avatar: string;
}
