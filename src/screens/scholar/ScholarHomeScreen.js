import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../api/client';

export default function ScholarHomeScreen({ navigation }) {
  const { user, login, logout } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [recentPapers, setRecentPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [statsRes, pubRes] = await Promise.all([
        api.getStats(),
        api.getPublications(),
      ]);
      if (statsRes?.success) setStats(statsRes.data);
      if (pubRes?.success) setRecentPapers(pubRes.data.slice(0, 4));
    } catch (e) {
      console.warn('Error loading scholar dashboard data', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleSwitch = (newRole) => {
    if (newRole === 'student') {
      login('student@dhsgsu.edu.in', 'password', 'student', 'Student Portal User', 'DCSA');
    } else if (newRole === 'professor') {
      login('pssingh@dhsgsu.edu.in', 'password', 'professor', 'Dr. Pangambam Sendash Singh', 'DCSA');
    }
  };

  const phdMilestones = [
    { title: 'Ph.D. Coursework & RAC Exam', status: 'Completed', date: 'Dec 2024', grade: '9.2 CGPA', completed: true },
    { title: 'Comprehensive Viva & RDC Presentation', status: 'Approved', date: 'May 2025', grade: 'Pass', completed: true },
    { title: '2 Q1/Scopus Journal Publications', status: 'In Progress (1/2 Published)', date: 'Target: Nov 2026', grade: '1 Active Review', completed: false, current: true },
    { title: 'Pre-Submission Seminar & Final Thesis', status: 'Pending Papers', date: 'Target: May 2027', grade: 'Upcoming', completed: false },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Header
        title="Scholar Thesis Desk"
        subtitle={`Ph.D. Scholar Workspace • ${user?.department || 'DCSA'}`}
        rightAction={() => navigation.navigate('Notifications')}
        rightIcon="notifications-outline"
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
            tintColor={COLORS.emerald}
          />
        }
      >
        {/* Scholar Research Metrics Card */}
        <View style={[styles.heroCard, { backgroundColor: theme.surfaceCard, borderColor: 'rgba(16, 185, 129, 0.25)' }]}>
          <View style={styles.heroTop}>
            <View style={styles.avatarBox}>
              <Ionicons name="school" size={22} color="#000" />
            </View>
            <View style={styles.heroInfo}>
              <Text style={[styles.scholarName, { color: theme.textPrimary }]}>CSIR / DST Doctoral R&D Metrics</Text>
              <Text style={[styles.scholarTopic, { color: theme.textSecondary }]}>
                Track publications, citation velocity & fellowship disbursements
              </Text>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={[styles.metricsGrid, { backgroundColor: theme.inputBg }]}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: theme.textPrimary }]}>142</Text>
              <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Total Citations</Text>
              <View style={styles.growthBadge}>
                <Ionicons name="arrow-up" size={10} color={COLORS.emerald} />
                <Text style={styles.growthText}>+48 this yr</Text>
              </View>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: theme.textPrimary }]}>5</Text>
              <Text style={[styles.metricLabel, { color: theme.textMuted }]}>h-Index</Text>
              <Text style={[styles.subMeta, { color: theme.textMuted }]}>Scopus Indexed</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: theme.textPrimary }]}>₹37,000</Text>
              <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Monthly JRF</Text>
              <Text style={[styles.subMeta, { color: theme.textMuted }]}>CSIR Active</Text>
            </View>
          </View>
        </View>

        {/* 4-Stage Ph.D. Degree Milestone Tracker */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="git-commit-outline" size={18} color={COLORS.emerald} style={{ marginRight: 6 }} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Ph.D. Graduation Roadmap (Stage 3 of 4)</Text>
          </View>
          <Text style={styles.progressPercent}>65% Complete</Text>
        </View>

        <View style={[styles.milestoneCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
          {phdMilestones.map((item, idx) => (
            <View key={idx} style={styles.milestoneRow}>
              <View style={styles.timelineCol}>
                <View
                  style={[
                    styles.milestoneDot,
                    { backgroundColor: theme.inputBg },
                    item.completed && styles.milestoneDotCompleted,
                    item.current && styles.milestoneDotCurrent,
                  ]}
                >
                  <Ionicons
                    name={item.completed ? 'checkmark' : item.current ? 'time' : 'ellipse'}
                    size={11}
                    color={item.completed ? '#000' : item.current ? COLORS.emerald : theme.textMuted}
                  />
                </View>
                {idx !== phdMilestones.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      { backgroundColor: theme.border },
                      item.completed && styles.timelineLineCompleted,
                    ]}
                  />
                )}
              </View>
              <View style={styles.milestoneInfo}>
                <View style={styles.milestoneHeadingRow}>
                  <Text
                    style={[
                      styles.milestoneHeading,
                      { color: theme.textMuted },
                      item.current && { color: COLORS.emerald },
                      item.completed && { color: theme.textPrimary },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.milestoneStatus,
                      { color: theme.textMuted },
                      item.completed && styles.statusCompleted,
                      item.current && styles.statusCurrent,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
                <Text style={[styles.milestoneSub, { color: theme.textMuted }]}>
                  {item.date} • {item.grade}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Scholar Tool Access */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Scholar Research Tools</Text>
        <View style={styles.toolsGrid}>
          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('FellowshipsTab')}
          >
            <View style={[styles.toolIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="cash-outline" size={20} color={COLORS.emerald} />
            </View>
            <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>Fellowships & Grants</Text>
            <Text style={[styles.toolSub, { color: theme.textMuted }]}>CSIR, SERB, MPCOST</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('ManuscriptsTab')}
          >
            <View style={[styles.toolIconWrap, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
              <Ionicons name="document-attach-outline" size={20} color={COLORS.cyan} />
            </View>
            <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>Manuscripts & Approvals</Text>
            <Text style={[styles.toolSub, { color: theme.textMuted }]}>Supervisor Signoff</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('LibraryTab')}
          >
            <View style={[styles.toolIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="library-outline" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>DOI & BibTeX Library</Text>
            <Text style={[styles.toolSub, { color: theme.textMuted }]}>Export DHSGSU Citations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <View style={[styles.toolIconWrap, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <Ionicons name="sparkles-outline" size={20} color="#C084FC" />
            </View>
            <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>Scholar AI Assistant</Text>
            <Text style={[styles.toolSub, { color: theme.textMuted }]}>Literature & Abstract Polish</Text>
          </TouchableOpacity>
        </View>

        {/* Recent DHSGSU Department Publications */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>University Literature Radar</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LibraryTab')}>
            <Text style={styles.seeAllText}>View All DOI</Text>
          </TouchableOpacity>
        </View>

        {recentPapers.map((paper, idx) => (
          <TouchableOpacity
            key={paper.id || idx}
            style={[styles.pubCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => {
              if (paper.doi) {
                const url = paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`;
                Linking.openURL(url).catch((e) => console.log(e));
              }
            }}
          >
            <View style={styles.pubHeader}>
              <View style={styles.deptChip}>
                <Text style={styles.deptChipText}>{paper.department}</Text>
              </View>
              <Text style={[styles.pubYear, { color: theme.textMuted }]}>{paper.year || 2024}</Text>
            </View>
            <Text style={[styles.pubTitle, { color: theme.textPrimary }]} numberOfLines={2}>{paper.title}</Text>
            <Text style={[styles.pubAuthor, { color: theme.textSecondary }]} numberOfLines={1}>By {paper.author_name} • {paper.journal}</Text>
            <View style={[styles.pubBottom, { borderTopColor: theme.border }]}>
              <Text style={styles.doiText} numberOfLines={1}>DOI: {paper.doi || 'Indexed'}</Text>
              <Ionicons name="open-outline" size={14} color={COLORS.emerald} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roleSwitcherBanner: {
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    borderRadius: 12,
    padding: 10,
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  roleDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.emerald,
    marginRight: 6,
  },
  roleBadgeText: {
    color: COLORS.emerald,
    fontSize: 10,
    fontFamily: FONTS.header,
    letterSpacing: 0.5,
  },
  roleButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  switchBtnText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 10,
  },
  heroCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  heroTop: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heroInfo: {
    flex: 1,
  },
  scholarName: {
    fontSize: 15,
    fontFamily: FONTS.header,
  },
  scholarGuide: {
    color: COLORS.emerald,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    marginTop: 2,
  },
  scholarTopic: {
    fontSize: 11,
    fontFamily: FONTS.body,
    marginTop: 4,
    lineHeight: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: FONTS.header,
  },
  metricLabel: {
    fontSize: 9,
    fontFamily: FONTS.bodyBold,
    marginTop: 2,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  growthText: {
    color: COLORS.emerald,
    fontSize: 9,
    fontFamily: FONTS.bodyBold,
    marginLeft: 2,
  },
  subMeta: {
    fontSize: 8,
    fontFamily: FONTS.body,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: FONTS.header,
  },
  progressPercent: {
    color: COLORS.emerald,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  milestoneCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  milestoneRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timelineCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 10,
  },
  milestoneDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneDotCompleted: {
    backgroundColor: COLORS.emerald,
  },
  milestoneDotCurrent: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1.5,
    borderColor: COLORS.emerald,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: COLORS.emerald,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  milestoneHeading: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    flex: 1,
    marginRight: 6,
  },
  milestoneStatus: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  statusCompleted: {
    color: COLORS.emerald,
  },
  statusCurrent: {
    color: '#F59E0B',
  },
  milestoneSub: {
    fontSize: 10,
    fontFamily: FONTS.body,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
    marginTop: 8,
  },
  toolCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  toolIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolTitle: {
    fontSize: 12,
    fontFamily: FONTS.header,
    marginBottom: 2,
  },
  toolSub: {
    fontSize: 10,
    fontFamily: FONTS.body,
  },
  seeAllText: {
    color: COLORS.emerald,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  pubCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  pubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  deptChip: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deptChipText: {
    color: COLORS.emerald,
    fontSize: 9,
    fontFamily: FONTS.header,
  },
  pubYear: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  pubTitle: {
    fontSize: 13,
    fontFamily: FONTS.header,
    lineHeight: 18,
    marginBottom: 4,
  },
  pubAuthor: {
    fontSize: 11,
    fontFamily: FONTS.body,
    marginBottom: 6,
  },
  pubBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 6,
  },
  doiText: {
    color: COLORS.emerald,
    fontSize: 10,
    fontFamily: FONTS.body,
    flex: 1,
    marginRight: 6,
  },
});
