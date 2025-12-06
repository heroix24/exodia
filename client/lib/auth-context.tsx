"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Constants
const TOKEN_KEY = "exodia_token";
const USER_KEY = "exodia_user";
const TOKEN_EXPIRY_KEY = "exodia_token_expiry";
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const CHECK_INTERVAL = 30 * 1000; // Check every 30 seconds

export interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isSessionExpired: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  acknowledgeSessionExpiry: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Clear auth data from localStorage and state
  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Login function - stores token, user, and expiry time
  const login = useCallback((newToken: string, newUser: User) => {
    const expiryTime = Date.now() + SESSION_DURATION;
    
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    
    setToken(newToken);
    setUser(newUser);
    setIsSessionExpired(false);
  }, []);

  // Logout function
  const logout = useCallback(() => {
    clearAuth();
    setIsSessionExpired(false);
    router.push("/login-page");
  }, [clearAuth, router]);

  // Handle session expiry acknowledgment
  const acknowledgeSessionExpiry = useCallback(() => {
    clearAuth();
    setIsSessionExpired(false);
    router.push("/login-page");
  }, [clearAuth, router]);

  // Check if session is expired
  const checkSessionExpiry = useCallback(() => {
    const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    
    if (!storedToken || !storedExpiry) {
      return false;
    }
    
    const expiryTime = parseInt(storedExpiry, 10);
    const now = Date.now();
    
    if (now >= expiryTime) {
      setIsSessionExpired(true);
      return true;
    }
    
    return false;
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (storedToken && storedUser && storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const now = Date.now();
      
      if (now < expiryTime) {
        // Session is still valid
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          clearAuth();
        }
      } else {
        // Session has expired
        setIsSessionExpired(true);
      }
    }
    
    setIsInitialized(true);
  }, [clearAuth]);

  // Set up interval to check session expiry
  useEffect(() => {
    if (!isInitialized || !token) return;

    const intervalId = setInterval(() => {
      checkSessionExpiry();
    }, CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isInitialized, token, checkSessionExpiry]);

  // Also check on visibility change (when user returns to tab)
  useEffect(() => {
    if (!isInitialized || !token) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSessionExpiry();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isInitialized, token, checkSessionExpiry]);

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated: !!token && !isSessionExpired,
    isSessionExpired,
    login,
    logout,
    acknowledgeSessionExpiry,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

