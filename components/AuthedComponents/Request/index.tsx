// screens/ActivityList.tsx
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    ScrollView as RNScrollView
} from 'react-native';
import apiService from '@/hooks/useApi';
import { useTheme } from '@/contexts/ThemeProvider';
import RequestDataCard from './UI/RequestDataCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather, MaterialIcons } from '@expo/vector-icons';

type Activity = {
    _id: string;
    action: string;
    targetType: string;
    createdAt: string;
    diff?: Record<string, any>;
};

const ACTION_FILTERS = [
    { label: 'All', value: 'all', icon: 'list' },
    { label: 'Pending', value: 'pending', icon: 'clock' },
    { label: 'Approved', value: 'approved', icon: 'check' },
    { label: 'Rejected', value: 'rejected', icon: 'x' },
];

const RequestScreenComponent = () => {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAction, setSelectedAction] = useState('all');
    const { theme } = useTheme();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await apiService.getAllRequests();
                setActivities(response.data);
            } catch (error) {
                console.error('Failed to fetch activity:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const filteredActivities =
        selectedAction === 'all'
            ? activities
            : activities.filter((item) => item.status === selectedAction);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.text, marginTop: 10 }}>
                    Loading activity...
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Topbar Filter */}
            <RNScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: hp(1.5), paddingHorizontal: wp(2) }}
                style={{ backgroundColor: theme.background }}
            >
                {ACTION_FILTERS.map((filter) => {
                    const isSelected = selectedAction === filter.value;
                    return (
                        <TouchableOpacity
                            key={filter.value}
                            onPress={() => setSelectedAction(filter.value)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: isSelected ? theme.primary : theme.card,
                                borderRadius: wp(6),
                                paddingVertical: hp(1.1),
                                paddingHorizontal: wp(4.5),
                                marginRight: wp(2.5),
                                borderWidth: isSelected ? 0 : 1,
                                borderColor: theme.divider,
                                minWidth: wp(22),
                                maxHeight: hp(5),
                                minHeight: hp(5),
                            }}
                            activeOpacity={0.85}
                        >
                            <Feather
                                name={filter.icon as any}
                                size={wp(5.5)}
                                color={isSelected ? theme.white : theme.textSecondary}
                                style={{ marginRight: wp(1.5) }}
                            />
                            <Text
                                style={{
                                    color: isSelected ? theme.white : theme.text,
                                    fontWeight: isSelected ? '700' : '500',
                                    fontSize: wp(3.7),
                                    letterSpacing: 0.2,
                                }}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </RNScrollView>
            {/* Filtered List */}
            <ScrollView contentContainerStyle={styles.container}>
                {filteredActivities.length === 0 ? (
                    <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: hp(5), fontSize: wp(4) }}>
                        No requests found for this filter.
                    </Text>
                ) : (
                    filteredActivities.map((item) => (
                        <RequestDataCard
                            key={item._id}
                            action={item.action}
                            targetType={item.targetType}
                            status={item.status}
                            createdAt={item.createdAt}
                            diff={item.diff}
                            onAccept={() => console.log('Accepted')}
                            onReject={() => console.log('Rejected')}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: wp(2)
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100
    }
});

export default RequestScreenComponent;
