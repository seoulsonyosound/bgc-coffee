"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthState,
  Customer,
  LoginCustomerInput,
  RegisterCustomerInput,
  UpdateCustomerProfileInput,
} from "@/types/auth";
import {
  getCurrentCustomer,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  updateCustomerProfile,
} from "./auth-service";

interface AuthContextValue extends AuthState {
  login: (input: LoginCustomerInput) => Promise<Customer>;
  register: (input: RegisterCustomerInput) => Promise<Customer>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateProfile: (input: UpdateCustomerProfileInput) => Promise<Customer>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const current = await getCurrentCustomer();
      setCustomer(current);
    } catch {
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getCurrentCustomer()
      .then((current) => {
        if (active) setCustomer(current);
      })
      .catch(() => {
        if (active) setCustomer(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (input: LoginCustomerInput) => {
    const { customer: authed } = await loginCustomer(input);
    setCustomer(authed);
    return authed;
  }, []);

  const register = useCallback(async (input: RegisterCustomerInput) => {
    const { customer: created } = await registerCustomer(input);
    return created;
  }, []);

  const logout = useCallback(async () => {
    await logoutCustomer();
    setCustomer(null);
  }, []);

  const updateProfile = useCallback(
    async (input: UpdateCustomerProfileInput) => {
      const { customer: updated } = await updateCustomerProfile(input);
      setCustomer(updated);
      return updated;
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      customer,
      isAuthenticated: Boolean(customer),
      isLoading,
      login,
      register,
      logout,
      refreshSession,
      updateProfile,
    }),
    [
      customer,
      isLoading,
      login,
      register,
      logout,
      refreshSession,
      updateProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return ctx;
}
