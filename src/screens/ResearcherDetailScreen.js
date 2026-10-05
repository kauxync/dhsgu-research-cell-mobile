import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { api } from '../api/client';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ResearcherDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { id, researcher: initialData } = route.params;
  const [data, setData] = useState(initialData || null);
  const [loading, setLoading] = useState(true);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    async function loadFullProfile() {
      try {
        const res = await api.getResearcherById(id);
        if (res && res.success) {
          setData(res.data);
        }
      } catch (e) {
        console.warn('Error loading researcher detail', e);
      } finally {
        setLoading(false);
      }
    }
    loadFullProfile();
  }, [id]);

  if (loading && !data) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={COLORS.cyan} />
      </View>
    );
  }

  const handleOpenLink = (url) => {
    if (url) Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: theme.surface, borderBottomColor: theme.border, paddingTop: Math.max(insets.top + 6, 16) }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }]} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: theme.textPrimary }]}>Faculty Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 24, 40) }}>
        {/* Luxury Profile Header Card */}
        <View style={[styles.profileHeaderCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
              style={styles.avatarLarge}
            />
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={14} color={COLORS.obsidian} />
            </View>
          </View>
          <Text style={[styles.nameLarge, { color: theme.textPrimary }]}>{data.name}</Text>
          <Text style={styles.designationLarge}>{data.designation}</Text>
          <Text style={[styles.deptLarge, { color: theme.textSecondary }]}>🏛️ {data.department_name}</Text>

          {/* Luxury Metric Counters Row */}
          <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
            <View style={styles.statBox}>
              <Text style={styles.statValGold}>{data.h_index}</Text>
              <Text style={[styles.statLbl, { color: theme.textMuted }]}>H-Index</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: theme.textPrimary }]}>{data.citations_count}</Text>
              <Text style={[styles.statLbl, { color: theme.textMuted }]}>Citations</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: theme.textPrimary }]}>{data.publications?.length || 0}</Text>
              <Text style={[styles.statLbl, { color: theme.textMuted }]}>Papers</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: theme.textPrimary }]}>{data.patents?.length || 0}</Text>
              <Text style={[styles.statLbl, { color: theme.textMuted }]}>Patents</Text>
            </View>
          </View>
        </View>

        {/* Academic Bio & Specialization */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Research Expertise & Bio</Text>
          <Text style={[styles.bioText, { color: theme.textSecondary }]}>{data.bio || 'Distinguished academic researcher at Dr. Harisingh Gour Vishwavidyalaya.'}</Text>
          
          <View style={[styles.specHighlight, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)' }]}>
            <Text style={[styles.specHighlightText, { color: theme.textLight }]}>🎯 Specialization: {data.specialization}</Text>
          </View>

          {/* Identifiers Row (ORCID / Scopus) */}
          <View style={styles.idRow}>
            {data.orcid_id && (
              <View style={[styles.idChip, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)', borderColor: theme.border }]}>
                <Ionicons name="finger-print" size={14} color={COLORS.emerald} style={{ marginRight: 4 }} />
                <Text style={[styles.idText, { color: theme.textLight }]}>ORCID: {data.orcid_id}</Text>
              </View>
            )}
            {data.scopus_id && (
              <View style={[styles.idChip, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)', borderColor: theme.border }]}>
                <Ionicons name="globe-outline" size={14} color={COLORS.cyan} style={{ marginRight: 4 }} />
                <Text style={[styles.idText, { color: theme.textLight }]}>Scopus ID: {data.scopus_id}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Publications by this Researcher */}
        {data.publications && data.publications.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Indexed Publications ({data.publications.length})</Text>
            {data.publications.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.subItemCard, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)', borderColor: theme.border }]}
                onPress={() => p.download_url && handleOpenLink(p.download_url)}
              >
                <View style={styles.subItemHeader}>
                  <Text style={[styles.subItemYear, { color: theme.textMuted }]}>📅 {p.publication_year}</Text>
                  <Text style={styles.subItemIndex}>{p.indexing || 'SCI / Scopus'}</Text>
                </View>
                <Text style={[styles.subItemTitle, { color: theme.textPrimary }]}>{p.title}</Text>
                <Text style={[styles.subItemJournal, { color: theme.textSecondary }]}>🏛️ {p.journal_or_publisher}</Text>
                {p.doi && <Text style={styles.subItemDoi}>DOI: {p.doi} ↗</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Patents by this Researcher */}
        {data.patents && data.patents.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Intellectual Property & Patents ({data.patents.length})</Text>
            {data.patents.map((pat) => (
              <View key={pat.id} style={[styles.subItemCard, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)', borderColor: theme.border }]}>
                <View style={styles.subItemHeader}>
                  <Text style={styles.patentBadge}>🛡️ {pat.status}</Text>
                  <Text style={[styles.subItemYear, { color: theme.textMuted }]}>No: {pat.patent_number}</Text>
                </View>
                <Text style={[styles.subItemTitle, { color: theme.textPrimary }]}>{pat.title}</Text>
                <Text style={[styles.subItemJournal, { color: theme.textSecondary }]}>Jurisdiction: {pat.jurisdiction || 'India / IPO'}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileHeaderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: COLORS.cyan,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  nameLarge: {
    fontFamily: FONTS.headingBold,
    fontSize: 17,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  designationLarge: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    color: COLORS.cyan,
    marginTop: 2,
    textAlign: 'center',
  },
  deptLarge: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  statBox: {
    alignItems: 'center',
  },
  statValGold: {
    fontFamily: FONTS.headingBold,
    fontSize: 16,
    color: COLORS.gold,
  },
  statVal: {
    fontFamily: FONTS.headingBold,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  statLbl: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionHeading: {
    fontFamily: FONTS.headingBold,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  bioText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  specHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  specHighlightText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textLight,
  },
  idRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  idChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  idText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 10,
    color: COLORS.textLight,
  },
  subItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  subItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subItemYear: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  subItemIndex: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.cyan,
  },
  patentBadge: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.gold,
  },
  subItemTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 16,
    marginBottom: 2,
  },
  subItemJournal: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  subItemDoi: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.cyan,
    marginTop: 4,
  }
});
