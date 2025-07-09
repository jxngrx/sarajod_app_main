import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    RefreshControl,
    Platform,
    StyleSheet
} from 'react-native';
import StatusBarColor from '@/components/StatusBarColor';
import { BalanceCard } from '@/components/Home/BalanceCard';
import { UserTransactionCollection } from '@/components/Home/UserTransactionCollection';
import TopBar from '@/components/Home/Topbar';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
    fetchAllTransactions,
    fetchUserDetails,
    selectCurrentProfile,
    selectTransactions,
    selectUserLoading
} from '@/store/slices/userSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/hooks';
import AddTransactionWrapper from '@/components/AuthedComponents/AddTransactions';
import { useTheme } from '@/contexts/ThemeProvider';

const Home = () => {
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useAppDispatch();
    const loading = useSelector(selectUserLoading);
    const transactions = useSelector(selectTransactions);
    const profile = useSelector(selectCurrentProfile);
    const { theme } = useTheme();

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchUserDetails());
        await dispatch(fetchAllTransactions());
        setRefreshing(false);
    }, []);

    useEffect(() => {
        onRefresh();
    }, []);

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <StatusBarColor />
            <View style={styles.topBarContainer}>
                <TopBar />
            </View>
            <View style={styles.contentContainer}>
                <BalanceCard />
                <ScrollView
                    nestedScrollEnabled
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContentContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.primary]}
                            tintColor={theme.primary}
                        />
                    }
                >
                    <UserTransactionCollection
                        transactions={transactions?.data}
                        refreshing={loading}
                        profile={profile}
                    />
                </ScrollView>
            </View>
            <AddTransactionWrapper />
        </View>
    );
};

export default Home;

const getStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.primary,
            paddingTop: Platform.OS === 'ios' ? hp('1%') : hp('2.5%')
        },
        topBarContainer: {
            marginTop: Platform.OS === 'ios' ? hp('5%') : hp('3%'),
            width: '100%'
        },
        contentContainer: {
            marginTop: hp('12%'),
            backgroundColor: theme.background,
            width: '100%',
            height: '100%',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30
        },
        scrollContainer: {
            marginTop: Platform.OS === 'ios' ? hp('5%') : hp('8%'),
            backgroundColor: 'transparent'
        },
        scrollContentContainer: {
            paddingBottom: Platform.OS === 'ios' ? hp('25%') : hp('20%')
        }
    });
