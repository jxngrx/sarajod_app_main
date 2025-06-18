import React, { useCallback, useState } from 'react';
import {
    View,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl,
    Platform,
    StyleSheet
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import StatusBarColor from '@/components/StatusBarColor';
import { BalanceCard } from '@/components/Home/BalanceCard';
import { UserTransactionCollection } from '@/components/Home/UserTransactionCollection';
import TopBar from '@/components/Home/Topbar';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { fetchUserDetails, selectUserLoading } from '@/store/slices/userSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/hooks';

const Home = () => {
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useAppDispatch();
    const loading = useSelector(selectUserLoading);
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchUserDetails());
        setRefreshing(false);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBarColor />
            <View style={styles.topBarContainer}>
                <TopBar />
            </View>
            <View style={styles.contentContainer}>
                <BalanceCard />
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContentContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#60A5FA']}
                            tintColor="#60A5FA"
                        />
                    }
                >
                    <UserTransactionCollection
                        youGive={100}
                        youTake={100}
                        refreshing={loading}
                    />
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3B82F6',
        paddingTop: Platform.OS === 'ios' ? hp('2.5%') : hp('2.5%')
    },
    topBarContainer: {
        marginTop: hp('5%'),
        width: '100%'
    },
    contentContainer: {
        marginTop: hp('12%'),
        backgroundColor: '#ffffff',
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    scrollContainer: {
        marginTop: hp('5%'),
        backgroundColor: 'transparent'
    },
    scrollContentContainer: {
        paddingBottom: Platform.OS === 'ios' ? hp('25%') : hp('20%')
    }
});

export default Home;
