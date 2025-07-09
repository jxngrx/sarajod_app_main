import React, { useState } from 'react';
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
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { StatusBar } from 'react-native';
import StatusBarColor from '@/components/StatusBarColor';
import { useTheme } from '@/contexts/ThemeProvider';
import useTrans from '@/hooks/useLanguage';

const MasterPassEntry = () => {
    const [masterPass, setMasterPass] = useState<string[]>(
        new Array(6).fill('')
    );
    const [loading, setLoading] = useState<boolean>(false);
    const { navigateTo } = useNavigation();
    const { theme } = useTheme();
    const t = useTrans();

    const focusRef = React.useRef<(TextInput | null)[]>(
        new Array(6).fill(null)
    );

    const handleChange = (index: number, text: string) => {
        const updated = [...masterPass];
        updated[index] = text;

        if (text && index < 5) focusRef.current[index + 1]?.focus();
        else if (!text && index > 0) focusRef.current[index - 1]?.focus();

        setMasterPass(updated);
    };

    const handleSubmit = () => {
        if (masterPass.join('') === '') {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Warning',
                textBody: t('master_empty_warning'),
                autoClose: 5000
            });
            return;
        }

        Alert.alert(
            t('master_confirm_title'),
            `${t('master_confirm_message')} ${masterPass.join('')}`,
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
                                    textBody: t('master_success'),
                                    autoClose: 5000
                                });
                                navigateTo({ pathname: 'HOME' });
                            } else throw new Error('Verification failed');
                        } catch (error: any) {
                            Toast.show({
                                type: ALERT_TYPE.WARNING,
                                title: 'Warning',
                                textBody: t('master_failure'),
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
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <StatusBarColor />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardContainer}
                >
                    <View style={styles.innerContainer}>
                        <View style={styles.titleContainer}>
                            <Text
                                style={[
                                    styles.heading,
                                    { color: theme.primary }
                                ]}
                            >
                                {t('master_heading')}
                            </Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <View style={styles.descriptionContainer}>
                                <Text
                                    style={[
                                        styles.descriptionText,
                                        { color: theme.textSecondary }
                                    ]}
                                >
                                    {t('master_description')}
                                </Text>
                            </View>
                            <View style={styles.inputGroup}>
                                {masterPass.map((_, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => {
                                            focusRef.current[index] = el;
                                        }}
                                        style={[
                                            styles.otpInput,
                                            {
                                                backgroundColor: theme.card,
                                                color: theme.text,
                                                borderColor: theme.border
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
                                    styles.submitButton,
                                    { backgroundColor: theme.primary }
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
                                        {t('master_submit')}
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
        flex: 1
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
        fontWeight: 'bold'
    },
    contentContainer: {
        flex: 1
    },
    descriptionContainer: {
        marginVertical: hp('4%'),
        marginBottom: hp('5%')
    },
    descriptionText: {
        fontSize: wp('4.5%')
    },
    inputGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('3%')
    },
    otpInput: {
        borderWidth: 1,
        borderRadius: wp('8%'),
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.5%'),
        textAlign: 'center',
        fontSize: wp('5%'),
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
