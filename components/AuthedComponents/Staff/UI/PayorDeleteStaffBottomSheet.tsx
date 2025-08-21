import React, { forwardRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@/contexts/ThemeProvider';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import apiService from '@/hooks/useApi';
import { useAppDispatch } from '@/store/hooks';
import { fetchAllStaff } from '@/store/slices/userSlice';

const PayorDeleteStaffBottomSheet = forwardRef(
    ({ sheetRef, staffForAction }: any, ref) => {
        const { theme } = useTheme();
        const dispatch = useAppDispatch();
        const [loading, setLoading] = useState(false);

        const handleDelete = async () => {
            if (!staffForAction?._id) return;
            setLoading(true);
            try {
                const response = await apiService.deleteStaffMember(
                    staffForAction?._id
                );

                if (response.status === 200) {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Deleted',
                        textBody: 'Transaction deleted successfully!'
                    });

                    await dispatch(fetchAllStaff());
                    sheetRef.current?.close();
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

        const handlePayStaff = async () => {
            if (!staffForAction?._id) return;
            setLoading(true);
            const today = new Date();
            const paymentDate = `${today.getFullYear()}-${String(
                today.getMonth() + 1
            ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

            const payload = {
                staffMemberId: staffForAction?._id,
                profileId: staffForAction?.profileId,
                amount: staffForAction?.salary,
                paymentDate: paymentDate
            };
            try {
                const response = await apiService.payStaffMember(payload);

                if (response.status === 201) {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Success',
                        textBody: 'Staff Member Paid successfully!'
                    });

                    await dispatch(fetchAllStaff());
                    sheetRef.current?.close();
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
                        Staff Member Action?
                    </Text>
                    <View>
                        <TouchableOpacity
                            onPress={handlePayStaff}
                            style={[
                                styles.deleteButton,
                                { backgroundColor: theme.success }
                            ]}
                            disabled={loading}
                        >
                            {loading ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.deleteText}>Processing...</Text>
                                </View>
                            ) : (
                                <Text style={styles.deleteText}>
                                    PAY STAFF -{' '}
                                    {new Date().toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDelete}
                            style={[
                                styles.deleteButton,
                                { backgroundColor: theme.danger }
                            ]}
                            disabled={loading}
                        >
                            {loading ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.deleteText}>Processing...</Text>
                                </View>
                            ) : (
                                <Text style={styles.deleteText}>DELETE STAFF</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet>
        );
    }
);

export default PayorDeleteStaffBottomSheet;

const styles = StyleSheet.create({
    title: {
        fontSize: wp(4.5),
        textAlign: 'center',
        marginBottom: hp(3),
        fontWeight: '600'
    },
    deleteButton: {
        paddingVertical: hp(1.7),
        marginBottom: wp(5),
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
