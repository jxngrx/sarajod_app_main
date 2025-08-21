import { useAppSelector } from '@/store/hooks';
import { selectUser, selectProfileSelected } from '@/store/slices/userSlice';
import { convertToIndianNumbering } from '@/utils/ConvertToIndianNumbering';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { useTheme } from '@/contexts/ThemeProvider';
import useTrans from '@/hooks/useLanguage';
import DummyUPILink from '../UPITESTING';

export const BalanceCard = () => {
    const user = useAppSelector(selectUser);
    const profileSelected = useAppSelector(selectProfileSelected);
    const { theme } = useTheme();
    const t = useTrans(); // ✅ Added translation hook

    const saving = user?.profile?.[profileSelected]?.profileTotalCredit || 0;
    const expenses = user?.profile?.[profileSelected]?.profileTotalDebit || 0;
    const totalBalance = saving - expenses;

    const styles = getStyles(theme);

    return (
        <View
            style={[styles.wrapper, Platform.OS === 'ios' && styles.iosShadow]}
        >
            {!user && profileSelected ? (
                <View style={styles.skeletonWrapper}>
                    <View style={styles.skeletonLineShort} />
                    <View style={styles.skeletonRow}>
                        <View style={styles.skeletonLineMedium} />
                    </View>
                </View>
            ) : (
                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <View style={styles.section}>
                            <Text style={styles.label}>{t('yourSaving')}</Text>
                            <Text style={styles.valueGreen}>
                                ₹ {convertToIndianNumbering(saving)}
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.section}>
                            <Text style={styles.label}>
                                {t('yourExpenses')}
                            </Text>
                            <Text style={styles.valueRed}>
                                ₹ {convertToIndianNumbering(expenses)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.footerNotchLeft} />
                        <View style={styles.footerNotchRight} />
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.footerText}>
                                {t('totalBalance')} ={' '}
                                <Text
                                    style={
                                        totalBalance > 0
                                            ? [{ color: theme.success }]
                                            : [{ color: theme.danger }]
                                    }
                                >
                                    {Math.abs(totalBalance)}
                                </Text>
                            </Text>
                        </View>
                    </View>
                    {/* <DummyUPILink /> */}
                </View>
            )}
        </View>
    );
};

const getStyles = (theme: any) =>
    StyleSheet.create({
        wrapper: {
            position: 'absolute',
            top: -hp(11),
            width: '100%',
            alignItems: 'center',
            zIndex: 5
        },
        iosShadow: {
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 6
        },
        card: {
            backgroundColor: theme.card,
            borderRadius: wp(4),
            minWidth: wp(90),
            maxWidth: wp(90),
            overflow: 'hidden',
            elevation: 4
        },
        cardContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: hp(2),
            paddingHorizontal: wp(5)
        },
        section: {
            width: wp(35),
            alignItems: 'center',
            gap: hp(0.5)
        },
        label: {
            fontSize: wp(3.5),
            fontWeight: '600',
            color: theme.text
        },
        valueGreen: {
            fontSize: wp(6),
            fontWeight: '500',
            color: theme.success
        },
        valueRed: {
            fontSize: wp(6),
            fontWeight: '500',
            color: theme.danger
        },
        divider: {
            position: 'absolute',
            height: hp(6),
            borderLeftWidth: 1,
            borderColor: theme.divider,
            left: wp('45%')
        },
        footer: {
            borderTopWidth: 1,
            borderTopColor: theme.divider,
            alignItems: 'center',
            paddingVertical: hp(1),
            paddingHorizontal: wp(4),
            position: 'relative',
            backgroundColor: theme.card
        },
        footerText: {
            color: theme.textSecondary,
            fontSize: wp(4),
            marginVertical: hp(0.5),
            alignItems: 'center'
        },
        footerNotchLeft: {
            position: 'absolute',
            top: -hp(1),
            left: 0,
            width: wp(10),
            height: hp(2),
            backgroundColor: theme.card,
            zIndex: 2
        },
        footerNotchRight: {
            position: 'absolute',
            top: -hp(1),
            right: 0,
            width: wp(10),
            height: hp(2),
            backgroundColor: theme.card,
            zIndex: 2,
            alignItems: 'center'
        },
        skeletonWrapper: {
            gap: hp(1),
            alignItems: 'center'
        },
        skeletonLineShort: {
            height: hp(1.5),
            width: wp(30),
            backgroundColor: theme.skeleton,
            borderRadius: wp(2)
        },
        skeletonRow: {
            flexDirection: 'row',
            gap: wp(2)
        },
        skeletonLineMedium: {
            height: hp(2.5),
            width: wp(50),
            backgroundColor: theme.skeleton,
            borderRadius: wp(2)
        }
    });
