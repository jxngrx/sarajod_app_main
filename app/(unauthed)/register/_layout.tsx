import { colorBg } from '@/components/StyleDetailsComponent';
import { ColorContext } from '@/contexts/ColorContext';
import apiService from '@/hooks/useApi';
import { useNavigation } from '@/hooks/useNavigation';
import React, { useContext, useState } from 'react';
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

const Register = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        phoneNumber: '',
        email: ''
    });
    const [errorDupli, setErrorDupli] = useState('');
    const { navigateTo } = useNavigation();
    const { colorId }: any = useContext(ColorContext);

    const selectedColor =
        colorBg.find((color) => color.id === colorId)?.color || 'bg-blue-500';

    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhoneNumber = (phoneNumber: string) =>
        /^\d{10}$/.test(phoneNumber);

    const validateInputs = () => {
        let isValid = true;
        const newErrors = { name: '', phoneNumber: '', email: '' };

        if (!userName.trim()) {
            newErrors.name = 'Name is required.';
            isValid = false;
        }

        if (!validatePhoneNumber(userPhoneNumber)) {
            newErrors.phoneNumber =
                'Please enter a valid 10-digit phone number.';
            isValid = false;
        }

        if (!validateEmail(userEmail)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNavigateToOTP = async () => {
        if (!validateInputs()) return;

        try {
            setLoading(true);
            const response = await apiService.registerUser({
                email: userEmail,
                name: userName,
                phoneNumber: userPhoneNumber
            });

            if (response.status === 200) {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: response.data.message,
                    autoClose: 5000
                });
                navigateTo({
                    pathname: 'OTP',
                    params: {
                        email: userEmail,
                        name: userName,
                        phoneNumber: userPhoneNumber
                    }
                });
            }
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                'An unexpected error occurred.';
            setErrorDupli(errorMessage);
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

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.flexGrow}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.flex}>
                        <View style={styles.headerContainer}>
                            <View style={styles.absoluteHeaderWrapper}>
                                <Text style={styles.bigText}>
                                    Sarajod Sa rajod Saraj od Sarajod Sarajod Sa
                                    rajod Saraj od Sarajod Sarajod Sa rajod
                                    Saraj
                                </Text>
                            </View>
                        </View>

                        {errorDupli ? (
                            <Text style={styles.duplicateError}>
                                {errorDupli}
                            </Text>
                        ) : null}

                        <View style={styles.formContainer}>
                            <Text style={styles.registerTitle}>Register</Text>

                            {['Name', 'phone number', 'email address'].map(
                                (label, index) => {
                                    const key =
                                        label === 'Name'
                                            ? 'name'
                                            : label === 'phone number'
                                            ? 'phoneNumber'
                                            : 'email';
                                    return (
                                        <View key={index}>
                                            <Text style={styles.labelText}>
                                                Enter your {label}
                                            </Text>
                                            <TextInput
                                                style={[
                                                    styles.textInput,
                                                    errors[key] &&
                                                        styles.inputError
                                                ]}
                                                keyboardType={
                                                    label === 'phone number'
                                                        ? 'numeric'
                                                        : label ===
                                                          'email address'
                                                        ? 'email-address'
                                                        : 'default'
                                                }
                                                value={
                                                    label === 'Name'
                                                        ? userName
                                                        : label ===
                                                          'phone number'
                                                        ? userPhoneNumber
                                                        : userEmail
                                                }
                                                onChangeText={(text) => {
                                                    if (label === 'Name')
                                                        setUserName(text);
                                                    else if (
                                                        label === 'phone number'
                                                    )
                                                        setUserPhoneNumber(
                                                            text
                                                        );
                                                    else setUserEmail(text);
                                                }}
                                                placeholder={
                                                    label === 'Name'
                                                        ? 'Sarajod'
                                                        : label ===
                                                          'phone number'
                                                        ? '9999999999'
                                                        : 'your.email@example.com'
                                                }
                                                placeholderTextColor="gray"
                                            />
                                            {errors[key] && (
                                                <Text style={styles.errorText}>
                                                    {errors[key]}
                                                </Text>
                                            )}
                                        </View>
                                    );
                                }
                            )}

                            <TouchableOpacity
                                onPress={handleNavigateToOTP}
                                style={[
                                    styles.otpButton,
                                    styles['bg-blue-500']
                                ]}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size={'small'}
                                        color={'#ffffff'}
                                    />
                                ) : (
                                    <Text style={styles.otpButtonText}>
                                        Send OTP
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <View style={styles.loginContainer}>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigateTo({ pathname: 'LOGIN' })
                                    }
                                    style={styles.loginTextWrapper}
                                >
                                    <Text style={styles.loginText}>
                                        Already have an account?{' '}
                                    </Text>
                                    <Text style={styles.loginTextBold}>
                                        Login
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    flexGrow: {
        flexGrow: 1
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: hp('4%')
    },
    absoluteHeaderWrapper: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        padding: 0
    },
    bigText: {
        width: '100%',
        left: 0,
        top: -hp('6%'),
        fontWeight: '600',
        textAlign: 'center',
        fontSize: hp('11%'),
        color: '#e5e7eb'
    },
    duplicateError: {
        color: '#f43f5e',
        fontWeight: '600',
        marginTop: hp('2%'),
        textAlign: 'center'
    },
    formContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        flex: 1,
        justifyContent: 'center',
        padding: wp('6%'),
        paddingBottom: hp('8%'),
        paddingTop: hp('5%'),
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        backgroundColor: 'white'
    },
    registerTitle: {
        position: 'absolute',
        top: -hp('7.5%'),
        left: wp(5),
        fontSize: hp('7%'),
        fontWeight: 'bold',
        color: '#1d4ed8'
    },
    labelText: {
        fontSize: hp('2.2%'),
        color: '#4b5563',
        marginBottom: hp('0.5%')
    },
    textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: wp('4%'),
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2%'),
        fontSize: hp('2.2%'),
        color: '#1f2937',
        marginBottom: hp('1.5%')
    },
    inputError: {
        borderColor: '#ef4444'
    },
    errorText: {
        color: '#ef4444',
        fontSize: hp('1.6%'),
        marginBottom: hp('1.2%')
    },
    otpButton: {
        borderRadius: wp('2%'),
        paddingVertical: hp('1.6%'),
        marginBottom: hp('2%'),
        shadowColor: '#000'
    },
    otpButtonText: {
        color: 'white',
        fontSize: hp('2.2%'),
        fontWeight: '600',
        textAlign: 'center'
    },
    loginContainer: {
        alignItems: 'center'
    },
    loginTextWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1%')
    },
    loginText: {
        color: '#4b5563'
    },
    loginTextBold: {
        color: '#2563eb',
        fontWeight: '600'
    },
    'bg-blue-500': {
        backgroundColor: '#3b82f6'
    },
    'bg-red-500': {
        backgroundColor: '#ef4444'
    },
    'bg-green-500': {
        backgroundColor: '#10b981'
    }
});

export default Register;
