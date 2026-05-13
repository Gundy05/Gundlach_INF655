import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, observeAuth, registerUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = observeAuth((nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  async function login(credentials) {
    const nextUser = await loginUser(credentials);
    setUser(nextUser);
    return nextUser;
  }

  async function register(credentials) {
    const nextUser = await registerUser(credentials);
    setUser(nextUser);
    return nextUser;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
