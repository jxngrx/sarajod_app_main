import { useSession } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import {
    KeyboardAvoidingView,
    SafeAreaView,
    Platform,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import imageFiller from '@/assets/images/imageFiller.png';
import useTrans from '@/hooks/useLanguage';

const Welcome = () => {
    const { navigateTo } = useNavigation();
    const t = useTrans();

    useEffect(() => {
        async function updateCheckIn() {
            await AsyncStorage.setItem('hasSeenWelcome', 'false');
        }
        updateCheckIn();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('welcome')}</Text>
                        <Text style={styles.subtitle}>
                            {t('welcome_subtitle')}
                        </Text>
                    </View>

                    <Image
                        source={imageFiller}
                        resizeMode="contain"
                        style={styles.heroImage}
                    />

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            onPress={() => navigateTo({ pathname: 'LOGIN' })}
                            style={styles.primaryButton}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.primaryButtonText}>
                                {t('login')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigateTo({ pathname: 'REGISTER' })}
                            style={styles.secondaryButton}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.secondaryButtonText}>
                                {t('create_account')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#2377ff'
    },
    keyboardAvoidingView: {
        flex: 1
    },
    container: {
        flex: 1,
        paddingHorizontal: wp(6),
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: hp(5)
    },
    header: {
        width: '100%',
        marginTop: hp(6),
        alignItems: 'flex-start'
    },
    title: {
        fontSize: wp(10),
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: 1,
        textShadowColor: 'rgba(0,0,0,0.25)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3
    },
    subtitle: {
        fontSize: wp(5),
        color: '#E0ECFF',
        marginTop: hp(1),
        lineHeight: hp(3),
        fontWeight: '400',
        opacity: 0.9
    },
    heroImage: {
        position: 'absolute',
        right: wp(-5),
        top: hp(10),
        width: wp(105),
        height: hp(65),
        borderRadius: wp(4),
        marginVertical: hp(2)
    },
    buttonGroup: {
        width: '100%',
        alignItems: 'center',
        gap: hp(2)
    },
    primaryButton: {
        width: '100%',
        backgroundColor: '#ffffff20',
        paddingVertical: hp(2),
        borderRadius: wp(5),
        borderWidth: 1.2,
        borderColor: '#ffffff40',
        alignItems: 'center',
        backdropFilter: 'blur(6px)'
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: wp(4.8),
        fontWeight: '600',
        letterSpacing: 0.5
    },
    secondaryButton: {
        width: '100%',
        paddingVertical: hp(2),
        borderRadius: wp(5),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: '#ffffff30',
        alignItems: 'center'
    },
    secondaryButtonText: {
        color: '#ffffff',
        fontSize: wp(4.2),
        fontWeight: '500',
        letterSpacing: 0.3
    }
});

export default Welcome;
