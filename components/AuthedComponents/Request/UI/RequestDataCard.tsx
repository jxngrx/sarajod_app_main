import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeProvider';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

interface RequestDataCardProps {
  action: string;
  targetType: string;
  status: string;
  createdAt: string;
  diff?: {
    amount?: number;
    type?: string;
    date?: number;
    month?: number;
    year?: number;
    description?: string;
  };
  onAccept: () => void;
  onReject: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getActionColor = (action: string, theme: any) => {
  switch (action) {
    case 'create':
      return theme.success;
    case 'delete':
      return theme.danger;
    case 'update':
      return theme.warning;
    default:
      return theme.info;
  }
};

const getStatusColor = (status: string, theme: any) => {
  switch (status) {
    case 'pending':
      return theme.warning;
    case 'approved':
      return theme.success;
    case 'rejected':
      return theme.danger;
    default:
      return theme.info;
  }
};

const RequestDataCard: React.FC<RequestDataCardProps> = ({
  action,
  targetType,
  status,
  createdAt,
  diff,
  onAccept,
  onReject,
}) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.divider, shadowColor: theme.shadow }]}>
      <View style={styles.headerRow}>
        <View style={[styles.actionBadge, { backgroundColor: getActionColor(action, theme) }]}>
          <MaterialIcons name={action === 'create' ? 'add-circle' : action === 'delete' ? 'delete' : 'edit'} size={20} color={theme.white} />
          <Text style={[styles.actionText, { color: theme.white }]}>{action.toUpperCase()}</Text>
        </View>
        <View style={styles.statusBadge}>
          <FontAwesome5 name={status === 'pending' ? 'clock' : status === 'approved' ? 'check-circle' : 'times-circle'} size={16} color={getStatusColor(status, theme)} />
          <Text style={[styles.statusText, { color: getStatusColor(status, theme) }]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Text style={[styles.targetType, { color: theme.textSecondary }]}>Target: <Text style={{ color: theme.text, fontWeight: 'bold' }}>{targetType}</Text></Text>
        <Text style={[styles.date, { color: theme.textMuted }]}>{formatDate(createdAt)}</Text>
      </View>
      {diff && (
        <View style={styles.diffBox}>
          <View style={styles.diffRow}>
            <FontAwesome5 name={diff.type === 'credit' ? 'arrow-down' : 'arrow-up'} size={16} color={diff.type === 'credit' ? theme.success : theme.danger} style={{ marginRight: 6 }} />
            <Text style={[styles.amount, { color: diff.type === 'credit' ? theme.success : theme.danger }]}>₹ {diff.amount}</Text>
            <Text style={[styles.type, { color: theme.textSecondary, marginLeft: 10 }]}>{diff.type?.toUpperCase()}</Text>
          </View>
          <Text style={[styles.description, { color: theme.text }]} numberOfLines={2}>
            {diff.description}
          </Text>
          <Text style={[styles.diffDate, { color: theme.textMuted }]}>Txn Date: {diff.date}/{diff.month}/{diff.year}</Text>
        </View>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.success }]}
          onPress={onAccept}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.danger }]}
          onPress={onReject}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    marginHorizontal: 10,
    marginVertical: 12,
    borderRadius: 18,
    borderWidth: 1.2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  actionText: {
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  statusText: {
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  targetType: {
    fontSize: 14,
    fontWeight: '500',
  },
  date: {
    fontSize: 13,
    fontWeight: '400',
  },
  diffBox: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  amount: {
    fontWeight: '700',
    fontSize: 16,
  },
  type: {
    fontWeight: '600',
    fontSize: 13,
  },
  description: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 2,
  },
  diffDate: {
    fontSize: 12,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  button: {
    flex: 1,
    paddingVertical: 11,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});

export default RequestDataCard;
