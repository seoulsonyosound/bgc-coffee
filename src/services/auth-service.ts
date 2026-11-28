import crypto from "crypto";
import {
  AdminConfirmSignUpCommand,
  AdminUpdateUserAttributesCommand,
  GetUserCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { isDynamoDbMode } from "@/lib/aws-config";
import {
  getCognitoClient,
  getCognitoConfig,
  isCognitoConfigured,
} from "@/lib/cognito";
import { getDynamoDbDocClient, getTableNames } from "@/lib/dynamodb";
import { readMockDb, writeMockDb } from "@/lib/mock-db";
import { isValidEmail } from "@/lib/utils";
import { Customer, CustomerRecord } from "@/types/auth";

/**
 * Server-Side Customer Authentication Service
 *
 * - In local mode (BGC_DATA_SOURCE=mock): uses local file-backed mock-db.ts
 *   with scrypt password hashes and HttpOnly session cookies.
 * - In AWS mode (BGC_DATA_SOURCE=dynamodb + COGNITO_* env vars): uses
 *   Amazon Cognito (Lite tier) for authentication + Amazon DynamoDB
 *   (`bgc-coffee-customers`) for customer profile metadata.
 */

export const CUSTOMER_SESSION_COOKIE = "bgc_customer_session";
export const ADMIN_SESSION_COOKIE = "bgc_admin_demo_session";

const SESSION_DURATION_DEFAULT_MS = 1000 * 60 * 60 * 12; // 12 hours
const SESSION_DURATION_REMEMBER_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function isCognitoAuthEnabled(): boolean {
  return isDynamoDbMode() && isCognitoConfigured();
}

function toPublicCustomer(record: CustomerRecord): Customer {
  return {
    id: record.id,
    fullName: record.fullName,
    email: record.email,
    contactNumber: record.contactNumber,
    createdAt: record.createdAt,
  };
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string
): boolean {
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, "hex");
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

async function getDynamoCustomerProfile(id: string): Promise<Customer | null> {
  const doc = getDynamoDbDocClient();
  const { customers: tableName } = getTableNames();
  const res = await doc.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    })
  );
  if (!res.Item) return null;
  const item = res.Item as Customer;
  return {
    id: item.id,
    fullName: item.fullName,
    email: item.email,
    contactNumber: item.contactNumber,
    createdAt: item.createdAt,
  };
}

async function putDynamoCustomerProfile(customer: Customer): Promise<void> {
  const doc = getDynamoDbDocClient();
  const { customers: tableName } = getTableNames();
  const now = new Date().toISOString();
  await doc.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        ...customer,
        updatedAt: now,
      },
    })
  );
}

export async function registerCustomerRecord(input: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<{ customer?: Customer; error?: string; status: number }> {
  const fullName = String(input.fullName || "").trim();
  const email = String(input.email || "").trim().toLowerCase();
  const password = String(input.password || "");
  const confirmPassword = String(input.confirmPassword || "");

  if (fullName.length < 2) {
    return { error: "Please enter your full name.", status: 400 };
  }
  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email address.", status: 400 };
  }
  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters long.",
      status: 400,
    };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", status: 400 };
  }

  if (isCognitoAuthEnabled()) {
    const cognito = getCognitoClient();
    const { userPoolId, clientId } = getCognitoConfig();
    try {
      const signUpRes = await cognito.send(
        new SignUpCommand({
          ClientId: clientId,
          Username: email,
          Password: password,
          UserAttributes: [
            { Name: "email", Value: email },
            { Name: "name", Value: fullName },
          ],
        })
      );

      // Confirm user server-side via EC2 IAM Role so they can immediately log in
      await cognito.send(
        new AdminConfirmSignUpCommand({
          UserPoolId: userPoolId,
          Username: email,
        })
      );

      const now = new Date().toISOString();
      const customer: Customer = {
        id: signUpRes.UserSub || `cust-${crypto.randomUUID()}`,
        fullName,
        email,
        createdAt: now,
      };

      await putDynamoCustomerProfile(customer);
      return { customer, status: 201 };
    } catch (err: unknown) {
      const name = err instanceof Error ? err.name : "";
      if (name === "UsernameExistsException") {
        return {
          error: "An account with this email address already exists.",
          status: 409,
        };
      }
      if (name === "InvalidPasswordException") {
        return {
          error:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.",
          status: 400,
        };
      }
      console.error("[Cognito registerCustomerRecord]", err);
      return {
        error: "Unable to create account right now. Please try again.",
        status: 500,
      };
    }
  }

  const db = readMockDb();
  const existing = db.customers.find((c) => c.email.toLowerCase() === email);
  if (existing) {
    return {
      error: "An account with this email address already exists.",
      status: 409,
    };
  }

  const now = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);

  const newRecord: CustomerRecord = {
    id: `cust-${crypto.randomUUID()}`,
    fullName,
    email,
    passwordHash,
    passwordSalt: salt,
    createdAt: now,
    updatedAt: now,
  };

  db.customers.push(newRecord);
  writeMockDb(db);

  return { customer: toPublicCustomer(newRecord), status: 201 };
}

