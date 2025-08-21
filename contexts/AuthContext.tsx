import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@/hooks/useNavigation';
import apiService from '@/hooks/useApi';

type AuthContextType = {
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  session: string | null;
  isLoading: boolean;
};

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use the session
export function useSession(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

// Session provider component
export function SessionProvider({ children }: React.PropsWithChildren<{}>) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { navigateTo } = useNavigation();

  // Load session from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) setSession(token);
      } catch (error) {
        if (__DEV__) console.error('Failed to load token:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Sign in function
  const signIn = useCallback(async (token: string) => {
    try {
      await AsyncStorage.setItem('token', token);
      setSession(token);
    } catch (error) {
      if (__DEV__) console.error('Failed to sign in:', error);
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'userId']);
      setSession(null);
      navigateTo({ pathname: 'LOGIN' });
    } catch (error) {
      if (__DEV__) console.error('Failed to sign out:', error);
    }
  }, [navigateTo]);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await apiService.getRefreshToken();
      if (response.status === 200 && response.data?.token) {
        const newToken = response.data.token;
        await AsyncStorage.setItem('token', newToken);
        setSession(newToken);
        return true;
      }
    } catch (error) {
      if (__DEV__) console.error('Token refresh failed:', error);
    }
    await signOut();
    return false;
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, refreshToken, session, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
