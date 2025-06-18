import { colorBg } from '@/components/StyleDetailsComponent';
import { ColorContext } from '@/contexts/ColorContext';
import React, { useContext } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    StatusBar
} from 'react-native';

const Settings = () => {
    const { colorId, updateColor }: any = useContext(ColorContext);

    return (
        <SafeAreaView>
            <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
            <View className="mt-8">
                <Text className="text-2xl mx-4 font-semibold">
                    Set App Theme Color
                </Text>
                <View className="flex flex-row gap-4 py-4 px-8">
                    {colorBg.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                updateColor(item.id);
                                console.log(colorId);
                            }}
                            className="flex flex-row"
                        >
                            <View
                                className={`h-12 flex w-24 rounded-2xl ${item.color}`}
                            ></View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Settings;
