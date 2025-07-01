import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthState } from "@/types";
import { mockUsers } from "@/data/mockData";

interface AuthContextType extends AuthState {
  login: (phone: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = (phone: string, name: string) => {
    // 목데이터에서 전화번호로 사용자 찾기
    const existingUser = mockUsers.find((user) => user.phone === phone);

    if (!existingUser) {
      // 목데이터에 없는 사용자면 에러 처리 또는 새 사용자 생성
      throw new Error("등록되지 않은 사용자입니다.");
    }

    // 이름이 일치하는지 확인 (선택적)
    if (existingUser.name !== name) {
      throw new Error("이름이 일치하지 않습니다.");
    }

    setAuthState({
      user: existingUser,
      isAuthenticated: true,
    });

    localStorage.setItem("auth", JSON.stringify(existingUser));
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem("auth");
  };

  // 페이지 로드 시 인증 상태 복원
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const user = JSON.parse(stored);
      setAuthState({
        user,
        isAuthenticated: true,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
