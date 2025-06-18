import { router } from 'expo-router';

// Enum defining available routes
export enum Routes {
    ONBOARDING = '/onboarding',
    WELCOME = '/welcome',
    LOGIN = '/login',
    REGISTER = '/register',
    OTP = '/otp',
    HOME = '/home',
    PROFILE = '/profile',
    REQUESTS = '/requests',
    SETTING = '/settings',
    SETPASS = '/masterPass/setPass',
    ENTRYPASS = '/masterPass/entryPass',
    FORGETPASS = '/forgetPass'
}

// Interface specifying configuration for each route
export interface RoutesConfig {
    ONBOARDING: undefined;
    WELCOME: undefined;
    LOGIN: undefined;
    REGISTER: undefined;
    OTP: {
        email: string;
        name: string;
        phoneNumber: string;
    };
    HOME: undefined;
    PROFILE: undefined;
    REQUESTS: undefined;
    SETTING: undefined;
    SETPASS: {
        email: string;
    };
    ENTRYPASS: undefined;
    FORGETPASS: undefined;
}

// Type representing route names
export type RouteType = keyof RoutesConfig;

// Custom navigation hook
export function useNavigation() {
    function navigateTo<Q extends RouteType>({
        pathname,
        params
    }: {
        pathname: Q;
        params?: RoutesConfig[Q];
    }) {
        const path = Routes[pathname];
        console.log('Navigating to:', path, 'with params:', params); // Debug log
        router.navigate({ pathname: path, params });
    }

    return { navigateTo };
}
