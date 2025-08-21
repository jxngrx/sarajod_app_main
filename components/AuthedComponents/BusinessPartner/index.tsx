import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import BusinessPartnerCard from './BusinessPartnerCard';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { useTheme } from '@/contexts/ThemeProvider';
import apiService from '@/hooks/useApi';
import { useSelector } from 'react-redux';
import { selectCurrentProfile } from '@/store/slices/userSlice';
import AddBusinessPartnerModal from './UI/AddBusinessPartnerModal';

const BusinessPartnerLayoutComponent = () => {
    const profile = useSelector(selectCurrentProfile);
    const [partners, setPartners] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const addBusinessPartnerRef = useRef<any>(null);
    const handleOpenSheet = useCallback(() => {
        addBusinessPartnerRef.current?.open();
    }, []);
    const handleCloseSheet = useCallback(() => {
        addBusinessPartnerRef.current?.close();
    }, []);
    const { theme } = useTheme();
    console.log(profile, 'PROFILE ID');

    const fetchBusinessPartners = async () => {
        if (profile?._id) {
            const response = await apiService.getAllBusinessPartners(
                profile?._id
            );
            setPartners(response.data);
        }
    };

    useEffect(() => {
        fetchBusinessPartners();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBusinessPartners();
        setRefreshing(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Text
                style={{
                    fontSize: wp(5),
                    fontWeight: '700',
                    margin: wp(4),
                    marginBottom: 0,
                    color: theme.text
                }}
            >
                Business Partners
            </Text>
            <ScrollView
                contentContainerStyle={{ paddingBottom: hp(2) }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.primary]}
                        tintColor={theme.primary}
                    />
                }
            >
                {partners.length === 0 ? (
                    <Text
                        style={{
                            color: theme.textSecondary,
                            textAlign: 'center',
                            marginTop: hp(5),
                            fontSize: wp(4)
                        }}
                    >
                        No business partners found.
                    </Text>
                ) : (
                    partners.map((item) => (
                        <BusinessPartnerCard
                            key={item._id}
                            fullName={item.userId.fullName}
                            email={item.userId.email}
                            phoneNumber={item.userId.phoneNumber}
                            profilePicture={item.userId.profilePicture}
                            role={item.role}
                            permissions={item.permissions}
                            joinedAt={item.createdAt}
                            onAccept={() => {}}
                            onRemove={() => {}}
                        />
                    ))
                )}
            </ScrollView>
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleOpenSheet}
            >
                <Text style={styles.addButtonText}>Add Business Partner</Text>
            </TouchableOpacity>
            {profile?._id && <AddBusinessPartnerModal ref={addBusinessPartnerRef} onClose={handleCloseSheet} />}
        </View>
    );
};

export default BusinessPartnerLayoutComponent;

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: 'green',
        padding: wp(4),
        borderRadius: wp(2),
        margin: wp(4),
        alignItems: 'center',
        justifyContent: 'center'
    },
    addButtonText: {
        color: 'white',
        fontSize: wp(4),
        fontWeight: 'bold'
    }
});
