import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import AddTransactionBottomSheet from './UI/AddTransactionBottomSheet';
import { selectCurrentProfile, selectUser } from '@/store/slices/userSlice';
import { useSelector } from 'react-redux';
import useTrans from '@/hooks/useLanguage'; // ✅ Add import

const AddTransactionWrapper = () => {
    const user = useSelector(selectUser);
    const profile = useSelector(selectCurrentProfile);
    const sheetRef = useRef<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const t = useTrans(); // ✅ Add translation hook

    const openSheet = () => {
        sheetRef.current?.open();
        setIsSheetOpen(true);
    };

    const closeSheet = () => {
        setIsSheetOpen(false);
    };

    return (
        <>
            {!isSheetOpen && (
                <TouchableOpacity style={styles.button} onPress={openSheet}>
                    <Ionicons name="person-add" size={wp(4)} color="white" />
                    <Text style={styles.buttonText}>
                        {t('addTransaction')}
                    </Text>
                </TouchableOpacity>
            )}

            <AddTransactionBottomSheet
                ref={sheetRef}
                addTransactionSheet={sheetRef}
                onClose={closeSheet}
                user={user}
                profile={profile}
            />
        </>
    );
};

export default AddTransactionWrapper;

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        backgroundColor: Colors.appPrimary,
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        borderRadius: wp(5),
        bottom: wp(5),
        right: wp(5),
        padding: wp(4),
        zIndex: 10
    },
    buttonText: {
        fontSize: wp(4),
        fontWeight: 'bold',
        color: 'white'
    }
});