export async function authenticateCustomerCredentials(input: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<{
  customer?: Customer;
  sessionToken?: string;
  maxAgeSeconds?: number;
  error?: string;
  status: number;
}> {
  const email = String(input.email || "").trim().toLowerCase();
  const password = String(input.password || "");

  if (!isValidEmail(email) || !password) {
    return {
      error: "Please enter a valid email address and password.",
      status: 400,
    };
  }

  if (isCognitoAuthEnabled()) {
    const cognito = getCognitoClient();
    const { clientId } = getCognitoConfig();
    try {
      const authRes = await cognito.send(
        new InitiateAuthCommand({
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: clientId,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        })
      );

      const accessToken = authRes.AuthenticationResult?.AccessToken;
      if (!accessToken) {
        return { error: "Invalid email address or password.", status: 401 };
      }

      const customer = await getCustomerBySessionToken(accessToken);
      if (!customer) {
        return { error: "Failed to load customer profile.", status: 500 };
      }

      const expiresIn = authRes.AuthenticationResult?.ExpiresIn ?? 3600;
      const maxAgeSeconds = input.rememberMe
        ? Math.max(expiresIn, Math.floor(SESSION_DURATION_DEFAULT_MS / 1000))
        : expiresIn;

      return {
        customer,
        sessionToken: accessToken,
        maxAgeSeconds,
        status: 200,
      };
    } catch (err: unknown) {
      const name = err instanceof Error ? err.name : "";
      if (
        name === "NotAuthorizedException" ||
        name === "UserNotFoundException" ||
        name === "UserNotConfirmedException"
      ) {
        return { error: "Invalid email address or password.", status: 401 };
      }
      console.error("[Cognito authenticateCustomerCredentials]", err);
      return { error: "Failed to sign in.", status: 500 };
    }
  }

  const db = readMockDb();
  const record = db.customers.find((c) => c.email.toLowerCase() === email);

  if (
    !record ||
    !verifyPassword(password, record.passwordSalt, record.passwordHash)
  ) {
    return {
      error: "Invalid email address or password.",
      status: 401,
    };
  }

  // Clean up expired sessions for hygiene
  const nowMs = Date.now();
  db.sessions = db.sessions.filter(
    (s) => new Date(s.expiresAt).getTime() > nowMs
  );

  const durationMs = input.rememberMe
    ? SESSION_DURATION_REMEMBER_MS
    : SESSION_DURATION_DEFAULT_MS;

  const token = crypto.randomBytes(32).toString("hex");
  const nowIso = new Date(nowMs).toISOString();
  const expiresIso = new Date(nowMs + durationMs).toISOString();

  db.sessions.push({
    token,
    customerId: record.id,
    createdAt: nowIso,
    expiresAt: expiresIso,
  });

  writeMockDb(db);

  return {
    customer: toPublicCustomer(record),
    sessionToken: token,
    maxAgeSeconds: Math.floor(durationMs / 1000),
    status: 200,
  };
}

export async function getCustomerBySessionToken(
  token: string | undefined
): Promise<Customer | null> {
  if (!token) return null;

  if (isCognitoAuthEnabled()) {
    try {
      const cognito = getCognitoClient();
      const userRes = await cognito.send(
        new GetUserCommand({ AccessToken: token })
      );
      const attrs = new Map(
        (userRes.UserAttributes ?? []).map((a) => [a.Name, a.Value])
      );
      const sub = attrs.get("sub");
      const email = attrs.get("email") || userRes.Username || "";
      const name = attrs.get("name") || email.split("@")[0] || "BGC Customer";

      if (!sub) return null;

      const profile = await getDynamoCustomerProfile(sub);
      if (profile) {
        return profile;
      }

      const newProfile: Customer = {
        id: sub,
        fullName: name,
        email,
        createdAt: new Date().toISOString(),
      };
      await putDynamoCustomerProfile(newProfile);
      return newProfile;
    } catch {
      return null;
    }
  }

  const db = readMockDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    db.sessions = db.sessions.filter((s) => s.token !== token);
    writeMockDb(db);
    return null;
  }

  const record = db.customers.find((c) => c.id === session.customerId);
  if (!record) return null;

  return toPublicCustomer(record);
}

