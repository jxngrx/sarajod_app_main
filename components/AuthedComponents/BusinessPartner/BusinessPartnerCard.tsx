import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeProvider';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface BusinessPartnerCardProps {
  fullName: string;
  email: string;
  phoneNumber: number;
  profilePicture?: string;
  role: string;
  permissions: string[];
  joinedAt: string;
  onAccept: () => void;
  onRemove: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const BusinessPartnerCard: React.FC<BusinessPartnerCardProps> = ({
  fullName,
  email,
  phoneNumber,
  profilePicture,
  role,
  permissions,
  joinedAt,
  onAccept,
  onRemove,
}) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.divider, shadowColor: theme.shadow }]}>
      <View style={styles.headerRow}>
        <Image
          source={profilePicture ? { uri: profilePicture } : require('@/assets/SARAJOD-LOGO.png')}
          style={styles.avatar}
        />
        <View style={{ flex: 1, marginLeft: wp(3) }}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{fullName}</Text>
          <Text style={[styles.email, { color: theme.textSecondary }]} numberOfLines={1}>{email}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(0.5) }}>
            <Feather name="phone" size={wp(4)} color={theme.textMuted} />
            <Text style={[styles.phone, { color: theme.textMuted, marginLeft: wp(1) }]}>{phoneNumber}</Text>
          </View>
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.roleBadge}>
          <Feather name="user-check" size={wp(4)} color={theme.primary} />
          <Text style={[styles.roleText, { color: theme.primary }]}>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
        </View>
        <View style={styles.permissionsBox}>
          <Feather name="key" size={wp(4)} color={theme.info} />
          <Text style={[styles.permissionsText, { color: theme.info }]} numberOfLines={1}>
            {permissions.join(', ').replace(/\[|\]|'/g, '')}
          </Text>
        </View>
      </View>
      <Text style={[styles.joined, { color: theme.textMuted }]}>Joined: {formatDate(joinedAt)}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.danger }]}
          onPress={onRemove}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: wp(4),
    marginHorizontal: wp(2),
    marginVertical: hp(1.5),
    borderRadius: wp(4),
    borderWidth: 1.2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  avatar: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: '#eee',
  },
  name: {
    fontSize: wp(4.5),
    fontWeight: '700',
  },
  email: {
    fontSize: wp(3.5),
    fontWeight: '400',
    marginTop: hp(0.2),
  },
  phone: {
    fontSize: wp(3.5),
    fontWeight: '400',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderRadius: wp(2),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
  },
  roleText: {
    fontWeight: '600',
    fontSize: wp(3.7),
    marginLeft: wp(1),
  },
  permissionsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37,99,235,0.08)',
    borderRadius: wp(2),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
    maxWidth: wp(50),
  },
  permissionsText: {
    fontWeight: '500',
    fontSize: wp(3.3),
    marginLeft: wp(1),
  },
  joined: {
    fontSize: wp(3.2),
    marginBottom: hp(1),
    marginTop: hp(0.5),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1.5),
  },
  button: {
    flex: 1,
    paddingVertical: hp(1.2),
    marginHorizontal: wp(1.5),
    borderRadius: wp(2.5),
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: wp(3.7),
    letterSpacing: 0.2,
  },
});

export default BusinessPartnerCard;
