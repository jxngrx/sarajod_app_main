import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme, ThemeType } from '@/constants/theme';

interface ThemeContextType {
    theme: ThemeType;
    mode: 'light' | 'dark';
    toggleTheme?: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: LightTheme,
    mode: 'light'
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const colorScheme = useColorScheme();
    const [mode, setMode] = useState<'light' | 'dark'>(colorScheme || 'light');

    const toggleTheme = () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const theme = mode === 'dark' ? DarkTheme : LightTheme;

    return (
        <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
