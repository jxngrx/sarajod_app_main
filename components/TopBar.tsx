import { useSession } from '@/contexts/AuthContext';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';

const TopBar = ({ title }: { title: string }) => {
    const { signOut } = useSession();
    return (
        <View
            className={`w-full ${
                Platform.OS === 'ios' ? 'h-28 pt-12' : 'h-20 pt-6'
            } bg-blue-500 flex flex-row justify-between items-center px-5`}
        >
            <View className='flex flex-row gap-3 items-center'>
                <Text className="text-white text-2xl font-bold">{title}</Text>
                <FontAwesome5 name="chevron-down" color="white" />
            </View>

            <TouchableOpacity onPress={signOut}>
                <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    );
};

export default TopBar;
