import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeProvider';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { selectUser } from '@/store/slices/userSlice';
import { getInitials } from '@/utils/UsernameToIntialNaming';
import { useSession } from '@/contexts/AuthContext';
import useTrans from '@/hooks/useLanguage';
import { useLanguageSwitcher } from '@/locales/changeLanguage';
import { useNavigation } from '@/hooks/useNavigation';
import ChangePasswordBottomSheet from '@/components/AuthedComponents/Settings/BottomSheets/ChangePassword';
import apiService from '@/hooks/useApi';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const Settings = () => {
    const { theme, mode, toggleTheme } = useTheme();
    const user = useSelector(selectUser);
    const { navigateTo } = useNavigation();
    const { signOut } = useSession();
    const t = useTrans();
    const selectedLanguage = useSelector(
        (state: any) => state.settings?.language
    );
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const sheetRef = useRef<any>(null);

    const openSheet = async () => {
        if (!user?.email) {
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Email not found'
            });
        } else {
            console.log(user?.email, 'EMIAL');

            const response = await apiService.requestOtpForgetPass(user?.email);
            if (response.status === 200) {
                sheetRef.current?.open();
                setIsSheetOpen(true);
            }
        }
    };

    const closeSheet = () => {
        setIsSheetOpen(false);
    };

    const { switchToHinglish, switchToEnglish } = useLanguageSwitcher();
    const options = [
        // {
        //     label: t('settings_my_profile'),

        //     icon: (
        //         <Ionicons name="person-outline" size={22} color={theme.text} />
        //     ),
        //     onPress: () => {}
        // },
        {
            label: t('settings_change_password'),
            icon: (
                <MaterialIcons
                    name="lock-outline"
                    size={22}
                    color={theme.text}
                />
            ),
            onPress: () => {
                openSheet();
            }
        },
        {
            label: t('settings_change_language'),
            icon: <FontAwesome5 name="language" size={20} color={theme.text} />,
            onPress: () => {
                selectedLanguage === 'en'
                    ? switchToHinglish()
                    : switchToEnglish();
            }
        },
        {
            label:
                mode === 'dark'
                    ? t('settings_switch_to_light')
                    : t('settings_switch_to_dark'),
            icon: <Ionicons name="contrast" size={22} color={theme.text} />,
            onPress: toggleTheme
        },
        {
            label: t('settings_logout'),
            icon: <Ionicons name="log-out" size={22} color={theme.danger} />,
            onPress: () => {
                signOut();
            }
        }
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <View
                    style={[
                        styles.initialsCircle,
                        { backgroundColor: theme.primary }
                    ]}
                >
                    <Text style={styles.initialsText}>
                        {getInitials(user?.user_name ?? 'User')}
                    </Text>
                </View>
                <Text style={[styles.userName, { color: theme.card }]}>
                    {user?.user_name || 'User Name'}
                </Text>
                <Text style={[styles.userPhone, { color: theme.card }]}>
                    {user?.phone_number || ''}
                </Text>
                {user?.email && (
                    <Text style={[styles.userPhone, { color: theme.card }]}>
                        {user?.email || ''}
                    </Text>
                )}
            </View>

            {/* Options */}
            <View
                style={[
                    styles.settingsContainer,
                    { backgroundColor: theme.card }
                ]}
            >
                <Text
                    style={[
                        styles.sectionTitle,
                        { color: theme.textSecondary }
                    ]}
                >
                    {t('settings_account_overview')}
                </Text>

                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.optionRow}
                        onPress={option.onPress}
                    >
                        <View style={styles.iconWrapper}>{option.icon}</View>
                        <Text
                            style={[styles.optionText, { color: theme.text }]}
                        >
                            {option.label}
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={
                                option.label === 'Logout'
                                    ? theme.danger
                                    : theme.textSecondary
                            }
                        />
                    </TouchableOpacity>
                ))}
            </View>
            {isSheetOpen && (
                <ChangePasswordBottomSheet
                    bottomSheetRef={sheetRef}
                    email={user?.email}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        alignItems: 'center',
        paddingVertical: hp(6),
        borderBottomLeftRadius: wp(10),
        borderBottomRightRadius: wp(10)
    },
    initialsCircle: {
        width: wp(24),
        height: wp(24),
        borderRadius: wp(6),
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(1)
    },
    initialsText: {
        color: '#fff',
        fontSize: wp(12),
        fontWeight: 'bold'
    },
    userName: {
        fontSize: hp(2.6),
        fontWeight: 'bold',
        marginTop: hp(1)
    },
    userPhone: {
        fontSize: hp(1.8),
        opacity: 0.8
    },
    settingsContainer: {
        marginTop: -hp(4),
        borderTopLeftRadius: wp(10),
        borderTopRightRadius: wp(10),
        paddingHorizontal: wp(6),
        paddingTop: hp(5),
        flex: 1
    },
    sectionTitle: {
        fontSize: hp(2),
        fontWeight: '600',
        marginBottom: hp(2)
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    },
    iconWrapper: {
        width: wp(10),
        alignItems: 'center'
    },
    optionText: {
        flex: 1,
        fontSize: hp(2)
    }
});

export default Settings;
