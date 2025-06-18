import React, { useState, useContext } from 'react';
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
    Alert,
    StyleSheet
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import apiService from '@/hooks/useApi';
import { useNavigation } from '@/hooks/useNavigation';
import { colorBg } from '@/components/StyleDetailsComponent';
import { ColorContext } from '@/contexts/ColorContext';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { StatusBar } from 'react-native';
import StatusBarColor from '@/components/StatusBarColor';

const MasterPassEntry = () => {
    const [masterPass, setMasterPass] = useState<string[]>(
        new Array(6).fill('')
    );
    const [loading, setLoading] = useState<boolean>(false);
    const { colorId }: any = useContext(ColorContext);
    const selectedColor =
        colorBg.find((color) => color.id === colorId)?.color || '#3B82F6';
    const { navigateTo } = useNavigation();
    const focusRef = React.useRef<(TextInput | null)[]>(
        new Array(6).fill(null)
    );

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

    const handleSubmit = () => {
        if (masterPass.join('') === '') {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Warning',
                textBody: 'Master password cannot be empty.',
                autoClose: 5000
            });
            return;
        }

        Alert.alert(
            'Are you sure?',
            `You are about to use this Master Password: ${masterPass.join('')}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const response =
                                await apiService.regitserMasterPass({
                                    masterPass: masterPass.join('')
                                });

                            if (response.status === 200) {
                                Toast.show({
                                    type: ALERT_TYPE.SUCCESS,
                                    title: 'Success',
                                    textBody:
                                        'Master Password set successfully.',
                                    autoClose: 5000
                                });
                                navigateTo({ pathname: 'HOME' });
                            } else {
                                throw new Error('Verification failed');
                            }
                        } catch (error: any) {
                            Toast.show({
                                type: ALERT_TYPE.WARNING,
                                title: 'Warning',
                                textBody:
                                    error?.response?.data?.message ||
                                    'Verification Error',
                                autoClose: 5000
                            });
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBarColor />
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardContainer}
                >
                    <View style={styles.innerContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.heading}>Final Step</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <View style={styles.descriptionContainer}>
                                <Text style={styles.descriptionText}>
                                    Please enter the 6-digit Master Password
                                </Text>
                            </View>
                            <View style={styles.inputGroup}>
                                {masterPass.map((_, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => {
                                            focusRef.current[index] = el;
                                        }}
                                        style={styles.otpInput}
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
                                    styles.submitButton,
                                    { backgroundColor: selectedColor }
                                ]}
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
                                    <Text style={styles.submitText}>
                                        Submit
                                    </Text>
                                )}
                            </TouchableOpacity>
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
        backgroundColor: '#f3f4f6'
    },
    keyboardContainer: {
        flex: 1
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: wp('6%')
    },
    titleContainer: {
        marginTop: hp('10%'),
        alignItems: 'flex-start'
    },
    heading: {
        fontSize: wp('10%'),
        fontWeight: 'bold',
        color: '#2563eb'
    },
    contentContainer: {
        flex: 1
    },
    descriptionContainer: {
        marginVertical: hp('4%'),
        marginBottom: hp('5%')
    },
    descriptionText: {
        fontSize: wp('4.5%'),
        color: '#374151'
    },
    inputGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('3%')
    },
    otpInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: wp('8%'),
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.5%'),
        textAlign: 'center',
        fontSize: wp('5%'),
        backgroundColor: '#fff',
        width: wp('12%')
    },
    submitButton: {
        borderRadius: wp('3%'),
        paddingVertical: hp('2%'),
        marginTop: hp('3%'),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3
    },
    submitText: {
        color: '#fff',
        fontSize: wp('4.5%'),
        fontWeight: '600',
        textAlign: 'center'
    }
});

export default MasterPassEntry;
