import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectUser, selectProfileSelected } from '@/store/slices/userSlice';
import ProfileChangeSheetComponent from '../TopBar/ProfileChangeSheet';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import ProfileCreationBottomSheet from '../TopBar/ProfileCreationBottomSheet';
import { useSession } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';

const TopBar = () => {
    const user = useSelector(selectUser);
    const profileSelected = useSelector(selectProfileSelected);
    const bottomSheetRef = useRef<any>(null);
    const bottomSheetProfileRef = useRef<any>(null);
    const { navigateTo } = useNavigation();
    const [hasOpened, setHasOpened] = useState(false);
    const { signOut } = useSession();
    const openSheet = () => bottomSheetRef.current?.open();
    const openProfileSheet = () => bottomSheetProfileRef.current?.open();

    useEffect(() => {
        if (
            user &&
            (!user.profile || user.profile.length === 0) &&
            !hasOpened
        ) {
            openProfileSheet();
            setHasOpened(true);
        }
    }, [user, hasOpened]);

    return (
        <View style={styles.container}>
            {user ? (
                <View style={styles.userInfoContainer}>
                    <Image
                        source={
                            user?.profilePicture
                                ? { uri: user.profilePicture }
                                : {
                                      uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                                  }
                        }
                        style={styles.profileImage}
                    />
                    <TouchableOpacity
                        onPress={openSheet}
                        style={styles.profileTextContainer}
                    >
                        <Text style={styles.profileName}>
                            {user?.profile?.length > 0 &&
                            user?.profile[profileSelected]
                                ? user.profile[profileSelected].profileName
                                : 'Loading...'}
                        </Text>
                        <FontAwesome5 name="chevron-down" color="white" />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.userInfoContainer}>
                    <Image
                        source={{
                            uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                        }}
                        style={styles.profileImageLarge}
                    />
                    <TouchableOpacity style={styles.profileTextContainer}>
                        <View style={styles.placeholderBox}></View>
                        <FontAwesome5 name="chevron-down" color="white" />
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity
                onPress={() => {
                    // signOut();
                    navigateTo({
                        pathname: 'ENTRYPASS'
                    });
                }}
                style={styles.bellButton}
            >
                <FontAwesome5 name="lock" size={24} color={'white'} />
            </TouchableOpacity>

            {bottomSheetRef && (
                <ProfileChangeSheetComponent
                    bottomSheetRef={bottomSheetRef}
                    bottomSheetProfileRef={bottomSheetProfileRef}
                />
            )}
            {bottomSheetProfileRef && (
                <ProfileCreationBottomSheet
                    bottomSheetProfileRef={bottomSheetProfileRef}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('4%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('2%')
    },
    profileImage: {
        width: wp('8%'),
        height: wp('8%'),
        borderRadius: wp('4%')
    },
    profileImageLarge: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%')
    },
    profileTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('2%')
    },
    profileName: {
        fontSize: wp('5%'),
        fontWeight: '600',
        color: 'white'
    },
    placeholderBox: {
        width: wp('24%'),
        height: hp('2.5%'),
        borderRadius: 6,
        backgroundColor: '#9CA3AF'
    },
    bellButton: {
        padding: wp('2%'),
        borderRadius: wp('6%')
    }
});

export default TopBar;
