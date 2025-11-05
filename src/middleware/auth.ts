import { GraphQLError } from 'graphql';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt';
import { User } from '../models/User';

export interface AuthContext {
  user?: {
    userId: string;
    email: string;
  };
}

export async function createAuthContext(req: any): Promise<AuthContext> {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return {};
  }

  try {
    const decoded = verifyToken(token);

    // Verify user still exists in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }

    return {
      user: {
        userId: decoded.userId,
        email: decoded.email
      }
    };
  } catch (error) {
    // Token is invalid or expired - return empty context (no auth required for some queries)
    return {};
  }
}

export function requireAuth(context: AuthContext): { userId: string; email: string } {
  if (!context.user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
  return context.user;
}