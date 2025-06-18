import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';

const ProfileScreen = () => {
    return (
        <ScrollView className="flex-1 bg-white">
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 bg-white p-4"
                >
                    <View className="flex flex-row items-center mb-6 justify-center">
                        <Text>PROFILE PAGE</Text>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

export default ProfileScreen;
