import { Image, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useSession } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import apiService from '@/hooks/useApi';
import * as SplashScreen from 'expo-splash-screen';
import Logo from '@/assets/images/icon.png';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    Easing
} from 'react-native-reanimated';
import { fetchUserDetails, selectUser } from '@/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
    const scale = useSharedValue(1);
    const { session } = useSession();
    const dispatch = useAppDispatch();
    const [appReady, setAppReady] = useState(false);
    const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));
    const [isMasterPassSet, setIsMasterPassSet] = useState<boolean | null>(
        null
    );

    const fetchData = useCallback(async () => {
        try {
            const userToken = session;
            const seenWelcome = await AsyncStorage.getItem('hasSeenWelcome');

            setHasSeenWelcome(seenWelcome === 'true'); // ✅ always set this

            if (userToken) {
                const response = await apiService.isMasterPass();
                setIsMasterPassSet(response.status === 200);
                const user = await dispatch(fetchUserDetails());
            } else {
                setIsMasterPassSet(false);
            }
        } catch (error) {
            console.log('Startup error:', error);
        } finally {
            setAppReady(true);
            await SplashScreen.hideAsync();
            scale.value = withRepeat(
                withTiming(1.2, {
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease)
                }),
                -1,
                true
            );
        }
    }, [session]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!appReady || isMasterPassSet === null || hasSeenWelcome === null) {
        return (
            <View className="flex items-center justify-center bg-white h-screen w-full">
                <Animated.Image
                    className="rounded-2xl h-[20%] w-[40%] object-cover"
                    source={Logo}
                    style={animatedStyle}
                />
                <Text className="text-black">Loading...</Text>
            </View>
        );
    }

    if (session === null) {
        return <Redirect href="../welcome" />;
    }

    // if (!hasSeenWelcome) {
    //     return <Redirect href="./welcome" />;
    // }

    if (!isMasterPassSet) {
        return <Redirect href="./set-master-pass" />;
    }

    if (session && isMasterPassSet) {
        return <Redirect href="./masterPass/entryPass" />;
    }
}
