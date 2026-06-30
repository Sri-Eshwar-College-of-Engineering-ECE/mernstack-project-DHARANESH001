import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("sf_token"));
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const data = await authService.getMe();
        setUser(data.user);
      } catch {
        localStorage.removeItem("sf_token");
        localStorage.removeItem("sf_user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, [token]);

  const login = useCallback(async (credentials, rememberMe = false) => {
    const data = await authService.login(credentials);
    const { token: newToken, user: newUser } = data;

    setToken(newToken);
    setUser(newUser);

    if (rememberMe) {
      localStorage.setItem("sf_token", newToken);
    } else {
      localStorage.setItem("sf_token", newToken); // session-based in real app
    }
    localStorage.setItem("sf_user", JSON.stringify(newUser));

    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    const { token: newToken, user: newUser } = data;

    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("sf_token", newToken);
    localStorage.setItem("sf_user", JSON.stringify(newUser));

    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch {}
    setToken(null);
    setUser(null);
    localStorage.removeItem("sf_token");
    localStorage.removeItem("sf_user");
    toast.success("Logged out successfully");
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("sf_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
