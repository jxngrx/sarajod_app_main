// theme.ts

export const LightTheme = {
    background: '#FFFFFF',
    surface: '#F8F9FB',
    card: '#F0F0F0',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    text: '#1F2937',
    textSecondary: '#4B5563',
    textThirdForGreen: '#000000',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    divider: '#D1D5DB',
    success: '#16A34A',
    danger: '#DC2626',
    warning: '#F59E0B',
    info: '#2563EB',
    shadow: '#000000',
    skeleton: '#E5E7EB',
    white: '#FFFFFF'
};

export const DarkTheme = {
    background: '#121212',
    surface: '#1E1E1E',
    card: '#1E1E1E',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    text: '#EDEDED',
    textSecondary: '#9CA3AF',
    textThirdForGreen: '#90EE90',
    textMuted: '#6B7280',
    border: '#2D2D2D',
    divider: '#333333',
    success: '#16A34A',
    danger: '#DC2626',
    warning: '#FBBF24',
    info: '#60A5FA',
    shadow: '#000000',
    skeleton: '#2A2A2A',
    white: '#FFFFFF'
};

export type ThemeType = typeof LightTheme;
