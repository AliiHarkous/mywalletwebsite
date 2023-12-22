import { auth } from "@/firebase/firebase";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ReactNode, createContext, useContext, useState } from "react";

type IType = {
  user: User | null;
  login?: (email: string, password: string) => void;
  logout?: () => void;
};

const AuthInitial: IType = {
  user: null,
};

const AuthContext = createContext(AuthInitial);

export const useAuth = () => {
  return useContext<IType>(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
  });
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };
  const logout = async () => {
    await auth.signOut();
  };

  const value = {
    user: currentUser,
    login: login,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
