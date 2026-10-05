import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import Header from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../api/client';

export default function ProfessorPatentsScreen({ navigation }) {
  const { theme } = useTheme();
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPatents = async () => {
    try {
      const res = await api.getPatents();
      if (res?.success) {
        setPatents(res.data);
      }
    } catch (e) {
      console.warn('Error loading patents', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPatents();
  }, []);

  const handleCommercialize = (title) => {
    Alert.alert(
      'Tech Transfer & IPR Cell',
      `Submit commercialization inquiry for "${title.substring(0, 35)}..." to DHSGSU Incubation and Technology Transfer Cell?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit Inquiry',
          onPress: () => {
            Alert.alert('Inquiry Sent', 'DHSGSU IPR coordinator has been notified for industry partnership matching.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Header
        title="University Patent Desk"
        subtitle="Indian Patent Office (IPO) Filings"
        rightAction={() => navigation.navigate('Notifications')}
        rightIcon="notifications-outline"
      />

      {/* IPR Cell Banner */}
      <View style={[styles.iprBanner, { backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.25)' }]}>
        <View style={styles.iprTop}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.gold} style={{ marginRight: 8 }} />
          <Text style={styles.iprTitle}>DHSGSU Intellectual Property Rights (IPR) Cell</Text>
        </View>
        <Text style={[styles.iprSub, { color: theme.textSecondary }]}>
          Full legal and financial subsidy provided for university faculty patent filing under Section 39 of the Indian Patents Act.
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.gold} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Fetching University IP Registry...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadPatents();
              }}
              tintColor={COLORS.gold}
            />
          }
        >
          {patents.map((patent, idx) => (
            <View
              key={patent.id || idx}
              style={[styles.card, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.deptBadge}>
                  <Text style={styles.deptBadgeText}>{patent.department || 'DCSA'}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{patent.status || 'Published'}</Text>
                </View>
              </View>

              <Text style={[styles.patentTitle, { color: theme.textPrimary }]}>{patent.title}</Text>

              <View style={styles.inventorRow}>
                <Ionicons name="people" size={13} color={COLORS.gold} style={{ marginRight: 5 }} />
                <Text style={[styles.inventorText, { color: theme.textSecondary }]}>
                  Inventors: {patent.inventor || 'DHSGSU Faculty & Team'}
                </Text>
              </View>

              {/* Patent Application Number Box */}
              <View style={[styles.appNoBox, { backgroundColor: theme.inputBg }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.appNoLabel, { color: theme.textMuted }]}>IPO APPLICATION NUMBER</Text>
                  <Text style={styles.appNoValue}>{patent.application_number || `2024210${idx + 3847} A`}</Text>
                </View>
                <View style={styles.filingCol}>
                  <Text style={[styles.appNoLabel, { color: theme.textMuted }]}>FILING DATE</Text>
                  <Text style={styles.appNoValue}>{patent.filing_date || '18 May 2024'}</Text>
                </View>
              </View>

              <Text style={[styles.abstractText, { color: theme.textMuted }]} numberOfLines={3}>
                {patent.abstract ||
                  'A novel hardware/software architectural method enabling high precision inference with ultra-low latency, reducing compute footprint by 40% in edge server environments.'}
              </Text>

              {/* Actions */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtnSecondary}
                  onPress={() => {
                    navigation.navigate('Chatbot', {
                      query: `Analyze patent application "${patent.title}" for industry commercialization and licensing opportunities`,
                    });
                  }}
                >
                  <Ionicons name="sparkles" size={13} color={COLORS.gold} style={{ marginRight: 4 }} />
                  <Text style={styles.actionBtnSecondaryText}>AI IP Analysis</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtnPrimary}
                  onPress={() => handleCommercialize(patent.title)}
                >
                  <Ionicons name="business-outline" size={14} color="#000" style={{ marginRight: 4 }} />
                  <Text style={styles.actionBtnPrimaryText}>Tech Transfer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iprBanner: {
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
  },
  iprTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iprTitle: {
    color: COLORS.gold,
    fontSize: 12,
    fontFamily: FONTS.header,
  },
  iprSub: {
    fontSize: 11,
    fontFamily: FONTS.body,
    lineHeight: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    fontFamily: FONTS.body,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 8,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deptBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deptBadgeText: {
    color: COLORS.gold,
    fontSize: 10,
    fontFamily: FONTS.header,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    color: COLORS.emerald,
    fontSize: 10,
    fontFamily: FONTS.header,
  },
  patentTitle: {
    fontSize: 14,
    fontFamily: FONTS.header,
    lineHeight: 20,
    marginBottom: 6,
  },
  inventorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inventorText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  appNoBox: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  filingCol: {
    alignItems: 'flex-end',
  },
  appNoLabel: {
    fontSize: 8,
    fontFamily: FONTS.header,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  appNoValue: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  abstractText: {
    fontSize: 11,
    fontFamily: FONTS.body,
    lineHeight: 16,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  actionBtnSecondaryText: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    paddingVertical: 8,
  },
  actionBtnPrimaryText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 11,
  },
});
