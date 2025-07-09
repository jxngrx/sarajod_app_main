import { useLocalSearchParams } from 'expo-router';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    RefreshControl
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { useNavigation } from '@/hooks/useNavigation';
import { getInitials } from '@/utils/UsernameToIntialNaming';
import { useTheme } from '@/contexts/ThemeProvider';
import CreateTransactionBottomSheet from '@/components/AuthedComponents/AddTransactions/UI/CreateTransaction';
import {
    fetchAllTransactions,
    fetchUserDetails,
    selectCurrentProfile,
    selectTransactions
} from '@/store/slices/userSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/hooks';
import DeleteTransactionBottomSheet from '@/components/AuthedComponents/AddTransactions/UI/DeleteTransaction';

const TransactionDetailScreen = () => {
    const { data } = useLocalSearchParams();
    const [refreshing, setRefreshing] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const transactions = useSelector(selectTransactions);
    const profile = useSelector(selectCurrentProfile);
    const transaction = JSON.parse(data as string);
    const { navigateTo } = useNavigation();
    const [paymentType, setPaymentType] = useState(false);
    const createTransaction = useRef<any>(null);
    const deleteTransaction = useRef<any>(null);
    const { theme } = useTheme();
    const [transactionType, setTransactionType] = useState('credit');
    const dispatch = useAppDispatch();
    const transactionAmountDetails = transactions?.data
        ?.filter(
            (transactionFilterItem) =>
                transactionFilterItem?._id === transaction?._id
        )
        .map((item) => item?.transactionAmountDetailId)
        ?.flat()
        ?.sort((a: any, b: any) => {
            const dateB: any = new Date(b.createdAt);
            const dateA: any = new Date(a.createdAt);
            return dateB - dateA;
        });

    const openSheet = (type: string, transaction?: any) => {
        if (!paymentType) {
            setTransactionType(type);
            if (transaction) setTransactionToEdit(transaction);
            createTransaction.current?.open();
        }
    };

    const openDeleteSheet = (transaction?: any) => {
        if (transaction) setTransactionToDelete(transaction);
        deleteTransaction.current?.open();
    };

    const getMonthName = (monthNumber: number) => {
        const months = [
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MAY',
            'JUN',
            'JUL',
            'AUG',
            'SEP',
            'OCT',
            'NOV',
            'DEC'
        ];
        return months[monthNumber - 1] || '';
    };

    const onRefreshing = useCallback(async () => {
        setRefreshing(true);
        console.log(
            transactions?.data?.map(
                (transaction) => transaction?.transactionAmountDetailId
            ),
            'TRANSACTION DATA'
        );

        await dispatch(fetchUserDetails());
        await dispatch(fetchAllTransactions());
        const isSalary = await transactionAmountDetails?.every(
            (item) => item.type === 'salary'
        );
        setPaymentType(isSalary);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        onRefreshing();
    }, []);

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            onPress={() => openSheet(item.type, item)}
            onLongPress={() => openDeleteSheet(item)}
            style={[styles.transactionRow, { backgroundColor: theme.card }]}
        >
            <View style={[styles.dateBox, { backgroundColor: theme.primary }]}>
                <Text style={styles.dateDay}>{item.date}</Text>
                <Text style={styles.dateMonth}>{getMonthName(item.month)}</Text>
            </View>

            <View style={styles.middleSection}>
                <Text style={[styles.transactionDesc, { color: theme.text }]}>
                    {item.description}
                </Text>
                {/* <Text style={[styles.transactionType, { color: theme.textMuted }]}>{item.type.toUpperCase()}</Text> */}
                {item.productDetails?.length > 0 &&
                    item.productDetails.map((product: any, index: number) => (
                        <Text
                            key={index}
                            style={[
                                styles.productItem,
                                { color: theme.textMuted }
                            ]}
                        >
                            • {product.productName}
                        </Text>
                    ))}
                {item.productDetails?.length > 0 &&
                    item.productDetails.map((product: any, index: number) => (
                        <Text
                            key={index}
                            style={[
                                styles.balanceTag,
                                {
                                    backgroundColor: theme.background,
                                    color: theme.textThirdForGreen
                                }
                            ]}
                        >
                            Quantity: {product.quantity || '0'}
                        </Text>
                    ))}
            </View>

            <View
                style={[
                    styles.amountSection,
                    {
                        justifyContent: `${
                            item.type === 'credit' ? 'flex-start' : 'flex-end'
                        }`
                    }
                ]}
            >
                <Text
                    style={[
                        styles.amount,
                        {
                            color:
                                item.type === 'credit'
                                    ? '#3CB371'
                                    : theme.success
                        }
                    ]}
                >
                    {item.type === 'credit' ? `₹ ${item.amount}` : ''}
                </Text>
                <Text
                    style={[
                        styles.amount,
                        {
                            color:
                                item.type === 'debit' ? '#E53935' : theme.danger
                        }
                    ]}
                >
                    {item.type === 'debit' || item.type === 'salary'
                        ? `₹ ${item.amount}`
                        : ''}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (!transaction) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: theme.background,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                ]}
            >
                <Text style={{ color: theme.text }}>No transaction found.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <View
                style={[
                    styles.headerCard,
                    {
                        backgroundColor: theme.card,
                        borderColor: theme.divider
                    }
                ]}
            >
                <View style={styles.partnerRow}>
                    <View
                        style={[
                            styles.initialsCircle,
                            { backgroundColor: theme.primary }
                        ]}
                    >
                        <Text style={styles.initialsText}>
                            {getInitials(transaction.transactionPartnerName)}
                        </Text>
                    </View>
                    <View>
                        <Text
                            style={[styles.partnerName, { color: theme.text }]}
                        >
                            {transaction.transactionPartnerName}
                        </Text>
                        <Text
                            style={[
                                styles.partnerPhone,
                                { color: theme.textMuted }
                            ]}
                        >
                            +91 {transaction.transactionPartnerPhoneNumber}
                        </Text>
                    </View>
                </View>

                <View style={styles.balanceRow}>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={[styles.label, { color: theme.textMuted }]}
                        >
                            BALANCE
                        </Text>
                        <Text
                            style={[styles.amountHeader, { color: theme.text }]}
                        >
                            ₹ {transaction.totalBalance}
                        </Text>
                    </View>

                    <View style={styles.sideAmountRow}>
                        <View style={styles.sideItem}>
                            <Text
                                style={[
                                    styles.label,
                                    { color: theme.textMuted }
                                ]}
                            >
                                CREDIT
                            </Text>
                            <Text
                                style={[
                                    styles.amountHeader,
                                    { color: '#3CB371' }
                                ]}
                            >
                                ₹ {transaction.totalCredit}
                            </Text>
                        </View>
                        <View style={styles.sideItem}>
                            <Text
                                style={[
                                    styles.label,
                                    { color: theme.textMuted }
                                ]}
                            >
                                DEBIT
                            </Text>
                            <Text
                                style={[
                                    styles.amountHeader,
                                    { color: '#E53935' }
                                ]}
                            >
                                ₹ {Math.abs(transaction.totalDebit)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            {transaction?.transactionAmountDetailId?.length !== 0 ? (
                refreshing || !transactions ? (
                    Array.from({ length: 10 }).map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.skeletonCard,
                                { backgroundColor: theme.skeleton }
                            ]}
                        />
                    ))
                ) : (
                    <ScrollView
                        style={styles.container}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefreshing}
                                colors={[theme.primary]}
                                tintColor={theme.primary}
                            />
                        }
                    >
                        <FlatList
                            data={transactionAmountDetails}
                            keyExtractor={(item) => item._id}
                            renderItem={renderItem}
                            scrollEnabled={false}
                            contentContainerStyle={{ paddingBottom: hp(5) }}
                        />
                        <Text
                            style={{
                                width: wp('100%'),
                                color: theme.text,
                                fontWeight: 'bold',
                                fontSize: wp(5),
                                justifyContent: 'center',
                                textAlign: 'center'
                            }}
                        >
                            No More Transaction Here
                        </Text>
                    </ScrollView>
                )
            ) : (
                <View
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.background,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    ]}
                >
                    <Text style={{ color: theme.text }}>
                        No transaction found.
                    </Text>
                </View>
            )}
            {!paymentType && (
                <View
                    style={[
                        styles.buttonRow,
                        { backgroundColor: theme.background }
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => openSheet('debit')}
                        style={styles.debitButton}
                    >
                        <Text style={styles.buttonText}>YOU GAVE ₹</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => openSheet('credit')}
                        style={styles.creditButton}
                    >
                        <Text style={styles.buttonText}>YOU GOT ₹</Text>
                    </TouchableOpacity>
                </View>
            )}
            {createTransaction && Array.isArray(transactions?.data) && (
                <CreateTransactionBottomSheet
                    sheetRef={createTransaction}
                    profile={profile}
                    transactionCollection={
                        transactions?.data.find(
                            (item: any) => item._id === transaction._id
                        ) || null
                    }
                    transactionType={transactionType}
                    transactionToEdit={transactionToEdit}
                    onClose={() => setTransactionToEdit(null)}
                />
            )}
            {deleteTransaction && (
                <DeleteTransactionBottomSheet
                    sheetRef={deleteTransaction}
                    profile={profile}
                    transactionToDelete={transactionToDelete}
                    onClose={() => setTransactionToDelete(null)}
                />
            )}
        </SafeAreaView>
    );
};

