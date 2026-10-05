import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { useTheme } from '../context/ThemeContext';

export default function Badge({ label, type = 'default', size = 'medium' }) {
  const { isDark } = useTheme();

  const getColors = () => {
    switch (type) {
      case 'success':
      case 'Granted':
      case 'Agency Approved':
      case 'Active':
      case 'Approved':
      case 'Approved & Published':
        return { 
          bg: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.12)', 
          text: isDark ? '#34D399' : '#047857', 
          border: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.25)' 
        };
      case 'warning':
      case 'Under Review':
      case 'Closing Soon':
      case 'Draft':
      case 'Pending Review':
        return { 
          bg: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.12)', 
          text: isDark ? '#FBBF24' : '#B45309', 
          border: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.25)' 
        };
      case 'info':
      case 'Research Cell Approved':
      case 'Published':
      case 'Upcoming':
      case 'Open':
        return { 
          bg: isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.12)', 
          text: isDark ? '#22D3EE' : '#0E7490', 
          border: isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.25)' 
        };
      case 'purple':
      case 'Patent':
        return { 
          bg: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.12)', 
          text: isDark ? '#A78BFA' : '#6D28D9', 
          border: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.25)' 
        };
      case 'gold':
      case 'Excellence':
        return { 
          bg: isDark ? 'rgba(212, 175, 55, 0.18)' : 'rgba(212, 175, 55, 0.14)', 
          text: isDark ? '#F59E0B' : '#B45309', 
          border: isDark ? 'rgba(212, 175, 55, 0.35)' : 'rgba(212, 175, 55, 0.3)' 
        };
      case 'danger':
      case 'Rejected':
      case 'Expired':
        return { 
          bg: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.12)', 
          text: isDark ? '#F87171' : '#B91C1C', 
          border: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)' 
        };
      default:
        return { 
          bg: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)', 
          text: isDark ? '#CBD5E1' : '#475569', 
          border: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)' 
        };
    }
  };

  const styleColors = getColors();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: styleColors.bg,
          borderColor: styleColors.border,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 8 : 10,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: styleColors.text,
            fontSize: isSmall ? 9 : 10,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  badgeText: {
    fontFamily: FONTS.bodyBold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  }
});
