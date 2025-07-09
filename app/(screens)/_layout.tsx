import { router, Stack } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="TransactionScreen"
                options={{
                    headerShown: true,
                    title: 'Transaction Details',
                    headerStyle: {
                        backgroundColor: '#3A57E8' // your header bg color
                    },
                    headerTintColor: '#fff', // back arrow + text color
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 18
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ paddingHorizontal: 10 }}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    )
                }}
            />
        </Stack>
    );
};

export default _layout;
