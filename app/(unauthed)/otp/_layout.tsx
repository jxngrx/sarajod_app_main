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
import { useRoute } from '@react-navigation/native';
import apiService from '@/hooks/useApi';
import { useSession } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@/hooks/useNavigation';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserDetails, setProfileSelected } from '@/store/slices/userSlice';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { useTheme } from '@/contexts/ThemeProvider';
import useTrans from '@/hooks/useLanguage';

const OTPEntry = () => {
    const { theme } = useTheme();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [loading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(30);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
    const route = useRoute();
    const t = useTrans();
    const { email, name, phoneNumber } = route.params as {
        email: string;
        name: string;
        phoneNumber: string;
    };
    const { signIn } = useSession();
    const { navigateTo } = useNavigation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        } else {
            setIsResendDisabled(false);
        }
    }, [timer]);

    const handleChange = (index: number, text: string) => {
        const newOtp = [...otp];
        newOtp[index] = text;

        if (text && index < otp.length - 1) {
            focusRef.current[index + 1]?.focus();
        } else if (!text && index > 0) {
            focusRef.current[index - 1]?.focus();
        }

        setOtp(newOtp);
    };

    const handleSubmit = async () => {
        const otpCode = otp.join('');
        if (!otpCode) return alert('Please enter the OTP');

        try {
            setLoading(true);
            if (name && phoneNumber) {
                const res = await apiService.verifyOTPRegister({
                    email,
                    otp: otpCode,
                    fullName: name,
                    phoneNumber
                });
                if (res.status === 200)
                    return handleSuccessfulAuth(res, 'REGISTER');
            } else {
                const res = await apiService.verifyOTPLogin({
                    email,
                    otp: otpCode
                });
                if (res.status === 201 || res.status === 200)
                    return handleSuccessfulAuth(res, 'LOGIN');
            }

            throw new Error('OTP Verification failed.');
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ?? 'OTP Verification failed';
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Warning',
                textBody: errorMessage,
                autoClose: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessfulAuth = async (response: any, type: string) => {
        const { token, message } = response.data;
        if (token) {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('colorId', '1');
            await signIn(token);
            await dispatch(fetchUserDetails());
            dispatch(setProfileSelected(0));
            await AsyncStorage.setItem('profileSelected', '0');
        }

        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: message,
            autoClose: 5000
        });

        if (type === 'REGISTER') {
            navigateTo({ pathname: 'SETPASS', params: { email } });
        } else {
            navigateTo({ pathname: 'ENTRYPASS' });
        }
    };

    const handleResendOTP = async () => {
        try {
            setLoading(true);
            const response = await apiService.resendOTP(email);
            if (response.status === 200) {
                setTimer(30);
                setIsResendDisabled(true);
                alert(`OTP is sent on ${email}`);
            } else {
                alert('Failed to resend OTP.');
            }
        } catch {
            alert(`You can't send OTP again before 5 minutes.`);
        } finally {
            setLoading(false);
        }
    };

    const focusRef = React.useRef<(TextInput | null)[]>(
        new Array(6).fill(null)
    );

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View style={[styles.innerContainer]}>
                        <View style={styles.headingWrapper}>
                            <Text
                                style={[styles.title, { color: theme.primary }]}
                            >
                                {t('otp_almost_there')}
                            </Text>
                        </View>

                        <View style={styles.formWrapper}>
                            <View style={styles.instructionWrapper}>
                                <Text
                                    style={[
                                        styles.instructionText,
                                        { color: theme.textSecondary }
                                    ]}
                                >
                                    {t('otp_instruction')}{' '}
                                    <Text
                                        style={{
                                            fontWeight: '600',
                                            color: theme.text
                                        }}
                                    >
                                        {email}
                                    </Text>
                                </Text>
                            </View>

                            <View style={styles.otpWrapper}>
                                {otp.map((_, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => {
                                            focusRef.current[index] = el;
                                        }}
                                        style={[
                                            styles.otpInput,
                                            {
                                                backgroundColor: theme.card,
                                                borderColor: theme.border,
                                                color: theme.text
                                            }
                                        ]}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        value={otp[index]}
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
                                    styles.submitButton,
                                    { backgroundColor: theme.primary }
                                ]}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#ffffff"
                                    />
                                ) : (
                                    <Text style={styles.submitText}>
                                        {t('otp_submit')}
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <View style={styles.resendWrapper}>
                                {isResendDisabled ? (
                                    <View style={styles.resendTextWrapper}>
                                        <Text
                                            style={[
                                                styles.resendText,
                                                { color: theme.textMuted }
                                            ]}
                                        >
                                            {t('otp_resend_line')}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.resendTimer,
                                                { color: theme.textMuted }
                                            ]}
                                        >
                                            {t('otp_resend_timer')} {timer}
                                        </Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={handleResendOTP}
                                        disabled={loading}
                                    >
                                        <Text
                                            style={[
                                                styles.resendNow,
                                                { color: theme.info }
                                            ]}
                                        >
                                            {t('otp_resend_now')}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
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
    innerContainer: {
        flex: 1,
        paddingHorizontal: wp('6%')
    },
    headingWrapper: {
        marginTop: hp('8%'),
        alignItems: 'flex-start'
    },
    title: {
        fontSize: wp('10%'),
        fontWeight: 'bold'
    },
    formWrapper: {
        flex: 1
    },
    instructionWrapper: {
        marginTop: hp('4%'),
        marginBottom: hp('8%')
    },
    instructionText: {
        fontSize: wp('4.5%')
    },
    otpWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('3%')
    },
    otpInput: {
        borderWidth: 1,
        borderRadius: wp('2%'),
        padding: wp('3%'),
        textAlign: 'center',
        fontSize: wp('5%'),
        width: wp('12%')
    },
    submitButton: {
        borderRadius: wp('2%'),
        paddingVertical: hp('2%'),
        marginTop: hp('3%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    },
    submitText: {
        color: '#ffffff',
        fontSize: wp('4.5%'),
        fontWeight: '600',
        textAlign: 'center'
    },
    resendWrapper: {
        alignItems: 'center',
        marginTop: hp('2%')
    },
    resendTextWrapper: {
        gap: hp('2%'),
        marginTop: hp('5%')
    },
    resendText: {
        fontWeight: '600',
        textAlign: 'center'
    },
    resendTimer: {
        textAlign: 'center'
    },
    resendNow: {
        fontWeight: '600'
    }
});

export default OTPEntry;
