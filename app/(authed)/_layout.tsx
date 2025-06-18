import { Tabs, usePathname } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Platform, StatusBar, View } from 'react-native';

export default function Layout() {
    const pathname = usePathname(); // Get current screen path
    const hideTabBar = pathname.includes('masterPass'); // Check if on masterPass screen

    return (
        <View
            style={{
                flex: 1,
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            }}
        >
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#2563EB',
                    tabBarInactiveTintColor: '#6B7280',
                    tabBarStyle: hideTabBar
                        ? { display: 'none' }
                        : {
                              backgroundColor: '#F9FAFB',
                          },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome5 name="home" size={20} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="requests"
                    options={{
                        title: 'Requests',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome5 name="clipboard-list" size={20} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome5 name="cog" size={20} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{ href: null }}
                />
                <Tabs.Screen
                    name="masterPass"
                    options={{ href: null }}
                />
            </Tabs>
        </View>
    );
}
