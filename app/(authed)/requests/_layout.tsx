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

const RequestScreen = () => {
    return (
        <ScrollView className="flex-1 bg-gray-50">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 bg-gray-50 p-4"
                >
                    <View>
                        <Text>Request Screen</Text>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

export default RequestScreen;
