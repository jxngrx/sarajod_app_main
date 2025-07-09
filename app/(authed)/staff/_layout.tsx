import StaffComponentMain from '@/components/AuthedComponents/Staff';
import StatusBarColor from '@/components/StatusBarColor';
import { useTheme } from '@/contexts/ThemeProvider';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const StaffScreen = () => {
    const { theme } = useTheme();
    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingHorizontal: wp(5),
                backgroundColor: theme.background
            }}
        >
            <StatusBarColor />
            <StaffComponentMain />
        </SafeAreaView>
    );
};

export default StaffScreen;
