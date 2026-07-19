'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

type User = { _id: string; name: string; email: string; role: string; agencyName?: string } | null;
type AuthCtx = { 
  user: User; 
  loading: boolean; 
  login: (e: string, p: string) => Promise<void>; 
  register: (d: any) => Promise<void>; 
  logout: () => void; 
};
const Ctx = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('accessToken');
    if (token) api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => {}).finally(() => setLoading(false));
    else setLoading(false);
  }, []);

  const persist = (data: any) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
  };
  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password }); persist(data);
  };
  const register = async (payload: any) => {
    const { data } = await api.post('/auth/register', payload); persist(data);
  };
  const logout = () => { localStorage.clear(); setUser(null); };

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
