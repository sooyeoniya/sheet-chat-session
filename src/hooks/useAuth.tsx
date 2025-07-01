
import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (phone: string, name: string, role: 'instructor' | 'student') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = (phone: string, name: string, role: 'instructor' | 'student') => {
    const user: User = {
      id: `user_${Date.now()}`,
      phone,
      name,
      role,
    };
    
    setAuthState({
      user,
      isAuthenticated: true,
    });
    
    localStorage.setItem('auth', JSON.stringify(user));
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('auth');
  };

  // 페이지 로드 시 인증 상태 복원
  useState(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const user = JSON.parse(stored);
      setAuthState({
        user,
        isAuthenticated: true,
      });
    }
  });

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
