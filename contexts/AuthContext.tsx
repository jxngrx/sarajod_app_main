import { createContext, useContext, useState } from 'react';
import { useStorageState } from '@/hooks/useStorageState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@/hooks/useNavigation';

const AuthContext = createContext<{
    signIn: (token: string) => void;
    signOut: () => void;
    session?: string | null;
    // isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null
    // isLoading: false
});

export function useSession() {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useSession must be wrapped in a <SessionProvider />');
    }

    return value;
}

export function SessionProvider({ children }: React.PropsWithChildren<{}>) {
    const [[isLoading, session], setSession] = useStorageState('session');
    const { navigateTo } = useNavigation();
    const signIn = (token: string) => {
        setSession(token);
    };

    const signOut = () => {
        setSession(null);
        AsyncStorage.setItem('userId', '');
        navigateTo({
            pathname: 'LOGIN'
        });
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                session
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