export async function revokeCustomerSession(
  token: string | undefined
): Promise<void> {
  if (!token) return;

  if (isCognitoAuthEnabled()) {
    try {
      const cognito = getCognitoClient();
      await cognito.send(new GlobalSignOutCommand({ AccessToken: token }));
    } catch {
      // Ignore if token already expired or revoked
    }
    return;
  }

  const db = readMockDb();
  const nextSessions = db.sessions.filter((s) => s.token !== token);
  if (nextSessions.length !== db.sessions.length) {
    db.sessions = nextSessions;
    writeMockDb(db);
  }
}

export async function updateCustomerProfileById(
  customerId: string,
  updates: { fullName: string; contactNumber?: string }
): Promise<{ customer?: Customer; error?: string; status: number }> {
  const fullName = String(updates.fullName || "").trim();
  const contactNumber = updates.contactNumber?.trim() || undefined;

  if (fullName.length < 2) {
    return { error: "Full name must be at least 2 characters.", status: 400 };
  }

  if (isCognitoAuthEnabled()) {
    const existing = await getDynamoCustomerProfile(customerId);
    if (!existing) {
      return { error: "Customer account not found.", status: 404 };
    }

    const doc = getDynamoDbDocClient();
    const { customers: tableName } = getTableNames();
    const updatedAt = new Date().toISOString();

    const updateExpr = contactNumber
      ? "SET fullName = :fullName, contactNumber = :contactNumber, updatedAt = :updatedAt"
      : "SET fullName = :fullName, updatedAt = :updatedAt REMOVE contactNumber";

    const exprValues: Record<string, unknown> = {
      ":fullName": fullName,
      ":updatedAt": updatedAt,
    };
    if (contactNumber) {
      exprValues[":contactNumber"] = contactNumber;
    }

    await doc.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id: customerId },
        UpdateExpression: updateExpr,
        ExpressionAttributeValues: exprValues,
      })
    );

    // Best-effort sync of name attribute back to Cognito
    if (existing.email) {
      try {
        const cognito = getCognitoClient();
        const { userPoolId } = getCognitoConfig();
        await cognito.send(
          new AdminUpdateUserAttributesCommand({
            UserPoolId: userPoolId,
            Username: existing.email,
            UserAttributes: [{ Name: "name", Value: fullName }],
          })
        );
      } catch (err) {
        console.warn("[Cognito AdminUpdateUserAttributes]", err);
      }
    }

    return {
      customer: {
        ...existing,
        fullName,
        contactNumber,
      },
      status: 200,
    };
  }

  const db = readMockDb();
  const index = db.customers.findIndex((c) => c.id === customerId);
  if (index === -1) {
    return { error: "Customer account not found.", status: 404 };
  }

  db.customers[index] = {
    ...db.customers[index],
    fullName,
    contactNumber,
    updatedAt: new Date().toISOString(),
  };

  writeMockDb(db);
  return { customer: toPublicCustomer(db.customers[index]), status: 200 };
}
