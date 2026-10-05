import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import UniversityLogo from '../components/UniversityLogo';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    isLogo: true,
    badge: 'Central University R&D',
    title: 'Dr. Harisingh Gour Vishwavidyalaya',
    description: 'Centralized repository of distinguished faculty, laboratory expertise, citations, and H-Index metrics across DCSA and allied faculties (Estd. 1946).'
  },
  {
    id: '2',
    icon: 'ribbon',
    iconColor: '#7C3AED',
    badge: 'IP & Publications',
    title: 'Patents, Papers & National Grants',
    description: 'Track peer-reviewed journal papers, patent disclosures, and discover active MPCOST, SERB, and MeitY research grant schemes.'
  },
  {
    id: '3',
    icon: 'sparkles',
    iconColor: '#059669',
    badge: 'AI Innovation',
    title: 'Conversational AI Research Assistant',
    description: 'Query faculty specializations in natural language, track project proposal approvals, and receive real-time university R&D alerts.'
  }
];

export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const { completeOnboarding } = useAuth();
  const { theme, isDark } = useTheme();

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await completeOnboarding();
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      {item.isLogo ? (
        <View style={styles.logoCircle}>
          <UniversityLogo size={84} color={COLORS.gold} />
        </View>
      ) : (
        <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)', borderColor: isDark ? 'rgba(212, 175, 55, 0.3)' : 'rgba(212, 175, 55, 0.4)' }]}>
          <Ionicons name={item.icon} size={48} color={item.iconColor} />
        </View>
      )}

      <View style={styles.badgePill}>
        <Text style={styles.badgeText}>{item.badge}</Text>
      </View>

      <Text style={[styles.title, { color: theme.textPrimary }]}>{item.title}</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>{item.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: Math.max(insets.top + 4, 16) }]}>
      {/* Top Bar with Skip */}
      <View style={styles.topBar}>
        <Text style={styles.brandTitle}>DHSGSU R&D</Text>
        <TouchableOpacity onPress={handleFinish} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[styles.skipText, { color: theme.textMuted }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slide Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
        onMomentumScrollEnd={(ev) => {
          const index = Math.round(ev.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Bottom Footer with Indicators & Action Button */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}>
        <View style={styles.paginationRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentIndex === i ? styles.dotActive : [styles.dotInactive, { backgroundColor: isDark ? '#334155' : '#CBD5E1' }]
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={handleNext}
        >
          <Text style={styles.primaryBtnText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started →' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  brandTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 16,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  skipText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  logoCircle: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  badgePill: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: FONTS.headingBold,
    fontSize: 21,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  description: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 6,
  },
  footer: {
    paddingHorizontal: 24,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.gold,
  },
  dotInactive: {
    width: 6,
  },
  primaryBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontFamily: FONTS.headingBold,
    fontSize: 15,
    color: COLORS.obsidian,
    letterSpacing: 0.2,
  }
});
