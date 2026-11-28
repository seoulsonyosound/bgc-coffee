import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { AWS_CONFIG } from "@/lib/aws-config";

let cognitoClient: CognitoIdentityProviderClient | null = null;

export function getCognitoClient(): CognitoIdentityProviderClient {
  if (!cognitoClient) {
    cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION || AWS_CONFIG.region,
    });
  }
  return cognitoClient;
}

export function getCognitoConfig() {
  return {
    userPoolId:
      process.env.COGNITO_USER_POOL_ID || AWS_CONFIG.cognito.userPoolId,
    clientId: process.env.COGNITO_CLIENT_ID || AWS_CONFIG.cognito.clientId,
  };
}

export function isCognitoConfigured(): boolean {
  const { userPoolId, clientId } = getCognitoConfig();
  return Boolean(userPoolId && clientId);
}
