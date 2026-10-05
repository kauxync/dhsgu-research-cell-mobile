import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header({ title, subtitle, navigation, rightAction, rightIcon, showNotifications = true }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { theme } = useTheme();
  const role = user?.role || 'student';

  const getRoleAccent = () => {
    if (role === 'professor') return { color: COLORS.gold, badge: 'FACULTY PI' };
    if (role === 'scholar') return { color: COLORS.emerald, badge: 'PH.D. SCHOLAR' };
    return { color: COLORS.cyan, badge: 'STUDENT' };
  };

  const accent = getRoleAccent();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderBottomColor: theme.border, paddingTop: Math.max(insets.top + 6, 16) }]}>
      <View style={styles.leftCol}>
        <View style={styles.titleRow}>
          <View style={[styles.roleDot, { backgroundColor: accent.color }]} />
          <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>{title}</Text>
        </View>
        <View style={styles.subtitleRow}>
          <Text style={[styles.rolePill, { color: accent.color, borderColor: accent.color }]}>
            {accent.badge}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
              • {subtitle}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightActions}>
        {showNotifications && (
          <TouchableOpacity 
            style={[styles.bellButton, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
            activeOpacity={0.75}
            onPress={() => {
              if (rightAction) rightAction();
              else if (navigation) navigation.navigate('Notifications');
            }}
          >
            <Ionicons name={rightIcon || "notifications-outline"} size={20} color={theme.textPrimary} />
            <View style={[styles.dot, { backgroundColor: accent.color }]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  leftCol: {
    flex: 1,
    marginRight: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  title: {
    fontFamily: FONTS.headingBold,
    fontSize: 18,
    letterSpacing: -0.3,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  rolePill: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    flex: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  }
});
