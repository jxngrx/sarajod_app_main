import { getInitials } from '@/utils/UsernameToIntialNaming';
import { useSelector } from 'react-redux';
import {
    selectUser,
    selectProfileSelected
} from '@/store/slices/userSlice';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface UserTransactionCollectionProps {
    youTake: number;
    youGive: number;
    refreshing: boolean;
}

export const UserTransactionCollection = ({
    youTake,
    youGive,
    refreshing
}: UserTransactionCollectionProps) => {
    const user = useSelector(selectUser);
    const profileSelected = useSelector(selectProfileSelected);

    const transactions =
        user?.profile?.[profileSelected]?.transactionCollection?.[0]
            ?.transactionId || [];

    return (
        <View className="col-span-2 rounded-2xl py-5">
            {/* Skeleton loader when refreshing */}
            {refreshing
                ? Array.from({ length: 10 }).map((_, index) => (
                      <View
                          key={index}
                          className="my-4 px-12 gap-3 flex flex-row items-center"
                      >
                          <View className="h-12 bg-gray-300 w-12 animate-pulse rounded-full" />
                          <View className="gap-2">
                              <View className="h-5 bg-gray-300 rounded w-full animate-pulse" />
                              <View className="flex-row space-x-2">
                                  <View className="h-4 bg-gray-300 rounded w-5/12 animate-pulse" />
                              </View>
                          </View>
                          <View className="gap-2 items-end">
                              <View className="h-5 bg-gray-300 rounded w-2/3 animate-pulse" />
                              <View className="flex-row space-x-2">
                                  <View className="h-4 bg-gray-300 rounded w-5/12 animate-pulse" />
                              </View>
                          </View>
                      </View>
                  ))
                : transactions.map((transaction, index) => (
                      <TouchableOpacity key={transaction?._id}>
                          <View className="mb-3 px-8 gap-3 justify-center py-2 rounded-xl flex flex-row items-center w-full">
                              <View className="items-center justify-center">
                                  <View className="h-12 w-12 items-center bg-blue-400 justify-center rounded-full">
                                      <Text className="text-3xl text-white">
                                          {getInitials(
                                              transaction?.transactionPartnerName
                                          )}
                                      </Text>
                                  </View>
                              </View>
                              <View className="w-10/12">
                                  <View className="flex flex-row justify-between">
                                      <Text className="text-xl font-medium text-gray-900 mt-1">
                                          {transaction?.transactionPartnerName}
                                      </Text>
                                      <Text
                                          className={`text-xl font-medium mt-1 ${
                                              transaction.totalBalance > 0
                                                  ? 'text-green-600'
                                                  : 'text-rose-600'
                                          }`}
                                      >
                                          {Math.abs(transaction.totalBalance)}
                                      </Text>
                                  </View>
                                  <View className="flex flex-row justify-between">
                                      <Text className="text-gray-500 text-base">
                                          {transaction?.transactionPartnerName}
                                      </Text>
                                      <Text className="text-gray-500 text-base">
                                          {transaction.totalBalance < 0
                                              ? 'In Expense'
                                              : 'In Profit'}
                                      </Text>
                                  </View>
                              </View>
                          </View>
                      </TouchableOpacity>
                  ))}
        </View>
    );
};
