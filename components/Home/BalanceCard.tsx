import { useAppSelector } from '@/store/hooks';
import {
    selectUser,
    selectProfileSelected
} from '@/store/slices/userSlice';
import { convertToIndianNumbering } from '@/utils/ConvertToIndianNumbering';
import { View, Text, Platform } from 'react-native';
import React from 'react';

export const BalanceCard = () => {
    const user = useAppSelector(selectUser);
    const profileSelected = useAppSelector(selectProfileSelected);

    return (
        <View
            className={`absolute w-full col-span-2 rounded-2xl items-center -top-12 ${
                Platform.OS === 'ios' ? 'shadow-lg shadow-gray-300' : ''
            }`}
        >
            {!user && profileSelected ? (
                <View className="space-y-4 gap-4">
                    <View className="h-4 bg-gray-300 rounded w-1/3 animate-pulse" />
                    <View className="flex-row space-x-2">
                        <View className="h-6 bg-gray-300 rounded w-1/2 animate-pulse" />
                    </View>
                </View>
            ) : (
                <View className="relative flex rounded-2xl bg-white shadow-lg overflow-hidden min-w-96 max-w-96">
                    <View className="flex flex-row justify-between items-center py-4 w-full">
                        <View className="flex items-center gap-2 w-48">
                            <Text className="text-gray-600 text-sm font-semibold">
                                Your Saving
                            </Text>
                            <Text className="text-3xl font-medium text-green-700">
                                ₹{' '}
                                {convertToIndianNumbering(
                                    user?.profile?.[profileSelected]
                                        ?.profileTotalCredit || 0
                                )}
                            </Text>
                        </View>

                        <View className="absolute top-3 left-[11rem] border-l border-gray-300 h-16 mx-4"></View>

                        <View className="flex items-center w-48 gap-2">
                            <Text className="text-gray-600 text-sm font-semibold">
                                Your Expenses
                            </Text>
                            <Text className="text-3xl font-medium text-rose-700">
                                ₹{' '}
                                {convertToIndianNumbering(
                                    user?.profile?.[profileSelected]
                                        ?.profileTotalDebit || 0
                                )}
                            </Text>
                        </View>
                    </View>

                    <View className="relative px-6 pb-2 border-t items-center border-gray-300">
                        <View className="absolute left-0 -top-2 w-1/12 z-50 bg-white h-4"></View>
                        <View className="absolute right-0 -top-2 w-1/12 z-9999 bg-white h-4"></View>
                        <Text className="text-gray-500 mt-2 text-lg">
                            Generate Statement
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};
