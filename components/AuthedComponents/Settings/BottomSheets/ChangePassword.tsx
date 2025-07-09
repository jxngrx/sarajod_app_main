import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@/contexts/ThemeProvider';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import apiService from '@/hooks/useApi';

export default function ChangePasswordBottomSheet({
    bottomSheetRef,
    email
}: any) {
    const { theme } = useTheme();
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!otp || !newPassword) {
            Alert.alert(
                'Validation Error',
                'OTP and New Password are required'
            );
            return;
        }

        try {
            setLoading(true);
            const response = await apiService.updatePasswordWithOtp({
                email,
                otp,
                newPassword
            });
            if (response.status === 200) {
                Alert.alert('Success', 'Password updated successfully');
                setOtp('');
                setNewPassword('');
                bottomSheetRef.current?.close();
            } else {
                Alert.alert(
                    'Failed',
                    response.data?.message || 'Could not update password'
                );
            }
        } catch (error: any) {
            Alert.alert(
                'Error',
                error?.response?.data?.message || 'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <RBSheet
            ref={bottomSheetRef}
            height={hp('35%')}
            openDuration={250}
            customStyles={{
                container: {
                    backgroundColor: theme.background,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20
                }
            }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={[styles.sheetContainer]}
            >
                <Text style={[styles.title, { color: theme.text }]}>
                    Reset Your Password
                </Text>

                <TextInput
                    placeholder="Enter OTP"
                    placeholderTextColor={theme.textSecondary}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    style={[
                        styles.input,
                        { color: theme.text, borderColor: theme.border }
                    ]}
                />

                <TextInput
                    placeholder="Enter New Password"
                    placeholderTextColor={theme.textSecondary}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    keyboardType="numeric"
                    maxLength={6}
                    style={[
                        styles.input,
                        { color: theme.text, borderColor: theme.border }
                    ]}
                />

                <TouchableOpacity
                    onPress={handleResetPassword}
                    disabled={loading}
                    style={[styles.button, { backgroundColor: theme.primary }]}
                >
                    <Text style={[styles.buttonText]}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </RBSheet>
    );
}

const styles = StyleSheet.create({
    sheetContainer: {
        flex: 1,
        padding: wp('5%'),
        justifyContent: 'center'
    },
    title: {
        fontSize: wp('5.5%'),
        fontWeight: '600',
        marginBottom: hp('3%'),
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: wp('3%'),
        marginBottom: hp('2%'),
        fontSize: wp('4%')
    },
    button: {
        marginTop: hp('2%'),
        paddingVertical: hp('1.5%'),
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        fontSize: wp('4.2%'),
        fontWeight: 'bold',
        color: '#ffffff'
    }
});
