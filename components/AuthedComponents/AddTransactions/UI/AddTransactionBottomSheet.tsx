import React, { useState, forwardRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import apiService from '@/hooks/useApi';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useAppDispatch } from '@/store/hooks';
import { fetchAllTransactions } from '@/store/slices/userSlice';
import { useTheme } from '@/contexts/ThemeProvider';
import useTrans from '@/hooks/useLanguage'; // ✅ added

const AddTransactionBottomSheet = forwardRef(
    ({ addTransactionSheet, onClose, user, profile }: any, ref) => {
        const [partnerName, setPartnerName] = useState('');
        const [partnerPhoneNumber, setPartnerPhoneNumber] = useState('');
        const [partnerEmail, setPartnerEmail] = useState('');
        const [loading, setLoading] = useState(false);

        const dispatch = useAppDispatch();
        const { theme } = useTheme(); // ✅ dynamic theme
        const t = useTrans(); // ✅ translation hook

        const handleAddTransaction = async () => {
            if (!partnerName || !partnerPhoneNumber) {
                return Alert.alert(
                    t('validationError'),
                    t('requiredFieldsMissing')
                );
            }

            try {
                setLoading(true);

                const response = await apiService.startTransaction({
                    profileId: profile?._id,
                    transactionCollectionId:
                        profile?.transactionCollection[0]?._id,
                    partnerName,
                    partnerEmail,
                    partnerPhoneNumber,
                    active: true
                });

                if (response.status === 201) {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: t('success'),
                        textBody: t('transactionAdded')
                    });
                    await dispatch(fetchAllTransactions());
                    await addTransactionSheet.current?.close();
                }
            } catch (error: any) {
                console.error(error);
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    t('genericError');
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: t('error'),
                    textBody: message
                });
            } finally {
                setLoading(false);
                Keyboard.dismiss();
            }
        };

        return (
            <RBSheet
                ref={addTransactionSheet}
                height={hp('70%')}
                openDuration={250}
                closeOnPressMask
                closeOnPressBack
                onClose={onClose}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: wp('5%'),
                        backgroundColor: theme.surface // ✅ themed background
                    }
                }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View
                        style={[
                            styles.container,
                            { backgroundColor: theme.surface }
                        ]}
                    >
                        <Text style={[styles.title, { color: theme.text }]}>
                            {t('addTransaction')}
                        </Text>

                        <Text style={[styles.label, { color: theme.text }]}>
                            {t('partnerName')}{' '}
                            <Text style={{ color: theme.danger }}>*</Text>
                        </Text>
                        <TextInput
                            placeholder={t('enterPartnerName')}
                            value={partnerName}
                            onChangeText={setPartnerName}
                            placeholderTextColor={theme.textMuted}
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: theme.border,
                                    color: theme.text
                                }
                            ]}
                        />

                        <Text style={[styles.label, { color: theme.text }]}>
                            {t('partnerPhone')}{' '}
                            <Text style={{ color: theme.danger }}>*</Text>
                        </Text>
                        <TextInput
                            placeholder={t('enterPhoneNumber')}
                            value={partnerPhoneNumber}
                            onChangeText={setPartnerPhoneNumber}
                            keyboardType="phone-pad"
                            placeholderTextColor={theme.textMuted}
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: theme.border,
                                    color: theme.text
                                }
                            ]}
                        />

                        <Text style={[styles.label, { color: theme.text }]}>
                            {t('partnerEmail')}
                        </Text>
                        <TextInput
                            placeholder={t('enterEmail')}
                            value={partnerEmail}
                            onChangeText={setPartnerEmail}
                            keyboardType="email-address"
                            placeholderTextColor={theme.textMuted}
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: theme.border,
                                    color: theme.text
                                }
                            ]}
                        />

                        <TouchableOpacity
                            style={[
                                styles.button,
                                { backgroundColor: theme.primary }
                            ]}
                            onPress={handleAddTransaction}
                            disabled={loading}
                        >
                            {loading ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color={theme.white || '#fff'} style={{ marginRight: 8 }} />
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            { color: theme.white || '#fff' }
                                        ]}
                                    >
                                        {t('adding')}
                                    </Text>
                                </View>
                            ) : (
                                <Text
                                    style={[
                                        styles.buttonText,
                                        { color: theme.white || '#fff' }
                                    ]}
                                >
                                    {t('startTransaction')}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </RBSheet>
        );
    }
);

export default AddTransactionBottomSheet;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: wp('5.5%'),
        fontWeight: 'bold',
        marginBottom: hp('2%')
    },
    label: {
        fontSize: wp('4%'),
        marginTop: hp('1.5%'),
        marginBottom: hp('0.5%')
    },
    input: {
        borderWidth: 1,
        borderRadius: wp('2%'),
        padding: wp('3%'),
        fontSize: wp('4%'),
        marginBottom: hp('1.5%')
    },
    button: {
        paddingVertical: hp('1.8%'),
        borderRadius: wp('2%'),
        marginTop: hp('3%'),
        alignItems: 'center'
    },
    buttonText: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold'
    }
});
