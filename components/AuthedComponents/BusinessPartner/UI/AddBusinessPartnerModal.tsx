import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import RBSheet from 'react-native-raw-bottom-sheet';
  import apiService from '@/hooks/useApi';
  import { selectCurrentProfile } from '@/store/slices/userSlice';
  import { useSelector } from 'react-redux';
  import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
  } from 'react-native-responsive-screen';
  import { useTheme } from '@/contexts/ThemeProvider';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

  const PERMISSIONS = ['create', 'read', 'update', 'delete'];

  const AddBusinessPartnerModal = ({ ref, onClose }: any) => {
    const [partnerPhoneNumber, setPartnerPhoneNumber] = useState('');
    const [role, setRole] = useState<'editor' | 'viewer'>('editor');
    const [permissions, setPermissions] = useState<string[]>(PERMISSIONS);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const profile = useSelector(selectCurrentProfile);
    const { theme } = useTheme();

    useEffect(() => {
      if (role === 'viewer') {
        setPermissions([]);
      } else {
        setPermissions(PERMISSIONS);
      }
    }, [role]);

    const togglePermission = (perm: string) => {
      setPermissions((prev) =>
        prev.includes(perm)
          ? prev.filter((p) => p !== perm)
          : [...prev, perm]
      );
    };

    const handleAddBusinessPartner = async () => {
      if (!partnerPhoneNumber.trim()) {
        setError('Phone number is required');
        return;
      }

      setLoading(true);
      const response = await apiService.addBusinessPartnerToProfile({
        partnerPhoneNumber: partnerPhoneNumber,
        profileId: profile?._id || '',
        role,
        permissions
      });

      setLoading(false);

      if (response.status === 200) {
        setError('');
        setPartnerPhoneNumber('');
        setRole('editor');
        setPermissions(PERMISSIONS);
        onClose();
        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: response?.data?.message
        });
      } else {
        Toast.show({
            type: ALERT_TYPE.WARNING,
            title: 'Error',
            textBody: response?.data?.message
        });
        setError(response?.data?.message || 'Something went wrong');
      }
    };

    return (
      <RBSheet
        ref={ref}
        height={hp(60)}
        openDuration={300}
        closeOnPressBack
        closeOnPressMask
        customStyles={{
          container: {
            borderTopLeftRadius: wp(6),
            borderTopRightRadius: wp(6),
            backgroundColor: theme.background,
            paddingHorizontal: wp(5),
            paddingTop: hp(3)
          }
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={[styles.title, { color: theme.text }]}>
              Add Business Partner
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Phone Number
              </Text>
              <TextInput
                placeholder="Enter 10-digit phone number"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                value={partnerPhoneNumber}
                onChangeText={setPartnerPhoneNumber}
                style={[
                  styles.input,
                  {
                    borderColor: theme.border,
                    color: theme.text
                  }
                ]}
                maxLength={10}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Role</Text>
              <View style={styles.roleToggle}>
                {['editor', 'viewer'].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.roleButton,
                      {
                        backgroundColor:
                          role === r ? theme.primary : theme.card,
                        borderColor: theme.primary
                      }
                    ]}
                    onPress={() => setRole(r as 'editor' | 'viewer')}
                  >
                    <Text style={{ color: role === r ? '#fff' : theme.text }}>
                      {r.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {role === 'editor' && (
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Permissions
                </Text>
                <View style={styles.permissionsContainer}>
                  {PERMISSIONS.map((perm) => {
                    const isSelected = permissions.includes(perm);
                    return (
                      <TouchableOpacity
                        key={perm}
                        style={[
                          styles.permissionItem,
                          {
                            borderColor: isSelected
                              ? theme.primary
                              : theme.border
                          }
                        ]}
                        onPress={() => togglePermission(perm)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            {
                              backgroundColor: isSelected
                                ? theme.primary
                                : 'transparent',
                              borderColor: isSelected
                                ? theme.primary
                                : theme.border
                            }
                          ]}
                        />
                        <Text
                          style={[
                            styles.permissionText,
                            { color: theme.text }
                          ]}
                        >
                          {perm}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <TouchableOpacity
              onPress={handleAddBusinessPartner}
              style={[
                styles.submitButton,
                { backgroundColor: theme.primary }
              ]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Add Partner</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </RBSheet>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    title: {
      fontSize: wp(5),
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: hp(2)
    },
    fieldGroup: {
      marginBottom: hp(2)
    },
    label: {
      fontSize: wp(3.8),
      fontWeight: '500',
      marginBottom: hp(0.5)
    },
    input: {
      borderWidth: 1,
      borderRadius: wp(2),
      padding: wp(3),
      fontSize: wp(4)
    },
    roleToggle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: wp(4)
    },
    roleButton: {
      flex: 1,
      paddingVertical: hp(1.2),
      alignItems: 'center',
      borderRadius: wp(2),
      borderWidth: 1
    },
    submitButton: {
      marginTop: hp(3),
      paddingVertical: hp(1.8),
      borderRadius: wp(2),
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    },
    submitText: {
      color: '#fff',
      fontSize: wp(4),
      fontWeight: '600'
    },
    errorText: {
      color: 'red',
      fontSize: wp(3.5),
      textAlign: 'center',
      marginTop: hp(1)
    },
    permissionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: wp(3),
      marginTop: hp(1)
    },
    permissionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: wp(2),
      paddingVertical: hp(0.8),
      paddingHorizontal: wp(3)
    },
    checkbox: {
      width: wp(4),
      height: wp(4),
      marginRight: wp(2),
      borderRadius: 4,
      borderWidth: 1.5
    },
    permissionText: {
      fontSize: wp(3.8)
    }
  });

  export default AddBusinessPartnerModal;
