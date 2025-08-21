import React, { useState, forwardRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Dropdown } from 'react-native-element-dropdown';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import apiService from '@/hooks/useApi';
import { useAppDispatch } from '@/store/hooks';
import {
    fetchAllTransactions,
    fetchUserDetails
} from '@/store/slices/userSlice';
import { useTheme } from '@/contexts/ThemeProvider';

const CreateTransactionBottomSheet = forwardRef(
    (
        {
            sheetRef,
            onClose,
            profile,
            transactionCollection,
            transactionType,
            transactionToEdit
        }: any,
        ref
    ) => {
        const dispatch = useAppDispatch();
        const { theme } = useTheme();
        const [amount, setAmount] = useState('');
        const [type, setType] = useState('credit');
        const [description, setDescription] = useState('');
        const [products, setProducts] = useState([
            { productName: '', quantity: '' }
        ]);
        const [loading, setLoading] = useState(false);
        const today = new Date();
        const isEditing = !!transactionToEdit;

        const partnerName = transactionCollection?.transactionPartnerName || '';
        const partnerPhoneNumber =
            transactionCollection?.transactionPartnerPhoneNumber || 'Not Found';

        useEffect(() => {
            if (transactionType) setType(transactionType);

            if (isEditing && transactionToEdit) {
                setAmount(String(transactionToEdit.amount));
                setDescription(transactionToEdit.description || '');
                setType(transactionToEdit.type);
            }
        }, [transactionType, transactionToEdit]);

        const resetForm = () => {
            setAmount('');
            setType('credit');
            setDescription('');
            setProducts([{ productName: '', quantity: '' }]);
        };

        const handleSubmitTransaction = async () => {
            if (!amount || isNaN(Number(amount))) {
                return Alert.alert('Validation Error', 'Enter valid amount.');
            }

            try {
                setLoading(true);

                const payload = {
                    profileId: profile?._id,
                    transactionCollectionId:
                        profile?.transactionCollection?.[0]?._id,
                    transactionTableId: transactionCollection?._id,
                    partnerPhoneNumber: String(partnerPhoneNumber),
                    partnerName,
                    active: true,
                    amount: Number(amount),
                    type,
                    date: today.getDate(),
                    month: today.getMonth() + 1,
                    year: today.getFullYear(),
                    description,
                };

                let response;
                if (isEditing && transactionToEdit?._id) {
                    response = await apiService.updateTransaction(
                        transactionToEdit._id,
                        payload
                    );
                } else {
                    response = await apiService.createTransaction(payload);
                }

                if (response.status === 200 || response.status === 201) {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Success',
                        textBody: isEditing
                            ? 'Transaction updated!'
                            : response?.data?.message ?? 'Transaction added!'
                    });
                    await dispatch(fetchAllTransactions());
                    await dispatch(fetchUserDetails());
                    resetForm();
                    sheetRef.current?.close();
                }
            } catch (error: any) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    'Something went wrong';
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Error',
                    textBody: message
                });
            } finally {
                setLoading(false);
            }
        };

        return (
            <RBSheet
                ref={sheetRef}
                height={hp('75%')}
                openDuration={250}
                closeOnPressBack
                closeOnPressMask
                onClose={() => {
                    resetForm();
                    onClose?.();
                }}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: wp('5%'),
                        backgroundColor: theme.background
                    }
                }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[styles.title, { color: theme.text }]}>
                        {isEditing
                            ? 'Update Transaction'
                            : 'Create Transaction'}
                    </Text>

                    <Text style={[styles.label, { color: theme.text }]}>
                        Partner Name
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                color: theme.text,
                                borderColor: theme.border
                            }
                        ]}
                        value={partnerName}
                        editable={false}
                    />

                    <Text style={[styles.label, { color: theme.text }]}>
                        Partner Phone
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                color: theme.text,
                                borderColor: theme.border
                            }
                        ]}
                        value={String(partnerPhoneNumber || '')}
                        editable={false}
                    />

                    <Text style={[styles.label, { color: theme.text }]}>
                        Amount
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                color: theme.text,
                                borderColor: theme.border
                            }
                        ]}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        placeholder="000"
                        placeholderTextColor={theme.textSecondary}
                    />

                    <Text style={[styles.label, { color: theme.text }]}>
                        Type
                    </Text>
                    <Dropdown
                        style={[styles.dropdown, { borderColor: theme.border }]}
                        containerStyle={{
                            borderRadius: wp('2%'),
                            backgroundColor: theme.white
                        }}
                        placeholderStyle={{ color: theme.text }}
                        selectedTextStyle={{ color: theme.text }}
                        data={[
                            { label: 'YOU GOT', value: 'credit' },
                            { label: 'YOU GAVE', value: 'debit' }
                        ]}
                        labelField="label"
                        valueField="value"
                        placeholder="Select type"
                        value={type}
                        onChange={(item) => setType(item.value)}
                    />

                    <Text style={[styles.label, { color: theme.text }]}>
                        Description
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            { color: theme.text, borderColor: theme.border }
                        ]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Transaction description"
                        placeholderTextColor={theme.textSecondary}
                    />
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: theme.primary }
                        ]}
                        onPress={handleSubmitTransaction}
                        disabled={loading}
                    >
                        {loading ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ActivityIndicator size="small" color={theme.card} style={{ marginRight: 8 }} />
                                <Text style={[styles.buttonText, { color: theme.card }]}>
                                    {isEditing ? 'Updating...' : 'Creating...'}
                                </Text>
                            </View>
                        ) : (
                            <Text style={[styles.buttonText, { color: theme.card }]}>
                                {isEditing ? 'Update Transaction' : 'Create Transaction'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </RBSheet>
        );
    }
);

export default CreateTransactionBottomSheet;

const styles = StyleSheet.create({
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
        marginBottom: hp('1%')
    },
    dropdown: {
        height: hp('6%'),
        borderWidth: 1,
        borderRadius: wp('2%'),
        paddingHorizontal: wp('3%'),
        marginBottom: hp('1%')
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('2%')
    },
    addProductText: {
        fontSize: wp('4%')
    },
    removeProductText: {
        fontSize: wp('4%')
    },
    button: {
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        marginTop: hp('2%'),
        marginBottom: hp('3%')
    },
    buttonText: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold'
    }
});
