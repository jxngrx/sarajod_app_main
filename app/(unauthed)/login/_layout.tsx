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
import { useSession } from '@/contexts/AuthContext';

const Login = () => {
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '' });
    const { navigateTo } = useNavigation();
    const { colorId }: any = useContext(ColorContext);
    const { signIn } = useSession();
    const selectedColor =
        colorBg.find((color) => color.id === colorId)?.color || 'bg-blue-500';

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
            const response = await apiService.loginUser({
                email: userEmail
            });

            if (response.status === 200) {
                signIn(response.data?.token);
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
            setLoading(false);
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
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.flex1}>
                        <View style={styles.centeredTop}>
                            <View style={styles.absoluteTextWrapper}>
                                <Text style={styles.topText}>
                                    Sarajod Sa rajod Saraj od Sarajod Sarajod Sa
                                    rajod Saraj od Sarajod Sarajod Sa rajod
                                    Saraj
                                </Text>
                            </View>
                        </View>

                        <View style={styles.loginWrapper}>
                            <Text style={styles.loginTitle}>Login</Text>

                            <Text style={styles.emailLabel}>
                                Enter your email
                            </Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    errors.email
                                        ? styles.errorBorder
                                        : styles.defaultBorder
                                ]}
                                keyboardType="email-address"
                                value={userEmail}
                                onChangeText={(text) => setUserEmail(text)}
                                placeholder="your.email@example.com"
                                placeholderTextColor="gray"
                            />
                            {errors.email && (
                                <Text style={styles.errorText}>
                                    {errors.email}
                                </Text>
                            )}

                            <TouchableOpacity
                                onPress={handleLogin}
                                style={[styles.loginButton]}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size={'small'}
                                        color={'#ffffff'}
                                    />
                                ) : (
                                    <Text style={styles.loginButtonText}>
                                        Login
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
                                    <Text style={styles.registerPrompt}>
                                        Don't have an account?{' '}
                                    </Text>
                                    <Text style={styles.registerText}>
                                        Register
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
        top: -hp(6),
        fontWeight: '600',
        textAlign: 'center',
        fontSize: hp(11),
        color: '#E5E7EB'
    },
    loginWrapper: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        padding: wp(6),
        paddingBottom: hp(8),
        paddingTop: hp(4),
        borderTopLeftRadius: wp(10),
        borderTopRightRadius: wp(10),
        backgroundColor: 'white',
        marginTop: hp(8)
    },
    loginTitle: {
        position: 'absolute',
        top: -hp(10),
        left: wp(6),
        fontSize: hp(7),
        fontWeight: 'bold',
        color: '#1D4ED8'
    },
    emailLabel: {
        fontSize: hp(2.2),
        color: '#4B5563',
        marginBottom: hp(1)
    },
    textInput: {
        width: '100%',
        borderRadius: wp(4),
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        fontSize: hp(2),
        color: '#1F2937' // gray-800
        // marginBottom: hp(2)
    },
    errorBorder: {
        borderWidth: 1,
        borderColor: '#EF4444'
    },
    defaultBorder: {
        borderWidth: 1,
        borderColor: '#D1D5DB'
    },
    errorText: {
        color: '#EF4444',
        fontSize: hp(1.6),
        marginBottom: hp(1)
    },
    loginButton: {
        backgroundColor: '#2563EB',
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
        color: '#4B5563'
    },
    registerText: {
        color: '#2563EB',
        fontWeight: '600'
    }
});

export default Login;
