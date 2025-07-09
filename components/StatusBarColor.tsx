import React from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from '@/contexts/ThemeProvider';

const StatusBarColor = () => {
  const { theme, mode } = useTheme();

  return (
    <StatusBar
      barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
      backgroundColor={theme.background}
    />
  );
};

export default StatusBarColor;
