/**
 * Customer Authentication Types & Provider Abstraction
 *
 * Structured so `MockAuthProvider` can be swapped for a future
 * `CognitoAuthProvider` (Amazon Cognito) without rewriting UI components.
 */

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  contactNumber?: string;
  createdAt: string;
}

/**
 * Server-only stored customer record (never sent to browser clients).
 */
export interface CustomerRecord extends Customer {
  passwordHash: string;
  passwordSalt: string;
  updatedAt: string;
}

/**
 * Server-only session record (token stored in HttpOnly cookie).
 */
export interface CustomerSession {
  token: string;
  customerId: string;
  createdAt: string;
  expiresAt: string;
}

export interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegisterCustomerInput {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginCustomerInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UpdateCustomerProfileInput {
  fullName: string;
  contactNumber?: string;
}

export interface CustomerAuthProvider {
  readonly providerName: "mock" | "cognito";
  registerCustomer(input: RegisterCustomerInput): Promise<{ customer: Customer }>;
  loginCustomer(input: LoginCustomerInput): Promise<{ customer: Customer }>;
  logoutCustomer(): Promise<void>;
  getCurrentCustomer(): Promise<Customer | null>;
  isAuthenticated(): Promise<boolean>;
  updateCustomerProfile(
    input: UpdateCustomerProfileInput
  ): Promise<{ customer: Customer }>;
}
