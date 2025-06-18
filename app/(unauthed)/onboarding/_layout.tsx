import React, { useEffect, useRef } from 'react';
import {
    FlatList,
    Text,
    View,
    Image,
    TouchableOpacity,
    useWindowDimensions,
    Animated,
    SafeAreaView
} from 'react-native';
import onBoard1 from '@/assets/images/onBoard3.png';
import onBoard2 from '@/assets/images/onBoard4.png';
import onBoard3 from '@/assets/images/onBoard1.png';
import onBoardJson1 from '@/assets/lottieFiles/onBoard1.json';
import onBoardJson2 from '@/assets/lottieFiles/onBoard1.json';
import onBoardJson3 from '@/assets/lottieFiles/onBoard1.json';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@/hooks/useNavigation';
import { FontAwesome5 } from '@expo/vector-icons';

const data = [
    {
        id: '1',
        title: 'Welcome to SaraJod',
        subtitle:
            'The easiest way to organize your tasks and achieve your goals.',
        image: onBoard1,
        animation: onBoardJson1
    },
    {
        id: '2',
        title: 'Stay Organized',
        subtitle: 'Manage your daily tasks effortlessly and efficiently.',
        image: onBoard2,
        animation: onBoardJson2
    },
    {
        id: '3',
        title: 'Track Every     Transfer',
        subtitle:
            'Get reminders, track progress, and celebrate your achievements.',
        image: onBoard3,
        animation: onBoardJson3
    }
];

const OnboardingScreen = ({ navigation }: { navigation: any }) => {
    const { width } = useWindowDimensions();
    const { navigateTo } = useNavigation();
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    const handleNext = (index: number) => {
        if (index < data.length - 1) {
            flatListRef.current?.scrollToIndex({ index: index + 1 });
        } else {
            navigateTo({
                pathname: 'WELCOME'
            });
        }
    };

    const handleSkip = () => {
        navigateTo({
            pathname: 'WELCOME'
        });
    };

    const renderItem = ({ item }: { item: (typeof data)[0] }) => (
        <View
            style={{ width }}
            className="flex-1 items-center justify-center"
        >
            {/* <LottieView
                source={onBoardJson1} // Use the Lottie animation
                autoPlay
                loop
                style={{ width: '100%', height: 500, marginBottom: 16 }}
            /> */}
            <Text className="text-7xl w-full font-bold text-white text-left px-2">
                {item.title}
            </Text>
            <Image
                source={item.image}
                className="w-full h-[45vh] object-contain mb-12"
            />
            <Text className="text-gray-300 text-xl text-left px-2">
                {item.subtitle}
            </Text>
        </View>
    );

    const renderDots = () => {
        return (
            <View className="flex-row justify-center mt-4">
                {data.map((_, i) => {
                    const opacity = scrollX.interpolate({
                        inputRange: [
                            (i - 1) * width,
                            i * width,
                            (i + 1) * width
                        ],
                        outputRange: [0.4, 1, 0.4],
                        extrapolate: 'clamp'
                    });

                    const scale = scrollX.interpolate({
                        inputRange: [
                            (i - 1) * width,
                            i * width,
                            (i + 1) * width
                        ],
                        outputRange: [1, 1.2, 1],
                        extrapolate: 'clamp'
                    });

                    return (
                        <Animated.View
                            key={i}
                            style={{ opacity, transform: [{ scale }] }}
                            className="w-3 h-3 mx-1 rounded-full bg-gray-300"
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-blue-600">
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                ref={flatListRef}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
            />

            <View className="flex flex-row items-center justify-between px-8 my-6">
                <View className='mb-2'>{renderDots()}</View>

                <TouchableOpacity
                    onPress={() =>
                        handleNext(Math.round(scrollX._value / width))
                    }
                    className="rounded-full p-5 px-7 bg-blue-100"
                >
                    <FontAwesome5
                        name={'chevron-right'}
                        size={25}
                        color={'black'}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default OnboardingScreen;
