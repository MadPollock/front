import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export type RBACRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: RBACRole;
  metadata: {
    app?: Record<string, unknown>;
    user?: Record<string, unknown>;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string | undefined>;
  hasRole: (roles: RBACRole | RBACRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    isAuthenticated,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  // Map Auth0 user to our User interface
  const user: User | null = auth0User
    ? {
        id: auth0User.sub || '',
        name: auth0User.name || auth0User.email || 'User',
        email: auth0User.email || '',
        role: (auth0User['https://crossramp.app/role'] as RBACRole) || 'user',
        metadata: {
          app: (auth0User as any).app_metadata ?? {},
          user: (auth0User as any).user_metadata ?? {},
        },
      }
    : null;

  // Login wrapper - redirects to Auth0 Universal Login
  const login = async (email: string, password: string) => {
    // Auth0 uses redirect-based login, not direct credentials
    // For hosted login page, we don't pass credentials
    await loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
    });
  };

  // Logout wrapper
  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  // Get access token for API calls
  const getAccessToken = async (): Promise<string | undefined> => {
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      return undefined;
    }
  };

  const hasRole = (roles: RBACRole | RBACRole[]) => {
    const roleList = Array.isArray(roles) ? roles : [roles];
    return user ? roleList.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        getAccessToken,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
