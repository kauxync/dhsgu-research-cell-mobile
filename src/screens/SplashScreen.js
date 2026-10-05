import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UniversityLogo from '../components/UniversityLogo';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* High-Impact University Logo Emblem */}
      <View style={styles.logoWrapper}>
        <UniversityLogo size={108} color={COLORS.gold} />
      </View>

      <Text style={[styles.universityName, { color: theme.textPrimary }]}>DR. HARISINGH GOUR</Text>
      <Text style={styles.universitySub}>VISHWAVIDYALAYA, SAGAR</Text>
      <Text style={styles.naacBadge}>A Central University • NAAC 'A' Grade • Estd. 1946</Text>
      
      <Text style={[styles.cellTitle, { color: theme.textSecondary }]}>RESEARCH & DEVELOPMENT CELL</Text>

      <View style={styles.goldDivider} />

      <Text style={[styles.dcsaTag, { color: theme.textMuted }]}>
        DCSA • PHYSICS • MATHEMATICS • CHEMISTRY • BOTANY
      </Text>

      <View style={[styles.loaderContainer, { bottom: Math.max(insets.bottom + 24, 40) }]}>
        <ActivityIndicator size="small" color={COLORS.gold} />
        <Text style={[styles.loadingText, { color: theme.textMuted }]}>Initializing Research Ecosystem...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoWrapper: {
    marginBottom: 20,
  },
  universityName: {
    fontFamily: FONTS.headingBold,
    fontSize: 22,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  universitySub: {
    fontFamily: FONTS.headingSemiBold,
    fontSize: 14,
    color: COLORS.gold,
    letterSpacing: 1.2,
    marginTop: 2,
    textAlign: 'center',
  },
  naacBadge: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.emerald,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  cellTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  goldDivider: {
    width: 48,
    height: 2,
    backgroundColor: COLORS.gold,
    marginVertical: 16,
    borderRadius: 1,
  },
  dcsaTag: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 9,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 45,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    marginTop: 8,
  }
});
