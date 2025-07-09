import React, { useRef, useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { useTheme } from '@/contexts/ThemeProvider';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import AddStaffBottomSheet from './UI/AddStaffBottomSheet';
import { useSelector } from 'react-redux';
import {
    fetchAllStaff,
    selectCurrentProfile,
    selectStaff
} from '@/store/slices/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { useFocusEffect } from 'expo-router';
import PayorDeleteStaffBottomSheet from './UI/PayorDeleteStaffBottomSheet';

const StaffComponentMain = () => {
    const { theme } = useTheme();

    const [staffForAction, setStaffForAction] = useState(null);
    const addStaffRef = useRef<any>(null);
    const PayorDeleteStaffRef = useRef<any>(null);
    const dispatch = useAppDispatch();
    const profile = useSelector(selectCurrentProfile);
    const staffData = useSelector(selectStaff);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (profile?._id) {
                console.log(profile?._id);
                dispatch(fetchAllStaff());
            }
        }, [dispatch, profile?._id])
    );

    const handleOpenSheet = useCallback(() => {
        addStaffRef.current?.open();
    }, []);

    const handleDeleteStaff = (staff: any) => {
        if (staff) setStaffForAction(staff);
        PayorDeleteStaffRef.current?.open();
    };

    const handleRefresh = useCallback(async () => {
        if (!profile?._id) return;
        setRefreshing(true);
        try {
            await dispatch(fetchAllStaff());
        } catch (err) {
            console.log('Refresh error:', err);
        } finally {
            setRefreshing(false);
            console.log('FETCHED STAFF');
        }
    }, [dispatch, profile?._id]);

    const renderItem = useCallback(
        ({ item }: { item: any }) => (
            <TouchableOpacity
                style={[
                    styles.card,
                    {
                        backgroundColor: theme.card,
                        borderColor: theme.divider
                    }
                ]}
                onPress={() => handleDeleteStaff(item)}
            >
                <View style={styles.rowBetween}>
                    <Text style={[styles.name, { color: theme.text }]}>
                        {item.name}
                    </Text>
                    <Text
                        style={[
                            styles.statusBadge,
                            {
                                backgroundColor: item.isActive
                                    ? '#3CB371'
                                    : '#E53935',
                                color: '#fff'
                            }
                        ]}
                    >
                        {item.isActive ? 'Active' : 'Inactive'}
                    </Text>
                </View>
                <View style={[styles.rowBetween, { paddingTop: wp(2) }]}>
                    <Text style={[styles.role, { color: theme.textMuted }]}>
                        {item.role}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: wp(2)
                        }}
                    >
                        {(() => {
                            const latestSalary = item?.salaryHistory?.sort(
                                (a: any, b: any) =>
                                    new Date(b.updatedAt).getTime() -
                                    new Date(a.updatedAt).getTime()
                            )[0];
                            if (!latestSalary?.paymentDate) return 'No Payment';
                            const paymentDate = new Date(
                                latestSalary?.paymentDate
                            );
                            const today = new Date();

                            const diffInTime =
                                today.getTime() - paymentDate.getTime();
                            const diffInDays = diffInTime / (1000 * 3600 * 24);
                            return (
                                latestSalary && (
                                    <>
                                        <Text
                                            style={[
                                                styles.role,
                                                {
                                                    color: theme.textMuted
                                                }
                                            ]}
                                        >
                                            {new Date(
                                                latestSalary.paymentDate
                                            ).getDate()}
                                            /
                                            {new Date(
                                                latestSalary.paymentDate
                                            ).getMonth()}
                                            /
                                            {new Date(
                                                latestSalary.paymentDate
                                            ).getFullYear()}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.role,
                                                {
                                                    color: `${
                                                        diffInDays > 30
                                                            ? theme.danger
                                                            : theme.textThirdForGreen
                                                    }`,
                                                    textTransform: 'capitalize'
                                                }
                                            ]}
                                        >
                                            {diffInDays > 30
                                                ? 'Unpaid for this month'
                                                : 'Paid for this month'}
                                        </Text>
                                    </>
                                )
                            );
                        })()}
                    </View>
                </View>
                <View style={styles.rowBetween}>
                    <Text style={[styles.salary, { color: theme.text }]}>
                        ₹ {item.salary} / {item.salaryCycle}
                    </Text>
                    <Text style={[styles.date, { color: theme.textMuted }]}>
                        Joined: {new Date(item.joiningDate).toDateString()}
                    </Text>
                </View>
            </TouchableOpacity>
        ),
        [theme]
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>
                Your Staff
            </Text>

            {staffData?.data?.length > 0 ? (
                <FlatList
                    data={staffData.data}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    contentContainerStyle={{
                        paddingBottom: hp(10),
                        paddingTop: hp(2)
                    }}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <Text
                    style={{
                        color: theme.textMuted,
                        fontSize: wp(4),
                        marginTop: hp(4),
                        textAlign: 'center'
                    }}
                >
                    No staff added yet.
                </Text>
            )}

            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={handleOpenSheet}
            >
                <Text style={styles.addButtonText}>+ Add Staff</Text>
            </TouchableOpacity>

            {addStaffRef && profile && (
                <AddStaffBottomSheet
                    sheetRef={addStaffRef}
                    profileId={profile._id}
                    transactionCollectionId={profile.transactionCollection}
                    onSubmit={(data: any) => {
                        console.log('Payload:', data);
                    }}
                />
            )}
            {PayorDeleteStaffRef && profile && (
                <PayorDeleteStaffBottomSheet
                    sheetRef={PayorDeleteStaffRef}
                    staffForAction={staffForAction}
                />
            )}
        </View>
    );
};

export default StaffComponentMain;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(5)
    },
    title: {
        fontSize: wp(6),
        fontWeight: 'bold',
        marginTop: hp(2)
    },
    card: {
        padding: wp(4),
        marginBottom: hp(2),
        borderRadius: wp(3),
        borderWidth: 1
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    name: {
        fontSize: wp(4.8),
        fontWeight: '600'
    },
    role: {
        marginTop: hp(0.5),
        fontSize: wp(3.6),
        fontStyle: 'italic'
    },
    salary: {
        fontSize: wp(4),
        fontWeight: '500',
        marginTop: hp(1.5)
    },
    date: {
        fontSize: wp(3.4),
        marginTop: hp(1.5)
    },
    statusBadge: {
        paddingVertical: hp(0.3),
        paddingHorizontal: wp(3),
        borderRadius: wp(4),
        fontSize: wp(3.2),
        overflow: 'hidden'
    },
    addButton: {
        position: 'absolute',
        bottom: hp(3),
        left: wp(5),
        right: wp(5),
        paddingVertical: hp(1.8),
        borderRadius: wp(3),
        alignItems: 'center',
        justifyContent: 'center'
    },
    addButtonText: {
        fontSize: wp(4.5),
        color: '#fff',
        fontWeight: '600'
    }
});
