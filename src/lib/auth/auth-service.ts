import {
  Customer,
  CustomerAuthProvider,
  LoginCustomerInput,
  RegisterCustomerInput,
  UpdateCustomerProfileInput,
} from "@/types/auth";

/**
 * Client-Side Customer Authentication Service (MockAuthProvider)
 *
 * All credential checks, password hashing, and session cookies happen on the
 * server via Next.js Route Handlers (`/api/auth/*`). No passwords or secrets
 * are ever stored in browser localStorage or sessionStorage.
 *
 * Future AWS Integration:
 * Implement a `CognitoAuthProvider` conforming to `CustomerAuthProvider`
 * (using Amazon Cognito / AWS Amplify Auth) and swap `activeAuthProvider`
 * without rewriting React UI components.
 */

class MockAuthProvider implements CustomerAuthProvider {
  readonly providerName = "mock" as const;

  async registerCustomer(
    input: RegisterCustomerInput
  ): Promise<{ customer: Customer }> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Unable to create account.");
    }
    return { customer: data.customer };
  }

  async loginCustomer(
    input: LoginCustomerInput
  ): Promise<{ customer: Customer }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Invalid email address or password.");
    }
    return { customer: data.customer };
  }

  async logoutCustomer(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
  }

  async getCurrentCustomer(): Promise<Customer | null> {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.authenticated ? (data.customer as Customer) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    const customer = await this.getCurrentCustomer();
    return Boolean(customer);
  }

  async updateCustomerProfile(
    input: UpdateCustomerProfileInput
  ): Promise<{ customer: Customer }> {
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Unable to update profile.");
    }
    return { customer: data.customer };
  }
}

export const activeAuthProvider: CustomerAuthProvider = new MockAuthProvider();

// Reusable standalone helper exports
export const registerCustomer = (input: RegisterCustomerInput) =>
  activeAuthProvider.registerCustomer(input);

export const loginCustomer = (input: LoginCustomerInput) =>
  activeAuthProvider.loginCustomer(input);

export const logoutCustomer = () => activeAuthProvider.logoutCustomer();

export const getCurrentCustomer = () => activeAuthProvider.getCurrentCustomer();

export const isAuthenticated = () => activeAuthProvider.isAuthenticated();

export const updateCustomerProfile = (input: UpdateCustomerProfileInput) =>
  activeAuthProvider.updateCustomerProfile(input);
