export type UserRole = 'ADMIN' | 'VISITOR';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  classification: 'Student' | 'Faculty' | 'Guest' | 'Staff';
  isBlocked: boolean;
};

export type Visit = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  department: string;
  reasonForVisit: string;
  timestamp: string;
  classification: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};