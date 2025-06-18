import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/userSlice';
import { setProfileSelected } from '@/store/slices/userSlice'; // ← Import the action
import { Profile } from '@/interface/userInterface';
import { getInitials } from '@/utils/UsernameToIntialNaming';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

const BottomSheetComponent = ({
    bottomSheetRef,
    bottomSheetProfileRef
}: any) => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const handleProfileSelect = (index: number) => {
        dispatch(setProfileSelected(index));
        bottomSheetRef?.current?.close();
    };

    const handleProfileCreate = () => {
        bottomSheetRef?.current?.close();
        setTimeout(() => {
            bottomSheetProfileRef?.current?.open();
        }, 250);
    };

    return (
        <RBSheet
            ref={bottomSheetRef}
            height={hp('50%')}
            openDuration={250}
            closeOnPressBack={true}
            draggable={false}
            customStyles={{
                container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    padding: 16,
                    backgroundColor: 'white'
                },
                draggableIcon: {
                    backgroundColor: '#000'
                }
            }}
        >
            <View>
                <TouchableOpacity
                    onPress={() => {
                        handleProfileCreate();
                    }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 5
                    }}
                >
                    <Text style={{ fontSize: wp(8), marginBottom: 4 }}>+</Text>
                    <Text style={{ fontSize: wp(5) }}>Add Profile</Text>
                </TouchableOpacity>
                <ScrollView>
                    {user?.profile.map(
                        (userProfile: Profile, index: number) => (
                            <TouchableOpacity
                                key={userProfile._id}
                                onPress={() => handleProfileSelect(index)}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingVertical: 20,
                                    paddingHorizontal: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ccc',
                                    borderRadius: 8
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 12
                                    }}
                                >
                                    <View
                                        style={{
                                            height: 48,
                                            width: 48,
                                            borderRadius: 24,
                                            backgroundColor: '#60A5FA',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: wp(5),
                                                color: 'white'
                                            }}
                                        >
                                            {getInitials(
                                                userProfile?.profileName
                                            )}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: wp(4.5),
                                                fontWeight: '500',
                                                color: '#111827'
                                            }}
                                        >
                                            {userProfile?.profileName}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: wp(3.5),
                                                color: '#6B7280'
                                            }}
                                        >
                                            Customer:{' '}
                                            {userProfile
                                                .transactionCollection[0]
                                                ?.transactionId?.length || 0}
                                        </Text>
                                    </View>
                                </View>
                                <FontAwesome5
                                    name="chevron-right"
                                    size={20}
                                    color="black"
                                />
                            </TouchableOpacity>
                        )
                    )}
                </ScrollView>
            </View>
        </RBSheet>
    );
};

export default BottomSheetComponent;
