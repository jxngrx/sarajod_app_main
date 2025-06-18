import React, { useState, useEffect, useContext } from 'react';
import {
    KeyboardAvoidingView,
    SafeAreaView,
    Platform,
    Text,
    View,
    Image,
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
import { colorBg } from '@/components/StyleDetailsComponent';
import { ColorContext } from '@/contexts/ColorContext';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserDetails, setProfileSelected } from '@/store/slices/userSlice';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const OTPEntry = () => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [loading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(30);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

    const { colorId }: any = useContext(ColorContext);
    const selectedColor =
        colorBg.find((color) => color.id === colorId)?.color || '#2377ff';
    const route = useRoute();
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

    const handleChange = (index: any, text: any) => {
        let newOtp = [...otp];
        newOtp[index] = text;

        if (text && index < otp.length - 1) {
            focusRef.current[index + 1]?.focus();
        } else if (!text && index > 0) {
            focusRef.current[index - 1]?.focus();
        }

        setOtp(newOtp);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const otpCode = otp.join('');
            if (!otpCode) {
                alert('Please enter the OTP');
                return;
            }

            if (name && phoneNumber) {
                const otpData = {
                    email,
                    otp: otpCode,
                    fullName: name,
                    phoneNumber
                };
                const response = await apiService.verifyOTPRegister(otpData);
                if (response.status === 200) {
                    await handleSuccessfulAuth(response, 'REGISTER');
                } else {
                    throw new Error('Registration failed.');
                }
            } else if (name === '' && phoneNumber === '') {
                const otpData = { email, otp: otpCode };
                const response = await apiService.verifyOTPLogin(otpData);
                if (response.status === 201 || response.status === 200) {
                    await handleSuccessfulAuth(response, 'LOGIN');
                } else {
                    throw new Error('Login failed.');
                }
            } else {
                alert('Please fill in all fields for registration');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
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

    const handleSuccessfulAuth = async (response: any, path: any) => {
        const { token, message } = response.data;
        if (token) {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('colorId', '1');
            await signIn(token);
            // 👉 This updates the Redux store with the latest user details
            await dispatch(fetchUserDetails());
            dispatch(setProfileSelected(0));

            await AsyncStorage.setItem('profileSelected', '0');
        }

        signIn(token);

        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: message,
            autoClose: 5000
        });

        if (path === 'REGISTER') {
            navigateTo({ pathname: 'SETPASS', params: { email } });
        } else if (path === 'LOGIN') {
            navigateTo({ pathname: 'ENTRYPASS' });
        } else {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'ERROR',
                textBody: 'Something Bad Occurred',
                autoClose: 5000
            });
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        try {
            const response = await apiService.resendOTP(email);
            if (response.status === 200) {
                setTimer(30);
                setIsResendDisabled(true);
                alert(`OTP is sent on ${email}`);
            } else {
                alert('Failed to resend OTP.');
            }
        } catch (error) {
            alert(
                `You Can't Send OTP before 5 minutes, Try Again in 5 Minutes`
            );
        } finally {
            setLoading(false);
        }
    };

    const focusRef = React.useRef<(TextInput | null)[]>(
        new Array(6).fill(null)
    );

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View style={styles.innerContainer}>
                        <View style={styles.headingWrapper}>
                            <Text style={styles.title}>Almost there</Text>
                        </View>
                        <View style={styles.formWrapper}>
                            <View style={styles.instructionWrapper}>
                                <Text style={styles.instructionText}>
                                    Please enter the 6-digit code sent to{' '}
                                    <Text style={styles.emailText}>
                                        {email}
                                    </Text>{' '}
                                    for verification.
                                </Text>
                            </View>
                            <View style={styles.otpWrapper}>
                                {otp.map((_, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => {
                                            focusRef.current[index] = el;
                                        }}
                                        style={styles.otpInput}
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
                                style={[styles.submitButton]}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#ffffff"
                                    />
                                ) : (
                                    <Text style={styles.submitText}>
                                        Submit
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <View style={styles.resendWrapper}>
                                {isResendDisabled ? (
                                    <View style={styles.resendTextWrapper}>
                                        <Text style={styles.resendText}>
                                            Didn't receive any code? Resend
                                            Again
                                        </Text>
                                        <Text style={styles.resendTimer}>
                                            Resend OTP in {timer} seconds
                                        </Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={handleResendOTP}
                                        disabled={loading}
                                    >
                                        <Text style={styles.resendNow}>
                                            Resend OTP
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
        flex: 1,
        backgroundColor: '#F3F4F6'
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
        fontWeight: 'bold',
        color: '#2563EB'
    },
    formWrapper: {
        flex: 1
    },
    instructionWrapper: {
        marginTop: hp('4%'),
        marginBottom: hp('8%')
    },
    instructionText: {
        fontSize: wp('4.5%'),
        color: '#374151'
    },
    emailText: {
        fontWeight: '600'
    },
    otpWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('3%')
    },
    otpInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: wp('2%'),
        padding: wp('3%'),
        textAlign: 'center',
        fontSize: wp('5%'),
        backgroundColor: '#FFFFFF',
        width: wp('12%')
    },
    submitButton: {
        borderRadius: wp('2%'),
        paddingVertical: hp('2%'),
        backgroundColor: '#2377ff',
        marginTop: hp('3%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    },
    submitText: {
        color: '#FFFFFF',
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
        color: '#4B5563',
        fontWeight: '600',
        textAlign: 'center'
    },
    resendTimer: {
        color: '#4B5563',
        textAlign: 'center'
    },
    resendNow: {
        color: '#2563EB',
        fontWeight: '600'
    }
});

export default OTPEntry;