export default TransactionDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerCard: {
        marginHorizontal: wp(5),
        padding: wp(5),
        marginVertical: hp(2),
        borderRadius: wp(4)
    },
    partnerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(2)
    },
    initialsCircle: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(6),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(4)
    },
    initialsText: {
        color: '#fff',
        fontSize: wp(5),
        fontWeight: 'bold'
    },
    partnerName: {
        fontSize: wp(4.8),
        fontWeight: '600'
    },
    partnerPhone: {
        fontSize: wp(3.8),
        marginTop: hp(0.5)
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    label: {
        fontSize: wp(3.2),
        fontWeight: '500'
    },
    amountHeader: {
        fontSize: wp(4.8),
        fontWeight: 'bold',
        marginTop: hp(0.3)
    },
    sideAmountRow: {
        flexDirection: 'row',
        gap: wp(6)
    },
    sideItem: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    transactionRow: {
        flexDirection: 'row',
        marginHorizontal: wp(5),
        marginBottom: hp(1.5),
        padding: wp(4),
        borderRadius: wp(2),
        elevation: 1
    },
    dateBox: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(3)
    },
    dateDay: {
        fontSize: wp(4.5),
        color: '#fff',
        fontWeight: 'bold'
    },
    dateMonth: {
        fontSize: wp(3.2),
        color: '#fff'
    },
    middleSection: {
        flex: 1
    },
    transactionDesc: {
        fontSize: wp(4),
        fontWeight: '500'
    },
    transactionType: {
        fontSize: wp(3.3),
        marginVertical: hp(0.5)
    },
    productItem: {
        fontSize: wp(3.2)
    },
    balanceTag: {
        fontSize: wp(3.5),
        paddingHorizontal: wp(2),
        paddingVertical: hp(0.3),
        borderRadius: wp(1.5),
        alignSelf: 'flex-start',
        marginTop: hp(0.5)
    },
    amountSection: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: wp(2),
        marginLeft: wp(2),
        minWidth: wp(35)
    },
    amount: {
        fontSize: wp(4),
        fontWeight: 'bold'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: wp(5)
    },
    debitButton: {
        backgroundColor: '#E53935',
        flex: 1,
        marginRight: wp(2.5),
        paddingVertical: hp(1.5),
        borderRadius: wp(2),
        alignItems: 'center'
    },
    creditButton: {
        backgroundColor: '#3CB371',
        flex: 1,
        marginLeft: wp(2.5),
        paddingVertical: hp(1.5),
        borderRadius: wp(2),
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: wp(4)
    },
    skeletonCard: {
        height: hp(10),
        borderRadius: wp(3),
        marginBottom: hp(2),
        marginHorizontal: wp(5)
    }
});
