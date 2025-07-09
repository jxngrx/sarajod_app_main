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
    const [isMasterPassSet, setIsMasterPassSet] = useState<boolean | null>(
        null
    );

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

            if (session) {
                setIsMasterPassSet(true);
            } else {
                setIsMasterPassSet(false);
            }
        } catch (error) {
            console.error('App startup error:', error);
            setIsMasterPassSet(false);
        } finally {
            setAppReady(true);
            await SplashScreen.hideAsync();
            startScaleAnimation();
        }
    }, [session]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Still loading
    if (!appReady || isMasterPassSet === null || hasSeenWelcome === null) {
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

    // No session, redirect to home
    if (!session) return <Redirect href="/welcome" />;

    // Session present and master pass is set
    return <Redirect href="/(authed)/masterPass/entryPass" />;
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
