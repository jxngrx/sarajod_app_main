import React from 'react';
import { TouchableOpacity, Text, Linking, Platform } from 'react-native';

const DummyUPILink = () => {
    const openPhonePeUPI = async () => {
        const upi = {
            pa: 'shubhamjangrartk@okhdfcbank',
            pn: 'SHUBHAM SON OF DAYANAND',
            am: '100',
            cu: 'INR',
            tn: 'MaintenanceCharges',
            tr: `TXN${Date.now()}`
        };

        const upiParams = Object.entries(upi)
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
            .join('&');

        let phonePeIntent;

        if (Platform.OS === 'ios') {
            // PhonePe iOS deep link format
            phonePeIntent = `phonepe://upi/pay?${upiParams}`;
        } else {
            // Android - use proper intent format for PhonePe
            phonePeIntent = `intent://pay?${upiParams}#Intent;scheme=phonepe;package=net.one97.paytm;end`;
        }

        try {
                await Linking.openURL(phonePeIntent);

        } catch (e) {
            console.warn('Failed to open PhonePe:', e);
        }
    };

    const openGPayUPI = async () => {
        const upi = {
            pa: 'staraj891@ybl',
            pn: 'SHUBHAM SON OF DAYANAND',
            am: '1',
            cu: 'INR',
            tn: 'MaintenanceCharges',
        };

        const upiParams = Object.entries(upi)
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
            .join('&');

        let gpayIntent;

        if (Platform.OS === 'ios') {
            gpayIntent = `gpay://upi/pay?${upiParams}`;
        } else {
            // Android - use proper Google Pay deep link
            gpayIntent = `gpay://upi/pay?${upiParams}`;
        }

        try {
            const canOpen = await Linking.canOpenURL(gpayIntent);
            if (canOpen) {
                await Linking.openURL(gpayIntent);
            } else {
                console.warn('Google Pay app not installed or cannot handle this URL');
                // Fallback to Play Store
                await Linking.openURL('market://details?id=com.google.android.apps.nbu.paisa.user');
            }
        } catch (e) {
            console.warn('Failed to open GPay:', e);
        }
    };

    return (
        <>
            <TouchableOpacity
                style={{
                    padding: 16,
                    backgroundColor: '#5f259f',
                    borderRadius: 8,
                    alignItems: 'center',
                    marginBottom: 10
                }}
                onPress={openPhonePeUPI}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Pay ₹100 with PhonePe
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    padding: 16,
                    backgroundColor: '#34A853',
                    borderRadius: 8,
                    alignItems: 'center'
                }}
                onPress={openGPayUPI}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Pay ₹1 with Google Pay
                </Text>
            </TouchableOpacity>
        </>
    );
};

export default DummyUPILink;
