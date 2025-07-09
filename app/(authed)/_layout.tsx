import { Tabs, usePathname } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeProvider';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function Layout() {
    const pathname = usePathname();
    const hideTabBar = pathname.includes('masterPass');
    const { theme } = useTheme();

    return (
        <View
            style={{
                flex: 1,
                paddingTop: Platform.OS === 'android' ? 0 : 0
            }}
        >
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: theme.primary,
                    tabBarInactiveTintColor: theme.textMuted,
                    tabBarStyle: hideTabBar
                        ? { display: 'none' }
                        : {
                              backgroundColor: theme.card,
                              borderTopWidth: 0,
                              height: wp(20),
                              paddingTop: Platform.OS === 'ios' ? wp(1) : wp(2),
                              borderTopColor: theme.divider
                          }
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => (
                            <Feather name="home" size={20} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="requests"
                    options={{
                        href: null
                    }}
                    // options={{
                    //     title: 'Requests',
                    //     tabBarIcon: ({ color }) => (
                    //         <Feather name="clipboard" size={20} color={color} />
                    //     )
                    // }}
                />
                <Tabs.Screen
                    name="staff"
                    options={{
                        title: 'Your Staff',
                        tabBarIcon: ({ color }) => (
                            <Feather name="users" size={20} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color }) => (
                            <Feather name="settings" size={20} color={color} />
                        )
                    }}
                />
                <Tabs.Screen name="masterPass" options={{ href: null }} />
            </Tabs>
        </View>
    );
}
