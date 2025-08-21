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
import { useTheme } from '@/contexts/ThemeProvider';
import { useSession } from '@/contexts/AuthContext';
import appLogo from '@/assets/SARAJOD-LOGO.png';
import apiService from '@/hooks/useApi';
import { useNavigation } from '@/hooks/useNavigation';
import useTrans from '@/hooks/useLanguage';

const Login = () => {
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '' });
    const t = useTrans();
    const { navigateTo } = useNavigation();
    const { signIn } = useSession();
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

    const handleLogin = async () => {
        if (!validateInputs()) return;

        try {
            setLoading(true);
            const response = await apiService.loginUser({ email: userEmail });

            if (response.status === 200) {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: response.data?.message,
                    autoClose: 3000
                });

                navigateTo({
                    pathname: 'OTP',
                    params: {
                        email: userEmail,
                        name: '',
                        phoneNumber: ''
                    }
                });
            }
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                'An unexpected error occurred.';
            if (errorMessage === 'User not found.') {
                navigateTo({
                    pathname: 'REGISTER'
                });
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Warning',
                    textBody: 'First create your account',
                    autoClose: 3000
                });
            } else {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Warning',
                    textBody: errorMessage,
                    autoClose: 3000
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, backgroundColor: theme.background }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ flex: 1 }}>
                        <View style={styles.centeredTop}>
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

                        <View
                            style={[
                                styles.loginWrapper,
                                { backgroundColor: theme.card }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.loginTitle,
                                    { color: theme.primary }
                                ]}
                            >
                                {t('login_title')}
                            </Text>

                            <Text
                                style={[
                                    styles.emailLabel,
                                    { color: theme.text }
                                ]}
                            >
                                {t('enter_email')}
                            </Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    {
                                        borderColor: errors.email
                                            ? theme.danger
                                            : theme.border,
                                        color: theme.text
                                    }
                                ]}
                                keyboardType="email-address"
                                value={userEmail}
                                onChangeText={setUserEmail}
                                placeholder="your.email@example.com"
                                placeholderTextColor={theme.textSecondary}
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

                            <TouchableOpacity
                                onPress={handleLogin}
                                style={[
                                    styles.loginButton,
                                    { backgroundColor: theme.primary }
                                ]}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={theme.card}
                                    />
                                ) : (
                                    <Text
                                        style={[
                                            styles.loginButtonText,
                                            { color: theme.card }
                                        ]}
                                    >
                                        {t('login_button')}
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <View style={styles.registerWrapper}>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigateTo({ pathname: 'REGISTER' })
                                    }
                                    style={styles.registerRow}
                                >
                                    <Text
                                        style={[
                                            styles.registerPrompt,
                                            { color: theme.text }
                                        ]}
                                    >
                                        {t('no_account')}{' '}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.registerText,
                                            { color: theme.primary }
                                        ]}
                                    >
                                        {t('register')}
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
    centeredTop: {
        alignItems: 'center',
        marginTop: hp(8)
    },
    absoluteTextWrapper: {
        position: 'absolute',
        width: wp(100),
        alignItems: 'center'
    },
    topText: {
        width: '100%',
        left: 0,
        top: -hp(6),
        fontWeight: '600',
        textAlign: 'center',
        fontSize: hp(11)
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
        marginBottom: wp(4),
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
        fontSize: hp(2.2),
        fontWeight: '600',
        textAlign: 'center'
    },
    registerWrapper: {
        alignItems: 'center'
    },
    registerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(1)
    },
    registerPrompt: {
        fontSize: hp(1.8)
    },
    registerText: {
        fontWeight: '600',
        fontSize: hp(1.8)
    }
});

export default Login;
