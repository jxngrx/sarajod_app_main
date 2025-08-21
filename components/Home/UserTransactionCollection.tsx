import { getInitials } from '@/utils/UsernameToIntialNaming';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import CreateTransactionBottomSheet from '../AuthedComponents/AddTransactions/UI/CreateTransaction';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/contexts/ThemeProvider';
import DeleteTransactionBottomSheet from '../AuthedComponents/AddTransactions/UI/DeleteTransaction';
import { convertToIndianNumbering } from '@/utils/ConvertToIndianNumbering';

export const UserTransactionCollection = ({
    refreshing,
    transactions,
    profile
}: any) => {
    const createTransaction = useRef<any>(null);
    const [transactionCollectionId, setTransactionCollectionId] = useState('');
    const { navigateTo } = useNavigation();
    const { theme } = useTheme();
    const deleteTransaction = useRef<any>(null);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const openDeleteSheet = (transaction?: any) => {
        if (transaction) setTransactionToDelete(transaction);
        deleteTransaction.current?.open();
    };

    return (
        <View style={[styles.container]}>
            {refreshing || !transactions ? (
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
                <FlatList
                    scrollEnabled={false}
                    data={transactions?.slice()?.sort((a: any, b: any) => {
                        const sortA = new Date(a.updatedAt).getTime();
                        const sortB = new Date(b.updatedAt).getTime();
                        return sortB - sortA;
                    })}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ gap: hp(2) }}
                    renderItem={({ item: transaction }) => (
                        <TouchableOpacity
                            onLongPress={() => openDeleteSheet(transaction)}
                            onPress={() => {
                                navigateTo({
                                    pathname: 'TRANSACTIONDETAIL',
                                    params: {
                                        data: JSON.stringify(transaction)
                                    }
                                });
                            }}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: theme.border,
                                    shadowColor: theme.shadow
                                }
                            ]}
                        >
                            {/* Avatar */}
                            <View style={styles.avatarContainer}>
                                <View
                                    style={[
                                        styles.avatar,
                                        { backgroundColor: theme.primary }
                                    ]}
                                >
                                    <Text style={styles.avatarText}>
                                        {getInitials(
                                            transaction?.transactionPartnerName ||
                                                'N/A'
                                        )}
                                    </Text>
                                </View>
                            </View>

                            {/* Details */}
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Text
                                        style={[
                                            styles.partnerName,
                                            { color: theme.text }
                                        ]}
                                    >
                                        {transaction?.transactionPartnerName}
                                    </Text>
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text
                                        style={[
                                            styles.phoneNumber,
                                            { color: theme.textSecondary }
                                        ]}
                                    >
                                        {
                                            transaction?.transactionPartnerPhoneNumber
                                        }
                                    </Text>
                                    <Text
                                        style={[
                                            styles.balanceAmount,
                                            transaction.totalBalance > 0
                                                ? { color: theme.success }
                                                : transaction.totalBalance < 0
                                                ? { color: theme.danger }
                                                : { color: theme.textMuted }
                                        ]}
                                    >
                                        ₹
                                        {convertToIndianNumbering(
                                            Math.abs(
                                                Number(transaction.totalBalance)
                                            )
                                        )}
                                    </Text>
                                </View>
                                <View style={styles.cardFooter}>
                                    <Text
                                        style={[
                                            styles.phoneNumber,
                                            { color: theme.textSecondary }
                                        ]}
                                    >
                                        No. of Transactions:{' '}
                                        <Text style={{ color: theme.text }}>
                                            {
                                                transaction
                                                    ?.transactionAmountDetailId
                                                    .length
                                            }
                                        </Text>
                                    </Text>
                                    <Text
                                        style={[
                                            styles.status,
                                            { color: theme.textSecondary }
                                        ]}
                                    >
                                        {transaction.totalBalance < 0
                                            ? 'In Expense'
                                            : transaction.totalBalance > 0
                                            ? 'In Profit'
                                            : 'No Dues'}
                                    </Text>
                                </View>
                            </View>

                            {/* Right Add Button */}
                            <TouchableOpacity
                                style={[
                                    styles.rightButtonWrapper,
                                    { backgroundColor: theme.surface }
                                ]}
                                onPress={() => {
                                    setTransactionCollectionId(
                                        transaction?._id
                                    );
                                    createTransaction.current?.open();
                                }}
                            >
                                <Ionicons
                                    name="add"
                                    size={26}
                                    color={theme.secondary}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            )}
            {createTransaction && Array.isArray(transactions) && (
                <CreateTransactionBottomSheet
                    sheetRef={createTransaction}
                    profile={profile}
                    transactionCollection={
                        transactions.find(
                            (item: any) => item._id === transactionCollectionId
                        ) || null
                    }
                />
            )}
            {deleteTransaction && (
                <DeleteTransactionBottomSheet
                    sheetRef={deleteTransaction}
                    profile={profile}
                    transactionCollectionToDelete={transactionToDelete}
                    onClose={() => setTransactionToDelete(null)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(4),
        paddingTop: hp(2)
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp(4),
        borderBottomWidth: 2,
        borderRadius: wp(3),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    avatarContainer: {
        marginRight: wp(3)
    },
    avatar: {
        height: wp(12),
        width: wp(12),
        borderRadius: wp(6),
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarText: {
        color: '#fff',
        fontSize: wp(5),
        fontWeight: '600'
    },
    cardContent: {
        flex: 1
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(0.5)
    },
    partnerName: {
        fontSize: wp(4.2),
        fontWeight: '600'
    },
    balanceAmount: {
        fontSize: wp(4),
        fontWeight: '600'
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    phoneNumber: {
        fontSize: wp(3.5)
    },
    status: {
        fontSize: wp(3.5)
    },
    rightButtonWrapper: {
        marginLeft: wp(2),
        padding: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp(3),
        borderWidth: 1,
        borderColor: '#3B82F6'
    },
    skeletonCard: {
        height: hp(10),
        borderRadius: wp(3),
        marginBottom: hp(2)
    }
});
