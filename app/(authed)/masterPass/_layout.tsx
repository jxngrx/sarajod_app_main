import { Stack } from 'expo-router';
import React from 'react';

const _layout = () => {

    return (
        <Stack>
            <Stack.Screen
                name="entryPass"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="setPass"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );
};

export default _layout;
