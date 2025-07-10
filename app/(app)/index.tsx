import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    Easing
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSession } from '../../contexts/AuthContext';
import apiService from '@/hooks/useApi';
import { useAppDispatch } from '@/store/hooks';
import {
    fetchAllTransactions,
    fetchUserDetails
} from '@/store/slices/userSlice';

import Logo from '@/assets/images/icon.png';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
    const { session, signOut } = useSession();
    const dispatch = useAppDispatch();
    const [appReady, setAppReady] = useState(false);
    const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);
    const [redirectPath, setRedirectPath] = useState<string | null>(null);

    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const startScaleAnimation = () => {
        scale.value = withRepeat(
            withTiming(1.2, {
                duration: 1000,
                easing: Easing.inOut(Easing.ease)
            }),
            -1,
            true
        );
    };

    const fetchData = useCallback(async () => {
        try {
            const seenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
            setHasSeenWelcome(seenWelcome === 'true');

            if (!session) {
                console.log('❌ No session found');
                setRedirectPath('/welcome');
                return;
            }

            const userResponse = await apiService.getUserDetails();
            console.log('✅ User data fetched:', userResponse?.data);

            const masterPassExists = userResponse?.data?.user?.masterPass;
            console.log('🔐 Master Pass Set:', masterPassExists);

            await Promise.all([
                dispatch(fetchUserDetails()),
                dispatch(fetchAllTransactions())
            ]);

            if (masterPassExists) {
                setRedirectPath('/(authed)/masterPass/entryPass');
            }
        } catch (error) {
            setRedirectPath('/welcome');
        } finally {
            setAppReady(true);
            await SplashScreen.hideAsync();
            startScaleAnimation();
        }
    }, [session]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!appReady || hasSeenWelcome === null || redirectPath === null) {
        return (
            <View style={styles.container}>
                <Animated.Image
                    source={Logo}
                    style={[styles.logo, animatedStyle]}
                    resizeMode="contain"
                />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return <Redirect href={redirectPath as any} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    logo: {
        width: wp('40%'),
        height: hp('20%'),
        borderRadius: wp('5%')
    },
    loadingText: {
        marginTop: hp('2%'),
        fontSize: wp('4%'),
        color: '#000000'
    }
});
