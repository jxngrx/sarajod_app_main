import BusinessPartnerLayoutComponent from '@/components/AuthedComponents/BusinessPartner';
import StatusBarColor from '@/components/StatusBarColor';
import { useTheme } from '@/contexts/ThemeProvider';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
const BusinessPartnerScreen = () => {
    const { theme } = useTheme();
    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingHorizontal: wp(1),
                backgroundColor: theme.background
            }}
        >
            <StatusBarColor />
            <BusinessPartnerLayoutComponent />
        </SafeAreaView>
    );
};
export default BusinessPartnerScreen;
