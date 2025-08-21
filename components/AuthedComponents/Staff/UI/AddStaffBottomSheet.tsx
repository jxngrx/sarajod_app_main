import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    ActivityIndicator,
    KeyboardTypeOptions
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { useTheme } from '@/contexts/ThemeProvider';
import apiService from '@/hooks/useApi';
import { useAppDispatch } from '@/store/hooks';
import { fetchAllStaff } from '@/store/slices/userSlice';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const AddStaffBottomSheet = ({
    sheetRef,
    profileId,
    transactionCollectionId
}: any) => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // format: YYYY-MM-DD
    };

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        role: '',
        salary: '',
        salaryCycle: 'monthly',
        joiningDate: getTodayDate(), // 👈 auto-filled date
        phone: '',
        email: ''
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [openDropDown, setOpenDropDown] = useState(false);
    const [dropdownValue, setDropdownValue] = useState('monthly');

    const salaryCycleItems = [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Daily', value: 'daily' }
    ];

    const formFields: {
        label: string;
        key: keyof typeof form;
        keyboardType?: KeyboardTypeOptions;
    }[] = [
        { label: 'Full Name', key: 'name' },
        { label: 'Role', key: 'role' },
        { label: 'Salary', key: 'salary', keyboardType: 'numeric' },
        { label: 'Phone', key: 'phone' },
        { label: 'Email', key: 'email' }
    ];

    const handleChange = (key: string, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (
            !form.name ||
            !form.email ||
            !form.phone ||
            !form.role ||
            !form.salary
        ) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Warning',
                textBody: 'Please fill all the fields'
            });
            return;
        }
        setLoading(true);
        try {
            const payload = {
                ...form,
                salary: Number(form.salary),
                salaryCycle: dropdownValue,
                contactInfo: {
                    phone: form.phone,
                    email: form.email
                },
                profileId,
                transactionCollectionId
            };
            const response = await apiService.addStaffMember(payload);
            if (response.status === 201) {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: 'New Staff Member Added!'
                });
                await dispatch(fetchAllStaff());
                setForm({
                    email: '',
                    joiningDate: '',
                    name: '',
                    phone: '',
                    role: '',
                    salary: '',
                    salaryCycle: 'monthly'
                });
                sheetRef?.current?.close();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false);
        if (selectedDate) {
            handleChange(
                'joiningDate',
                selectedDate.toISOString().split('T')[0]
            );
        }
    };

    return (
        <RBSheet
            ref={sheetRef}
            height={hp(85)}
            closeOnPressBack
            customStyles={{
                container: {
                    backgroundColor: theme.background,
                    borderTopLeftRadius: wp(6),
                    borderTopRightRadius: wp(6),
                    padding: wp(5)
                }
            }}
        >
            <Text style={[styles.title, { color: theme.text }]}>
                Add New Staff
            </Text>
            <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
            >
                {formFields.map(({ label, key, keyboardType }) => (
                    <TextInput
                        key={key}
                        placeholder={label}
                        placeholderTextColor={theme.textMuted}
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.surface,
                                color: theme.text
                            }
                        ]}
                        value={form[key]}
                        onChangeText={(val) => handleChange(key, val)}
                        keyboardType={keyboardType || 'default'}
                    />
                ))}

                <DropDownPicker
                    open={openDropDown}
                    value={dropdownValue}
                    items={salaryCycleItems}
                    setOpen={setOpenDropDown}
                    setValue={setDropdownValue}
                    placeholder="Select Salary Cycle"
                    style={{
                        marginBottom: hp(2),
                        backgroundColor: theme.surface,
                        borderColor: theme.border
                    }}
                    textStyle={{ color: theme.text }}
                    dropDownContainerStyle={{
                        backgroundColor: theme.surface,
                        borderColor: theme.border
                    }}
                />

                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={[styles.input, { backgroundColor: theme.surface }]}
                >
                    <Text
                        style={{
                            color: form.joiningDate
                                ? theme.text
                                : theme.textMuted
                        }}
                    >
                        {form.joiningDate || 'Joining Date'}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={
                            form.joiningDate
                                ? new Date(form.joiningDate)
                                : new Date()
                        }
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                    />
                )}

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        { backgroundColor: theme.primary }
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <ActivityIndicator
                                size="small"
                                color="#fff"
                                style={{ marginRight: 8 }}
                            />
                            <Text style={[styles.submitText]}>Adding...</Text>
                        </View>
                    ) : (
                        <Text style={[styles.submitText]}>Add Staff</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </RBSheet>
    );
};

export default AddStaffBottomSheet;

const styles = StyleSheet.create({
    title: {
        fontSize: wp(5.2),
        fontWeight: '700',
        marginBottom: hp(2)
    },
    input: {
        borderRadius: wp(2),
        padding: wp(4),
        fontSize: wp(4),
        marginBottom: hp(1.5)
    },
    submitButton: {
        paddingVertical: hp(1.8),
        borderRadius: wp(2),
        marginTop: hp(2),
        alignItems: 'center'
    },
    submitText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: wp(4.2)
    }
});
