import React, { useState } from 'react';
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
    StyleSheet,
    Image
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useNavigation } from '@/hooks/useNavigation';
import apiService from '@/hooks/useApi';
import appLogo from '@/assets/SARAJOD-LOGO.png';
import { useTheme } from '@/contexts/ThemeProvider';
import useTrans from '@/hooks/useLanguage';

const Register = () => {
    const { navigateTo } = useNavigation();
    const t = useTrans();
    const { theme } = useTheme();
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorDupli, setErrorDupli] = useState('');
    const [errors, setErrors] = useState<any>({
        name: '',
        phoneNumber: '',
        email: ''
    });

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
            newErrors.phoneNumber = 'Enter a valid 10-digit phone number.';
            isValid = false;
        }

        if (!validateEmail(userEmail)) {
            newErrors.email = 'Enter a valid email address.';
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
                    autoClose: 3000
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
                        style={{ flex: 1, backgroundColor: theme.background }}
                    >
                        <View style={styles.headerContainer}>
                            <Image
                                source={appLogo}
                                height={200}
                                width={200}
                                style={{
                                    height: hp('30%'),
                                    width: wp('80%'),
                                    resizeMode: 'contain'
                                }}
                            />
                        </View>

                        {errorDupli && (
                            <Text
                                style={[
                                    styles.duplicateError,
                                    { color: theme.danger }
                                ]}
                            >
                                {errorDupli}
                            </Text>
                        )}

                        <View
                            style={[
                                styles.formContainer,
                                { backgroundColor: theme.surface }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.registerTitle,
                                    { color: theme.primary }
                                ]}
                            >
                                {t('register_title')}
                            </Text>

                            {[
                                {
                                    label: t('enter_name'),
                                    value: userName,
                                    setter: setUserName,
                                    key: 'name',
                                    placeholder: 'Sarajod',
                                    keyboard: 'default'
                                },
                                {
                                    label: t('enter_phone'),
                                    value: userPhoneNumber,
                                    setter: setUserPhoneNumber,
                                    key: 'phoneNumber',
                                    placeholder: '9999999999',
                                    keyboard: 'numeric'
                                },
                                {
                                    label: t('enter_email'),
                                    value: userEmail,
                                    setter: setUserEmail,
                                    key: 'email',
                                    placeholder: 'your.email@example.com',
                                    keyboard: 'email-address'
                                }
                            ].map((field, index) => (
                                <View key={index}>
                                    <Text
                                        style={[
                                            styles.labelText,
                                            { color: theme.text }
                                        ]}
                                    >
                                        {field.label}
                                    </Text>
                                    <TextInput
                                        style={[
                                            styles.textInput,
                                            {
                                                color: theme.text,
                                                borderColor: errors[field.key]
                                                    ? theme.danger
                                                    : theme.border
                                            }
                                        ]}
                                        placeholder={field.placeholder}
                                        placeholderTextColor={theme.textMuted}
                                        value={field.value}
                                        keyboardType={
                                            field.label === 'phone number'
                                                ? 'numeric'
                                                : field.label ===
                                                  'email address'
                                                ? 'email-address'
                                                : 'default'
                                        }
                                        onChangeText={field.setter}
                                    />
                                    {errors[field.key] && (
                                        <Text
                                            style={[
                                                styles.errorText,
                                                { color: theme.danger }
                                            ]}
                                        >
                                            {errors[field.key]}
                                        </Text>
                                    )}
                                </View>
                            ))}

                            <TouchableOpacity
                                onPress={handleNavigateToOTP}
                                style={[
                                    styles.otpButton,
                                    { backgroundColor: theme.primary }
                                ]}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#ffffff"
                                    />
                                ) : (
                                    <Text style={styles.otpButtonText}>
                                        {t('send_otp')}
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
                                    <Text
                                        style={[
                                            styles.loginText,
                                            { color: theme.textSecondary }
                                        ]}
                                    >
                                        {t('already_have_account')}{' '}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.loginTextBold,
                                            { color: theme.primary }
                                        ]}
                                    >
                                        {t('login')}
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
    headerContainer: {
        alignItems: 'center',
        marginTop: hp(4)
    },
    bigText: {
        fontSize: hp(11),
        fontWeight: '600',
        textAlign: 'center'
    },
    duplicateError: {
        fontWeight: '600',
        textAlign: 'center',
        marginTop: hp(2)
    },
    formContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopLeftRadius: wp(10),
        borderTopRightRadius: wp(10),
        padding: wp(6),
        paddingBottom: hp(8)
    },
    registerTitle: {
        marginBottom: wp(3),
        fontSize: hp(6.5),
        fontWeight: 'bold'
    },
    labelText: {
        fontSize: hp(2),
        marginBottom: hp(0.8)
    },
    textInput: {
        width: '100%',
        borderWidth: 1,
        borderRadius: wp(4),
        paddingHorizontal: wp(5),
        paddingVertical: hp(1.8),
        fontSize: hp(2.2),
        marginBottom: hp(1)
    },
    errorText: {
        fontSize: hp(1.6),
        marginBottom: hp(1)
    },
    otpButton: {
        borderRadius: wp(3),
        paddingVertical: hp(2),
        marginTop: hp(2)
    },
    otpButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: hp(2.2)
    },
    loginContainer: {
        alignItems: 'center'
    },
    loginTextWrapper: {
        flexDirection: 'row',
        marginTop: hp(1.5)
    },
    loginText: {
        fontSize: hp(1.8)
    },
    loginTextBold: {
        fontWeight: '600',
        fontSize: hp(1.8)
    }
});

export default Register;
