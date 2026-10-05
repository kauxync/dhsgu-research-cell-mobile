import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { useTheme } from '../context/ThemeContext';

export default function StatCard({ title, value, icon, iconColor, bgLightColor, borderColor, onPress }) {
  const { theme, isDark } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.surface, 
          borderColor: borderColor || theme.border,
          shadowColor: theme.cardGlow || '#000',
        }
      ]} 
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: bgLightColor || (isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)') }]}>
          <Ionicons name={icon} size={20} color={iconColor || COLORS.gold} />
        </View>
        <Ionicons name="arrow-forward" size={14} color={theme.textMuted} />
      </View>
      <Text style={[styles.value, { color: theme.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={[styles.title, { color: theme.textSecondary }]} numberOfLines={1}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '50%',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: FONTS.headingBold,
    fontSize: 24,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  title: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 11,
    letterSpacing: 0.1,
  }
});
