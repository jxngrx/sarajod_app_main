import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { SessionProvider } from '../contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ColorProvider } from '@/contexts/ColorContext';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import * as Updates from 'expo-updates';
import { Provider } from 'react-redux';
import { store } from '@/store';

// Prevent splash screen from hiding before loading is complete
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    initialRouteName: './(app)'
};

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
    });

    useEffect(() => {
        async function onFetchUpdateAsync() {
            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                }
            } catch (error: any) {
                console.error('Error fetching update:', error);
            }
        }

        if (loaded) {
            SplashScreen.hideAsync(); // Hide Splash Screen only after everything loads
            // onFetchUpdateAsync(); // Optional OTA updates
        }
    }, [loaded]);

    if (!loaded) return null; // Prevent rendering until fonts are loaded

    return (
        <GestureHandlerRootView className="flex-1">
            <AlertNotificationRoot theme="dark">
                <ColorProvider>
                    <Provider store={store}>
                        <SessionProvider>
                            <SafeAreaProvider>
                                <Slot />
                            </SafeAreaProvider>
                        </SessionProvider>
                    </Provider>
                </ColorProvider>
            </AlertNotificationRoot>
        </GestureHandlerRootView>
    );
}
