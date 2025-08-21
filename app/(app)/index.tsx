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
    const { isLoading, refreshToken } = useSession();
    const dispatch = useAppDispatch();

    const [session, setSession] = useState<string | null>(null);
    const [appReady, setAppReady] = useState(false);
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

    const cacheUserData = async (userDetails: any, transactions: any) => {
        try {
            await AsyncStorage.setItem(
                'cachedUserDetails',
                JSON.stringify(userDetails)
            );
            await AsyncStorage.setItem(
                'cachedTransactions',
                JSON.stringify(transactions)
            );
        } catch (e) {
            console.warn('Failed to cache user data', e);
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            setSession(token);

            if (!token) {
                setRedirectPath('/welcome');
                return;
            }

            let userResponse;
            let masterPassResponse;

            try {
                userResponse = await apiService.getUserDetails();
                masterPassResponse = await apiService.isMasterPass();
            } catch (err: any) {
                if (err?.response?.status === 401) {
                    const refreshed = await refreshToken();
                    if (refreshed) {
                        userResponse = await apiService.getUserDetails();
                        masterPassResponse = await apiService.isMasterPass();
                    } else {
                        setRedirectPath('/welcome');
                        return;
                    }
                } else {
                    setRedirectPath('/welcome');
                    return;
                }
            }

            if (userResponse && userResponse.data) {
                // Fetch and cache user data
                const userDataAction = await dispatch(fetchUserDetails());
                const transactionsAction = await dispatch(
                    fetchAllTransactions()
                );

                await cacheUserData(
                    userDataAction.payload,
                    transactionsAction.payload
                );
            }

            if (masterPassResponse?.status === 200) {
                setRedirectPath('/(authed)/masterPass/entryPass');
            } else {
                setRedirectPath('/welcome');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            setRedirectPath('/welcome');
        } finally {
            setAppReady(true);
            await SplashScreen.hideAsync();
            startScaleAnimation();
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading || !appReady || redirectPath === null) {
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
