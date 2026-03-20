"use client"

import { useState, useEffect } from 'react';
import { User, Visit, AuthState } from './types';

// Initial Mock Data
const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Juan Esperanza',
    email: 'jcesperanza@neu.edu.ph',
    role: 'ADMIN',
    classification: 'Faculty',
    isBlocked: false,
  },
  {
    id: '2',
    name: 'Alice Smith',
    email: 'alice.smith@neu.edu.ph',
    role: 'VISITOR',
    classification: 'Student',
    isBlocked: false,
  }
];

const INITIAL_VISITS: Visit[] = [
  {
    id: 'v1',
    userId: '2',
    userName: 'Alice Smith',
    userEmail: 'alice.smith@neu.edu.ph',
    department: 'Computer Science',
    reasonForVisit: 'Academic Advising',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    classification: 'Student',
  },
  {
    id: 'v2',
    userId: '3',
    userName: 'Bob Jones',
    userEmail: 'bob.jones@neu.edu.ph',
    department: 'Library',
    reasonForVisit: 'Research',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    classification: 'Guest',
  }
];

export function useUniStore() {
  const [users, setUsers] = useState<User[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem('uni_users');
    const storedVisits = localStorage.getItem('uni_visits');
    const storedAuth = localStorage.getItem('uni_auth');

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    else {
      setUsers(INITIAL_USERS);
      localStorage.setItem('uni_users', JSON.stringify(INITIAL_USERS));
    }

    if (storedVisits) setVisits(JSON.parse(storedVisits));
    else {
      setVisits(INITIAL_VISITS);
      localStorage.setItem('uni_visits', JSON.stringify(INITIAL_VISITS));
    }

    if (storedAuth) setAuth(JSON.parse(storedAuth));
    
    setIsLoaded(true);
  }, []);

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('uni_users', JSON.stringify(newUsers));
  };

  const saveVisits = (newVisits: Visit[]) => {
    setVisits(newVisits);
    localStorage.setItem('uni_visits', JSON.stringify(newVisits));
  };

  const login = (user: User) => {
    const newState = { user, isAuthenticated: true };
    setAuth(newState);
    localStorage.setItem('uni_auth', JSON.stringify(newState));
  };

  const logout = () => {
    const newState = { user: null, isAuthenticated: false };
    setAuth(newState);
    localStorage.removeItem('uni_auth');
  };

  const addVisit = (visit: Omit<Visit, 'id' | 'timestamp'>) => {
    const newVisit: Visit = {
      ...visit,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    const updated = [newVisit, ...visits];
    saveVisits(updated);
  };

  const blockUser = (userId: string) => {
    const updated = users.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u);
    saveUsers(updated);
  };

  return {
    users,
    visits,
    auth,
    isLoaded,
    login,
    logout,
    addVisit,
    blockUser,
    setUsers: saveUsers,
  };
}
