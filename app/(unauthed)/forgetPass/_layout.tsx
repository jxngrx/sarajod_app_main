import apiService from '@/hooks/useApi';
import React, { useState } from 'react';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { useTheme } from '@/contexts/ThemeProvider';
import useTrans from '@/hooks/useLanguage';
import { useNavigation } from '@/hooks/useNavigation';

const ForgotPassword = () => {
    const [userEmail, setUserEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState<'EMAIL' | 'OTP_PASSWORD'>('EMAIL');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '' });
    const t = useTrans();
    const { navigateTo } = useNavigation();
    const { theme } = useTheme();

    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateInputs = () => {
        let isValid = true;
        const newErrors = { email: '' };

        if (!validateEmail(userEmail)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const requestOtp = async () => {
        if (!validateInputs()) return;
        try {
            setLoading(true);
            const response = await apiService.requestOtpForgetPass(userEmail);

            if (response.status === 200) {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'OTP Sent',
                    textBody: response.data?.message,
                    autoClose: 3000
                });
                setStep('OTP_PASSWORD');
            }
        } catch (error: any) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Error',
                textBody:
                    error?.response?.data?.message || 'Something went wrong.',
                autoClose: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        if (!otp || !newPassword) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Missing Fields',
                textBody: 'Please enter both OTP and new password.',
                autoClose: 3000
            });
            return;
        }

        try {
            setLoading(true);
            const response = await apiService.resetPassVerify({
                email: userEmail,
                otp,
                newPassword
            });

            if (response.status === 200) {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: 'Password updated successfully.',
                    autoClose: 3000
                });
                navigateTo({
                    pathname: 'ENTRYPASS'
                });
            }
        } catch (error: any) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Error',
                textBody:
                    error?.response?.data?.message || 'Password reset failed.',
                autoClose: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        style={[
                            styles.flex1,
                            { backgroundColor: theme.background }
                        ]}
                    >
                        <View style={styles.centeredTop}>
                            <View style={styles.absoluteTextWrapper}>
                                <Text
                                    style={[
                                        styles.topText,
                                        { color: theme.skeleton }
                                    ]}
                                >
                                    {t('forgot_reset_text')}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={[
                                styles.loginWrapper,
                                { backgroundColor: theme.surface }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.loginTitle,
                                    { color: theme.primary }
                                ]}
                            >
                                {t('forgot_title')}
                            </Text>

                            <Text
                                style={[
                                    styles.emailLabel,
                                    { color: theme.textSecondary }
                                ]}
                            >
                                {t('forgot_enter_email')}
                            </Text>

                            <TextInput
                                style={[
                                    styles.textInput,
                                    {
                                        color: theme.text,
                                        backgroundColor: theme.card,
                                        borderColor: errors.email
                                            ? theme.danger
                                            : theme.border
                                    }
                                ]}
                                keyboardType="email-address"
                                value={userEmail}
                                onChangeText={setUserEmail}
                                placeholder={t('forgot_placeholder_email')}
                                placeholderTextColor={theme.textMuted}
                                editable={step === 'EMAIL'}
                            />
                            {errors.email && (
                                <Text
                                    style={[
                                        styles.errorText,
                                        { color: theme.danger }
                                    ]}
                                >
                                    {errors.email}
                                </Text>
                            )}

                            {step === 'OTP_PASSWORD' && (
                                <>
                                    <Text
                                        style={[
                                            styles.emailLabel,
                                            { color: theme.textSecondary }
                                        ]}
                                    >
                                        {t('forgot_enter_otp')}
                                    </Text>
                                    <TextInput
                                        style={[
                                            styles.textInput,
                                            {
                                                color: theme.text,
                                                backgroundColor: theme.card,
                                                borderColor: theme.border
                                            }
                                        ]}
                                        keyboardType="numeric"
                                        value={otp}
                                        onChangeText={setOtp}
                                        placeholder={t(
                                            'forgot_placeholder_otp'
                                        )}
                                        placeholderTextColor={theme.textMuted}
                                    />

                                    <Text
                                        style={[
                                            styles.emailLabel,
                                            { color: theme.textSecondary }
                                        ]}
                                    >
                                        {t('forgot_enter_new_pass')}
                                    </Text>
                                    <TextInput
                                        style={[
                                            styles.textInput,
                                            {
                                                color: theme.text,
                                                backgroundColor: theme.card,
                                                borderColor: theme.border
                                            }
                                        ]}
                                        secureTextEntry
                                        keyboardType="numeric"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        placeholder={t(
                                            'forgot_placeholder_new_pass'
                                        )}
                                        placeholderTextColor={theme.textMuted}
                                    />
                                </>
                            )}

                            <TouchableOpacity
                                onPress={
                                    step === 'EMAIL'
                                        ? requestOtp
                                        : resetPassword
                                }
                                style={[
                                    styles.loginButton,
                                    { backgroundColor: theme.primary }
                                ]}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#ffffff"
                                    />
                                ) : (
                                    <Text style={styles.loginButtonText}>
                                        {step === 'EMAIL'
                                            ? t('forgot_send_otp')
                                            : t('forgot_reset_button')}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1
    },
    centeredTop: {
        alignItems: 'center',
        marginTop: hp(8)
    },
    absoluteTextWrapper: {
        position: 'absolute',
        width: wp(100),
        alignItems: 'center',
        padding: 0
    },
    topText: {
        width: '100%',
        left: 0,
        top: hp(6),
        fontWeight: '600',
        textAlign: 'center',
        fontSize: hp(5)
    },
    loginWrapper: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        padding: wp(6),
        paddingBottom: hp(8),
        borderTopLeftRadius: wp(10),
        borderTopRightRadius: wp(10),
        marginTop: hp(8)
    },
    loginTitle: {
        marginBottom: wp(3),
        fontSize: hp(7),
        fontWeight: 'bold'
    },
    emailLabel: {
        fontSize: hp(2.2),
        marginBottom: hp(1)
    },
    textInput: {
        width: '100%',
        borderRadius: wp(4),
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        fontSize: hp(2),
        marginBottom: hp(2),
        borderWidth: 1
    },
    errorText: {
        fontSize: hp(1.6),
        marginBottom: hp(1)
    },
    loginButton: {
        borderRadius: wp(3),
        paddingVertical: hp(2),
        marginVertical: hp(2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5
    },
    loginButtonText: {
        color: 'white',
        fontSize: hp(2.2),
        fontWeight: '600',
        textAlign: 'center'
    }
});

export default ForgotPassword;
