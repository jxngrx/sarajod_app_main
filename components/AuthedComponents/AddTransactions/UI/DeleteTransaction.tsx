import React, { forwardRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@/contexts/ThemeProvider';
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

const DeleteTransactionBottomSheet = forwardRef(
    (
        {
            sheetRef,
            transactionToDelete,
            onClose,
            profile,
            transactionCollectionToDelete
        }: any,
        ref
    ) => {
        const { theme } = useTheme();
        const dispatch = useAppDispatch();
        const [loading, setLoading] = useState(false);
        const handleDelete = async () => {
            if (
                (transactionToDelete && !transactionToDelete?._id) ||
                !transactionCollectionToDelete?._id
            ) {
                console.log(
                    (transactionToDelete && !transactionToDelete?._id) ||
                        !transactionCollectionToDelete?._id
                        ? true
                        : false,
                    'KONI KATU'
                );
                return;
            }
            setLoading(true);
            try {
                let status: number = 0;
                let response;
                if (transactionToDelete && transactionToDelete?._id) {
                    response = await apiService.deleteTransaction(
                        transactionToDelete._id,
                        profile?._id
                    );
                    status = response.status;
                } else if (transactionCollectionToDelete) {
                    response = await apiService.deleteTransactionTable(
                        transactionCollectionToDelete._id,
                        profile?._id
                    );
                    status = response.status;
                }

                if (status === 200 || status === 201) {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Deleted',
                        textBody: response?.data?.message
                    });

                    await dispatch(fetchUserDetails());
                    await dispatch(fetchAllTransactions());
                    sheetRef.current?.close();
                    onClose?.();
                }
            } catch (error: any) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    'Failed to delete transaction';
                Toast.show({
                    type: ALERT_TYPE.DANGER,
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
                height={hp(30)}
                openDuration={250}
                closeOnPressBack
                closeOnPressMask
                onClose={onClose}
                customStyles={{
                    container: {
                        borderTopLeftRadius: wp(5),
                        borderTopRightRadius: wp(5),
                        backgroundColor: theme.background,
                        padding: wp(5)
                    }
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1
                    }}
                >
                    <Text style={[styles.title, { color: theme.text }]}>
                        Are you sure you want to delete this transaction?
                    </Text>

                    <TouchableOpacity
                        onPress={handleDelete}
                        style={[
                            styles.deleteButton,
                            { backgroundColor: theme.danger }
                        ]}
                    >
                        {loading ? (
                            <ActivityIndicator size={20} color={'white'} />
                        ) : (
                            <Text style={styles.deleteText}>
                                DELETE TRANSACTION
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </RBSheet>
        );
    }
);

export default DeleteTransactionBottomSheet;

const styles = StyleSheet.create({
    title: {
        fontSize: wp(4.5),
        textAlign: 'center',
        marginBottom: hp(3),
        fontWeight: '600'
    },
    deleteButton: {
        paddingVertical: hp(1.7),
        paddingHorizontal: wp(10),
        borderRadius: wp(3),
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteText: {
        color: '#fff',
        fontSize: wp(4.2),
        fontWeight: 'bold'
    }
});
