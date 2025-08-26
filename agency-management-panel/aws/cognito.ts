import { 
  InitiateAuthCommand, 
  SignUpCommand, 
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, COGNITO_CONFIG } from './config';

export interface CognitoUser {
  username: string;
  email: string;
  attributes?: Record<string, string>;
}

export interface AuthResult {
  success: boolean;
  user?: CognitoUser;
  error?: string;
  session?: any;
}

export class CognitoService {
  /**
   * Sign in user with username/email and password
   */
  static async signIn(username: string, password: string): Promise<AuthResult> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: COGNITO_CONFIG.ClientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });

      const response = await cognitoClient.send(command);
      
      if (response.AuthenticationResult) {
        return {
          success: true,
          session: response.AuthenticationResult,
          user: { username, email: username }
        };
      }

      return {
        success: false,
        error: 'Authentication failed'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign in failed'
      };
    }
  }

  /**
   * Sign up new user
   */
  static async signUp(email: string, password: string, attributes?: Record<string, string>): Promise<AuthResult> {
    try {
      const userAttributes = [
        { Name: 'email', Value: email },
        ...Object.entries(attributes || {}).map(([key, value]) => ({
          Name: key,
          Value: value
        }))
      ];

      const command = new SignUpCommand({
        ClientId: COGNITO_CONFIG.ClientId,
        Username: email,
        Password: password,
        UserAttributes: userAttributes,
      });

      await cognitoClient.send(command);

      return {
        success: true,
        user: { username: email, email }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign up failed'
      };
    }
  }

  /**
   * Confirm user sign up with verification code
   */
  static async confirmSignUp(email: string, code: string): Promise<AuthResult> {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: COGNITO_CONFIG.ClientId,
        Username: email,
        ConfirmationCode: code,
      });

      await cognitoClient.send(command);

      return {
        success: true,
        user: { username: email, email }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Confirmation failed'
      };
    }
  }

  /**
   * Get user information
   */
  static async getUser(username: string): Promise<AuthResult> {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: COGNITO_CONFIG.UserPoolId,
        Username: username,
      });

      const response = await cognitoClient.send(command);
      
      if (response.User) {
        const attributes = response.User.Attributes?.reduce((acc, attr) => {
          if (attr.Name && attr.Value) {
            acc[attr.Name] = attr.Value;
          }
          return acc;
        }, {} as Record<string, string>);

        return {
          success: true,
          user: {
            username: response.User.Username || username,
            email: attributes?.email || username,
            attributes
          }
        };
      }

      return {
        success: false,
        error: 'User not found'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get user'
      };
    }
  }

  /**
   * Forgot password flow
   */
  static async forgotPassword(email: string): Promise<AuthResult> {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: COGNITO_CONFIG.ClientId,
        Username: email,
      });

      await cognitoClient.send(command);

      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Forgot password failed'
      };
    }
  }

  /**
   * Confirm new password with verification code
   */
  static async confirmForgotPassword(email: string, code: string, newPassword: string): Promise<AuthResult> {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: COGNITO_CONFIG.ClientId,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
      });

      await cognitoClient.send(command);

      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password confirmation failed'
      };
    }
  }
}
