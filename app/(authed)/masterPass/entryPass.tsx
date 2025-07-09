import React, { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    SafeAreaView,
    Platform,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRoute } from '@react-navigation/native';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { router } from 'expo-router';
import { useNavigation } from '@/hooks/useNavigation';
import apiService from '@/hooks/useApi';
import { useTheme } from '@/contexts/ThemeProvider';
import StatusBarColor from '@/components/StatusBarColor';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
    fetchAllTransactions,
    fetchUserDetails
} from '@/store/slices/userSlice';
import { useAppDispatch } from '@/store/hooks';
import useTrans from '@/hooks/useLanguage';

const MasterPassEntry = () => {
    const [masterPass, setMasterPass] = useState<string[]>(
        new Array(6).fill('')
    );
    const [loading, setLoading] = useState(false);
    const [biometricType, setBiometricType] = useState<string | null>(null);
    const t = useTrans();
    const { theme } = useTheme();
    const route = useRoute();
    const dispatch = useAppDispatch();
    const { email } = route.params as { email: string };
    const { navigateTo } = useNavigation();

    const focusRef = React.useRef<(TextInput | null)[]>(
        new Array(6).fill(null)
    );

    useEffect(() => {
        checkBiometricSupport();
    }, []);

    const checkBiometricSupport = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!hasHardware || !enrolled) return;

        const types =
            await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (
            types.includes(
                LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
            )
        ) {
            setBiometricType('Face ID');
        } else if (
            types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ) {
            setBiometricType('Fingerprint');
        }
    };

    const handleBiometricAuth = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage:
                biometricType === 'Face ID'
                    ? 'Unlock with Face ID'
                    : 'Unlock with Fingerprint',
            fallbackLabel: 'Enter Master Password',
            cancelLabel: 'Cancel'
        });

        if (result.success) {
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: `${biometricType} Authentication Successful!`,
                autoClose: 5000
            });
            router.replace('./home');
        } else {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Failed',
                textBody: 'Authentication Failed',
                autoClose: 4000
            });
        }
    };

    const handleChange = (index: number, text: string) => {
        const updated = [...masterPass];
        updated[index] = text;

        if (text && index < 5) focusRef.current[index + 1]?.focus();
        else if (!text && index > 0) focusRef.current[index - 1]?.focus();

        setMasterPass(updated);
    };

    const handleSubmit = async () => {
        if (masterPass.join('') === '') {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Warning',
                textBody: 'Master password cannot be empty.',
                autoClose: 5000
            });
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.validateMasterPass({
                masterPass: Number(masterPass.join(''))
            });

            if (response.status === 200) {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: 'Welcome Back.',
                    autoClose: 5000
                });
                router.replace('./home');
            } else {
                throw new Error();
            }
        } catch (error: any) {
            const message =
                error?.response?.data?.message || 'Verification Error';
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Error',
                textBody: message,
                autoClose: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleMasterPassCheck = async () => {
            try {
                const response = await apiService.isMasterPass();
                const isSet = response.status === 200;
                if (isSet) {
                    await Promise.all([
                        dispatch(fetchUserDetails()),
                        dispatch(fetchAllTransactions())
                    ]);
                } else {
                    navigateTo({
                        pathname: 'SETPASS'
                    });
                }
            } catch (err: any) {
                const status = err?.response?.status;
                const message = err?.response?.data?.message || '';
                if (status === 400 && message === 'Master password not set.') {
                    navigateTo({
                        pathname: 'SETPASS'
                    });
                }
            }
        };
        handleMasterPassCheck();
    });

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <StatusBarColor />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.flex}
                >
                    <View style={styles.innerContainer}>
                        <Text style={[styles.title, { color: theme.primary }]}>
                            {t('master_welcome_back')}
                        </Text>

                        <Text
                            style={[styles.subText, { color: theme.textMuted }]}
                        >
                            {t('master_instruction')}
                        </Text>

                        <View style={styles.otpContainer}>
                            {masterPass.map((_, index) => (
                                <TextInput
                                    key={index}
                                    ref={(el) => {
                                        focusRef.current[index] = el;
                                    }}
                                    style={[
                                        styles.otpInput,
                                        {
                                            borderColor: theme.border,
                                            backgroundColor: theme.card,
                                            color: theme.text
                                        }
                                    ]}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    value={masterPass[index]}
                                    onChangeText={(text) =>
                                        handleChange(index, text)
                                    }
                                    autoFocus={index === 0}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={[
                                styles.button,
                                { backgroundColor: theme.primary }
                            ]}
                            disabled={loading || masterPass.join('').length < 6}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    {t('master_confirm')}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {biometricType && (
                            <TouchableOpacity
                                onPress={handleBiometricAuth}
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: theme.primary,
                                        marginTop: hp(2)
                                    }
                                ]}
                            >
                                <Text style={styles.buttonText}>
                                    {t('master_use_bio')}
                                    {biometricType}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={() =>
                                navigateTo({ pathname: 'FORGETPASS' })
                            }
                            style={{ marginTop: hp(2) }}
                        >
                            <Text
                                style={{
                                    color: theme.text,
                                    textAlign: 'center',
                                    textDecorationLine: 'underline',
                                    fontWeight: '600',
                                    fontSize: hp(2.1)
                                }}
                            >
                                {t('master_forgot_pass')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flex: {
        flex: 1
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: wp(6),
        marginTop: hp(10)
    },
    title: {
        fontSize: wp(10),
        fontWeight: 'bold',
        marginBottom: hp(3)
    },
    subText: {
        fontSize: wp(4.5),
        marginBottom: hp(6)
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(3)
    },
    otpInput: {
        borderWidth: 1,
        borderRadius: wp(2),
        padding: wp(3),
        textAlign: 'center',
        fontSize: wp(5),
        width: wp(12)
    },
    button: {
        borderRadius: wp(2),
        paddingVertical: hp(2),
        marginTop: hp(1.5),
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: wp(4.5),
        fontWeight: '600'
    }
});

export default MasterPassEntry;
