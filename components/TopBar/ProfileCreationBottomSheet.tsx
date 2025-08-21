import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserDetails, selectUser } from '@/store/slices/userSlice';
import apiService from '@/hooks/useApi';
import { getInitials } from '@/utils/UsernameToIntialNaming';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList
} from 'react-native';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const ProfileCreationBottomSheet = ({
    bottomSheetProfileRef,
    onClose
}: any) => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const [profileName, setProfileName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleCreateProfile = async () => {
        if (!profileName.trim() || !phoneNumber.trim()) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Missing Info',
                textBody: 'Please enter both name and phone number.'
            });
            return;
        }

        try {
            const profileData = {
                profileName: profileName.trim(),
                profileNumber: phoneNumber.trim()
            };

            const response = await apiService.createProfile(profileData);

            if (response.status === 201) {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Profile Created',
                    textBody:
                        response?.data?.message || 'Profile has been created.',
                    autoClose: 3000
                });

                setProfileName('');
                setPhoneNumber('');

                // Refetch updated user data
                dispatch(fetchUserDetails());

                // Close the sheet
                bottomSheetProfileRef?.current?.close();
            } else {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Error',
                    textBody: 'Failed to create profile. Try again.'
                });
            }
        } catch (error) {
            console.error('Profile Creation Error:', error);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Something went wrong. Please try again.'
            });
        }
    };

    return (
        <RBSheet
            ref={bottomSheetProfileRef}
            height={hp('70%')}
            openDuration={250}
            closeOnPressBack
            onClose={() => onClose(false)}
            draggable={false}
            customStyles={{
                container: {
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    paddingHorizontal: wp('5%'),
                    paddingTop: hp('2%'),
                    backgroundColor: '#fdfdfd'
                },
                draggableIcon: {
                    backgroundColor: '#ccc',
                    width: wp('14%')
                }
            }}
        >
            <Text style={styles.heading}>Create New Profile</Text>

            <TextInput
                style={styles.input}
                placeholder="Profile Name"
                value={profileName}
                onChangeText={setProfileName}
                placeholderTextColor="#999"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleCreateProfile}
            >
                <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>

            {user && user?.profile.length > 0 && (
                <>
                    <Text style={styles.subHeading}>Your Profiles</Text>
                    <FlatList
                        data={user.profile}
                        keyExtractor={(_, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        style={{ marginTop: 8 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.profileCard}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {getInitials(item.profileName)}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.profileName}>
                                        {item.profileName}
                                    </Text>
                                    <Text style={styles.profileNumber}>
                                        {item.profileNumber || 'N/A'}
                                    </Text>
                                </View>
                                <FontAwesome5
                                    name="chevron-right"
                                    size={16}
                                    color="#888"
                                    style={{ marginLeft: 'auto' }}
                                />
                            </TouchableOpacity>
                        )}
                    />
                </>
            )}
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: wp('5.5%'),
        fontWeight: '700',
        color: '#111',
        marginBottom: hp('2%')
    },
    input: {
        width: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingVertical: hp('1.4%'),
        paddingHorizontal: wp('4%'),
        fontSize: wp('4%'),
        color: '#111',
        marginBottom: hp('1.5%')
    },
    button: {
        backgroundColor: '#007aff',
        paddingVertical: hp('1.7%'),
        borderRadius: 12,
        alignItems: 'center',
        marginTop: hp('1%'),
        marginBottom: hp('2.5%')
    },
    buttonText: {
        color: '#fff',
        fontSize: wp('4.3%'),
        fontWeight: '600'
    },
    subHeading: {
        fontSize: wp('4.5%'),
        fontWeight: '600',
        color: '#333',
        marginBottom: hp('1%'),
        marginTop: hp('1%')
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('3%'),
        borderRadius: 12,
        marginBottom: hp('1%'),
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1
    },
    avatar: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        backgroundColor: '#007aff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp('3%')
    },
    avatarText: {
        fontSize: wp('4.5%'),
        color: '#fff',
        fontWeight: '600'
    },
    profileName: {
        fontSize: wp('4%'),
        fontWeight: '500',
        color: '#111'
    },
    profileNumber: {
        fontSize: wp('3.5%'),
        color: '#666'
    }
});

export default ProfileCreationBottomSheet;
