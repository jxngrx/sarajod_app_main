import React from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from '@/contexts/ThemeProvider';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import RequestScreenComponent from '@/components/AuthedComponents/Request';

const RequestScreen = () => {
    const { theme } = useTheme();
    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingHorizontal: wp(1),
                backgroundColor: theme.background
            }}
        >
            <RequestScreenComponent />
        </SafeAreaView>
    );
};

export default RequestScreen;
