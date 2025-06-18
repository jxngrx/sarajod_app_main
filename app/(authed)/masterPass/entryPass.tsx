import React, { useState, useContext, useEffect } from 'react';
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
    Alert
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRoute } from '@react-navigation/native';
import apiService from '@/hooks/useApi';
import { useNavigation } from '@/hooks/useNavigation';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { router } from 'expo-router';
import { StatusBar } from 'react-native';
import StatusBarColor from '@/components/StatusBarColor';

const MasterPassEntry = () => {
    const [masterPass, setMasterPass] = useState<string[]>(
        new Array(6).fill('')
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [biometricType, setBiometricType] = useState<string | null>(null);

    const route = useRoute();
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
            Alert.alert('Authentication Failed', 'Please try again.');
        }
    };

    const handleChange = (index: number, text: string) => {
        const updatedMasterPass = [...masterPass];
        updatedMasterPass[index] = text;

        if (text && index < updatedMasterPass.length - 1) {
            focusRef.current[index + 1]?.focus();
        } else if (!text && index > 0) {
            focusRef.current[index - 1]?.focus();
        }

        setMasterPass(updatedMasterPass);
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
            const masterPassCode = Number(masterPass.join(''));
            const response = await apiService.validateMasterPass({
                masterPass: masterPassCode
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
                throw new Error('Verification failed');
            }
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || 'Verification Error';
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
        <SafeAreaView className="flex-1 bg-gray-100">
            <StatusBarColor />
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="flex-1 px-6">
                        <View className="items-start mt-16">
                            <Text className="text-5xl font-bold text-blue-600">
                                Welcome Back
                            </Text>
                        </View>
                        <View className="flex-1">
                            <View className="my-8 mb-10">
                                <Text className="text-xl text-gray-700">
                                    Please enter the 6-digit Master Password
                                </Text>
                            </View>
                            <View className="flex-row justify-between mb-6">
                                {masterPass.map((_, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => {
                                            focusRef.current[index] = el;
                                        }}
                                        className="border border-gray-300 rounded-lg p-4 text-center text-xl bg-white w-14"
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
                                className={`bg-blue-500 rounded-lg py-3 mt-6 shadow-sm`}
                                disabled={
                                    loading || masterPass.join('').length < 6
                                }
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#ffffff"
                                    />
                                ) : (
                                    <Text className="text-white text-lg font-semibold text-center">
                                        Confirm
                                    </Text>
                                )}
                            </TouchableOpacity>

                            {biometricType && (
                                <TouchableOpacity
                                    onPress={handleBiometricAuth}
                                    className="bg-blue-500 rounded-lg py-3 mt-4 shadow-sm"
                                >
                                    <Text className="text-white text-lg font-semibold text-center">
                                        Use {biometricType}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                    onPress={()=>{
                                        navigateTo({
                                            pathname: "FORGETPASS"
                                        })
                                    }}
                                    className="rounded-lg py-3 mt-4 shadow-sm"
                                >
                                    <Text className="text-black underline text-lg font-semibold text-center">
                                        Forget password
                                    </Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default MasterPassEntry;
