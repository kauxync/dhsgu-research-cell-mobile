import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { theme, isDark } = useTheme();

  const fetchNotifs = async () => {
    try {
      const res = await api.getNotifications();
      if (res && res.success) {
        setNotifications(res.data);
      }
    } catch (e) {
      console.warn('Error fetching notifications', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifs();
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Funding':
        return { name: 'wallet', color: COLORS.emerald, bg: 'rgba(16, 185, 129, 0.15)' };
      case 'Proposal':
        return { name: 'document-attach', color: COLORS.cyan, bg: 'rgba(6, 182, 212, 0.15)' };
      case 'Conference':
        return { name: 'globe', color: COLORS.purple, bg: 'rgba(139, 92, 246, 0.15)' };
      default:
        return { name: 'notifications', color: COLORS.gold, bg: 'rgba(245, 158, 11, 0.15)' };
    }
  };

  const renderNotifItem = ({ item }) => {
    const iconInfo = getCategoryIcon(item.category);
    return (
      <View style={[
        styles.card, 
        { backgroundColor: theme.surface, borderColor: theme.border },
        !item.is_read && { borderColor: 'rgba(245, 158, 11, 0.4)', backgroundColor: isDark ? 'rgba(245, 158, 11, 0.06)' : 'rgba(245, 158, 11, 0.08)' }
      ]}>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: iconInfo.bg }]}>
            <Ionicons name={iconInfo.name} size={18} color={iconInfo.color} />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.cardHeader}>
              <View style={[styles.catBadge, { backgroundColor: iconInfo.bg }]}>
                <Text style={[styles.catBadgeText, { color: iconInfo.color }]}>{item.category}</Text>
              </View>
              {!item.is_read && <View style={styles.unreadDot} />}
            </View>
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.msgText, { color: theme.textSecondary }]}>{item.message}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.topBar, { backgroundColor: theme.surface, borderBottomColor: theme.border, paddingTop: Math.max(insets.top + 6, 16) }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }]} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: theme.textPrimary }]}>Institutional Bulletins</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderNotifItem}
          contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom + 24, 36) }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.gold]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={48} color={theme.textMuted} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No broadcasts found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: COLORS.midnight,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    width: '100%',
    maxWidth: 880,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  unreadCard: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  catBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  catBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gold,
  },
  titleText: {
    fontFamily: FONTS.headingBold,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  msgText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontFamily: FONTS.bodyRegular,
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 13,
  }
});
