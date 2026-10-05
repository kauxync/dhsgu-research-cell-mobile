import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../api/client';

export default function StudentHomeScreen({ navigation }) {
  const { user, login, logout } = useAuth();
  const { theme, isDark } = useTheme();
  const [researchers, setResearchers] = useState([]);
  const [publications, setPublications] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [resRes, pubRes, confRes] = await Promise.all([
        api.getResearchers(),
        api.getPublications(),
        api.getConferences()
      ]);
      if (resRes?.success) setResearchers(resRes.data);
      if (pubRes?.success) setPublications(pubRes.data);
      if (confRes?.success) setConferences(confRes.data);
    } catch (e) {
      console.warn('Error loading student data', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleRoleSwitch = (newRole) => {
    if (newRole === 'professor') {
      login('pssingh@dhsgsu.edu.in', 'password', 'professor', 'Dr. Pangambam Sendash Singh', 'DCSA');
    } else if (newRole === 'scholar') {
      login('neha.dcsa.phd@dhsgsu.edu.in', 'password', 'scholar', 'Neha Richhariya (Ph.D. Scholar)', 'DCSA');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Header title="Student Innovation Hub" subtitle="DHSGSU Learning & Labs" navigation={navigation} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.cyan]} />}
      >
        {/* Student Hero Banner */}
        <View style={[styles.heroBanner, { backgroundColor: isDark ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.08)', borderColor: isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.25)' }]}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIconCircle}>
              <Ionicons name="sparkles" size={24} color="#000" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>Student Project & Seminar Launchpad</Text>
              <Text style={[styles.heroSub, { color: theme.textSecondary }]}>Connect with professors, discover open lab projects, and master research papers.</Text>
            </View>
          </View>
          <View style={styles.heroActionsRow}>
            <TouchableOpacity 
              style={styles.heroBtnCyan}
              onPress={() => navigation.navigate('Chatbot', { query: 'Suggest top final year project ideas in AI, IoT and web tech' })}
            >
              <Ionicons name="chatbubbles" size={15} color="#000" style={{ marginRight: 6 }} />
              <Text style={styles.heroBtnCyanText}>AI Topic Ideas</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.heroBtnOutline, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
              onPress={() => navigation.navigate('StudentMentorsTab')}
            >
              <Text style={[styles.heroBtnOutlineText, { color: theme.textPrimary }]}>Find Guide</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Student Quick Action Grid */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>⚡ Student Exploration Shortcuts</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity 
            style={[styles.quickCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('StudentMentorsTab')}
          >
            <View style={[styles.quickIconBox, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
              <Ionicons name="people" size={22} color={COLORS.cyan} />
            </View>
            <Text style={[styles.quickTitle, { color: theme.textPrimary }]}>Faculty Guides</Text>
            <Text style={[styles.quickSub, { color: theme.textMuted }]}>21 Professors in 5 Depts</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('StudentPapersTab')}
          >
            <View style={[styles.quickIconBox, { backgroundColor: 'rgba(37, 99, 235, 0.15)' }]}>
              <Ionicons name="book-outline" size={22} color={COLORS.royalBlue} />
            </View>
            <Text style={[styles.quickTitle, { color: theme.textPrimary }]}>Paper Digests</Text>
            <Text style={[styles.quickSub, { color: theme.textMuted }]}>19 Peer-Reviewed Works</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('StudentInternshipsTab')}
          >
            <View style={[styles.quickIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <Ionicons name="briefcase-outline" size={22} color={COLORS.purple} />
            </View>
            <Text style={[styles.quickTitle, { color: theme.textPrimary }]}>Lab Internships</Text>
            <Text style={[styles.quickSub, { color: theme.textMuted }]}>Openings & Hackathons</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <View style={[styles.quickIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="hardware-chip-outline" size={22} color={COLORS.emerald} />
            </View>
            <Text style={[styles.quickTitle, { color: theme.textPrimary }]}>AI Paper Tutor</Text>
            <Text style={[styles.quickSub, { color: theme.textMuted }]}>Explain Jargon in Simple Words</Text>
          </TouchableOpacity>
        </View>

        {/* Spotlight Faculty Guides */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>👨‍🏫 Top Department Guides</Text>
          <TouchableOpacity onPress={() => navigation.navigate('StudentMentorsTab')}>
            <Text style={styles.seeAllText}>All Guides →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
          {researchers.slice(0, 4).map((guide) => (
            <TouchableOpacity 
              key={guide.id}
              style={[styles.guideCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              onPress={() => navigation.navigate('ResearcherDetail', { id: guide.id, researcher: guide })}
            >
              <Image source={{ uri: guide.avatar_url }} style={styles.guideAvatar} />
              <Text style={[styles.guideName, { color: theme.textPrimary }]} numberOfLines={1}>{guide.name}</Text>
              <Text style={[styles.guideDept, { color: theme.textMuted }]} numberOfLines={1}>{guide.department_name}</Text>
              <View style={[styles.guideSpecialization, { backgroundColor: theme.inputBg }]}>
                <Text style={[styles.guideSpecText, { color: COLORS.cyan }]} numberOfLines={1}>
                  🎯 {guide.specialization?.split(',')[0]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Student Breakthrough Papers Feed */}
        <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>📚 Simplified Research Digests</Text>
          <TouchableOpacity onPress={() => navigation.navigate('StudentPapersTab')}>
            <Text style={styles.seeAllText}>Browse All →</Text>
          </TouchableOpacity>
        </View>
        {publications.slice(0, 3).map((pub) => (
          <TouchableOpacity 
            key={pub.id}
            style={[styles.paperFeedCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => {
              if (pub.doi) {
                const url = pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`;
                Linking.openURL(url).catch((e) => console.log(e));
              }
            }}
          >
            <View style={styles.paperHeader}>
              <View style={styles.q1Tag}>
                <Text style={styles.q1TagText}>{pub.indexing || 'SCI / Scopus'}</Text>
              </View>
              <Text style={[styles.paperYearText, { color: theme.textMuted }]}>📅 {pub.publication_year || 2024}</Text>
            </View>
            <Text style={[styles.paperTitleText, { color: theme.textPrimary }]}>{pub.title}</Text>
            <Text style={[styles.paperAuthorText, { color: theme.textSecondary }]}>
              ✍️ {pub.author_name || pub.researcher_name} • {pub.journal || pub.journal_or_publisher}
            </Text>
            <Text style={[styles.paperAbstractText, { color: theme.textMuted }]} numberOfLines={2}>
              {pub.abstract}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  studentProfileCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.cyan,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  studentBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  studentBadgeText: {
    color: COLORS.cyan,
    fontFamily: FONTS.header,
    fontSize: 9,
  },
  deptCodeText: {
    fontFamily: FONTS.body,
    fontSize: 10,
  },
  studentName: {
    fontFamily: FONTS.header,
    fontSize: 14,
  },
  studentSub: {
    fontFamily: FONTS.body,
    fontSize: 10,
    marginTop: 1,
  },
  settingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleSwitchBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  switchLabel: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    marginBottom: 6,
  },
  switchBtnsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  switchPillActive: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  switchPillActiveText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 10,
  },
  switchPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  switchPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
  },
  heroBanner: {
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    color: '#FFF',
    fontFamily: FONTS.header,
    fontSize: 14,
  },
  heroSub: {
    color: '#CBD5E1',
    fontFamily: FONTS.body,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroBtnCyan: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cyan,
    borderRadius: 8,
    paddingVertical: 9,
  },
  heroBtnCyanText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 11,
  },
  heroBtnOutline: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 9,
  },
  heroBtnOutlineText: {
    color: '#FFF',
    fontFamily: FONTS.header,
    fontSize: 11,
  },
  sectionTitle: {
    fontFamily: FONTS.header,
    fontSize: 13,
    marginBottom: 10,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  quickCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  quickIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickTitle: {
    fontFamily: FONTS.header,
    fontSize: 12,
  },
  quickSub: {
    fontFamily: FONTS.body,
    fontSize: 10,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    color: COLORS.cyan,
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
  },
  guideCard: {
    width: 140,
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  guideAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 6,
  },
  guideName: {
    fontFamily: FONTS.header,
    fontSize: 11,
    textAlign: 'center',
  },
  guideDept: {
    fontFamily: FONTS.body,
    fontSize: 9,
    textAlign: 'center',
    marginTop: 1,
  },
  guideSpecialization: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
    width: '100%',
  },
  guideSpecText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 8,
    textAlign: 'center',
  },
  paperFeedCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  paperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  q1Tag: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  q1TagText: {
    color: COLORS.cyan,
    fontFamily: FONTS.header,
    fontSize: 9,
  },
  paperYearText: {
    fontFamily: FONTS.body,
    fontSize: 10,
  },
  paperTitleText: {
    fontFamily: FONTS.header,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  paperAuthorText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    marginBottom: 4,
  },
  paperAbstractText: {
    fontFamily: FONTS.body,
    fontSize: 10,
    lineHeight: 14,
  },
});
