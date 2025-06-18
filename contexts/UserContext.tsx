import apiService from '@/hooks/useApi';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserContextType } from '@/interface/userInterface';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [profileSelected, setProfileSelected] = useState<number>(0);
    const { signOut } = useSession();

    const fetchUserDetails = async () => {
        const userToken = await AsyncStorage.getItem('token');
        if (!userToken) return;
        try {
            setLoading(true);
            const response = await apiService.getUserDetails();
            if (response.status === 200) {
                const data = response.data;
                console.log(data, 'the api is hit');

                await AsyncStorage.setItem('UserDetails', JSON.stringify(data));
                await AsyncStorage.setItem(
                    'profileSelected',
                    String(profileSelected)
                );
                setUser(data);
                setProfileSelected(0);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            signOut();
        } finally {
            setLoading(false);
        }
    };

    const setNewProfileSelected = async (profileIndex: number) => {
        setProfileSelected(profileIndex);
        await AsyncStorage.setItem('profileSelected', profileIndex.toString());
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                profileSelected,
                setNewProfileSelected,
                setUser,
                fetchUserDetails
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserDetails = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserDetails must be used within a UserProvider');
    }
    return context;
};
