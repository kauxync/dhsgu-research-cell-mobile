import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import Header from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';

const INTERNSHIPS_DATA = [
  {
    id: 'int-1',
    title: 'Computer Vision & AI Lab Assistant',
    department: 'DCSA',
    mentor: 'Dr. Pangambam Sendash Singh',
    stipend: '₹8,000 / month',
    duration: '3 Months (Winter 2026)',
    deadline: '15 Oct 2026',
    status: 'Open',
    tags: ['Python', 'PyTorch', 'Image Processing'],
    description: 'Work on deep learning models for biomedical imaging. Selected students will co-author a workshop publication.',
  },
  {
    id: 'int-2',
    title: 'Condensed Matter Physics Simulation Trainee',
    department: 'Physics',
    mentor: 'Prof. Ranveer Kumar',
    stipend: '₹7,500 / month',
    duration: '6 Months',
    deadline: '20 Oct 2026',
    status: 'Open',
    tags: ['MATLAB', 'Quantum Espresso', 'DFT'],
    description: 'Computational modeling of novel 2D materials for solar energy harvesting. Open to B.Sc./M.Sc. Physics students.',
  },
  {
    id: 'int-3',
    title: 'Graph Theory & Network Optimization Intern',
    department: 'Mathematics',
    mentor: 'Prof. R. K. Gangele',
    stipend: '₹6,000 / month',
    duration: '2 Months',
    deadline: '18 Oct 2026',
    status: 'Open',
    tags: ['Algorithms', 'C++', 'Topology'],
    description: 'Investigate graph coloring heuristics and spectral graph theory applications in cyber network security.',
  },
  {
    id: 'int-4',
    title: 'Medicinal Phytochemistry Lab Apprentice',
    department: 'Botany',
    mentor: 'Prof. A. N. Rai',
    stipend: '₹7,000 / month',
    duration: '4 Months',
    deadline: '25 Oct 2026',
    status: 'Open',
    tags: ['HPLC', 'Plant Extracts', 'Spectroscopy'],
    description: 'Assist in screening Bundelkhand region medicinal flora for bioactive antimicrobial compounds.',
  },
  {
    id: 'int-5',
    title: 'Organic Nanomaterials Synthesis Fellow',
    department: 'Chemistry',
    mentor: 'Prof. S. T. Nandeshwar',
    stipend: '₹8,500 / month',
    duration: '6 Months',
    deadline: '30 Oct 2026',
    status: 'Open',
    tags: ['Green Chemistry', 'Nanotech', 'Catalysis'],
    description: 'Synthesis of recyclable nanocatalysts for clean chemical transformations under SERB sponsored initiative.',
  },
];

const HACKATHONS_DATA = [
  {
    id: 'hack-1',
    title: 'NCRTCA 2026 Student Research Track',
    organizer: 'Dept. of Computer Science & Applications, DHSGSU',
    date: 'Nov 12-14, 2026',
    prize: '₹50,000 Cash Prize + Certificate',
    badge: 'University Flagship',
    link: 'https://dhsgsu.edu.in/conferences/ncrtca2026',
  },
  {
    id: 'hack-2',
    title: 'Smart India Hackathon 2026 - DHSGSU Internal Selection',
    organizer: 'MoE Innovation Cell & DHSGSU IIC',
    date: 'Oct 28, 2026',
    prize: 'Direct Nomination to Grand Finale',
    badge: 'National',
    link: 'https://sih.gov.in',
  },
];

export default function StudentInternshipsScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('labs'); // 'labs' or 'hackathons'
  const [appliedIds, setAppliedIds] = useState([]);

  const handleApply = (id, title) => {
    if (appliedIds.includes(id)) {
      Alert.alert('Already Applied', `You have already sent your profile for ${title}. The faculty mentor will review your CGPA and reach out via university email.`);
      return;
    }
    setAppliedIds([...appliedIds, id]);
    Alert.alert(
      'Application Submitted! 🎉',
      `Your student application for "${title}" has been transmitted to the department coordinator. Check your DHSGSU student inbox for interview scheduling.`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Header
        title="Student Launchpad"
        subtitle="Lab Internships & Hackathons"
        rightAction={() => navigation.navigate('Notifications')}
        rightIcon="notifications-outline"
      />

      {/* Mode Selector Tabs */}
      <View style={[styles.tabBar, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'labs' && styles.tabButtonActive]}
          onPress={() => setActiveTab('labs')}
        >
          <Ionicons
            name="flask"
            size={16}
            color={activeTab === 'labs' ? '#000' : theme.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabButtonText, { color: theme.textMuted }, activeTab === 'labs' && styles.tabButtonTextActive]}>
            Faculty Lab Openings ({INTERNSHIPS_DATA.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'hackathons' && styles.tabButtonActive]}
          onPress={() => setActiveTab('hackathons')}
        >
          <Ionicons
            name="trophy"
            size={16}
            color={activeTab === 'hackathons' ? '#000' : theme.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabButtonText, { color: theme.textMuted }, activeTab === 'hackathons' && styles.tabButtonTextActive]}>
            Hackathons & Events
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'labs' ? (
          <>
            <View style={[styles.bannerCard, { backgroundColor: isDark ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.08)', borderColor: isDark ? 'rgba(6, 182, 212, 0.25)' : 'rgba(6, 182, 212, 0.2)' }]}>
              <Ionicons name="school" size={24} color={COLORS.cyan} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.bannerTitle, { color: theme.textPrimary }]}>Earn While You Learn</Text>
                <Text style={[styles.bannerSubtitle, { color: theme.textSecondary }]}>
                  Apply directly to DHSGSU department research labs and gain hands-on co-authorship experience.
                </Text>
              </View>
            </View>

            {INTERNSHIPS_DATA.map((item) => {
              const isApplied = appliedIds.includes(item.id);
              return (
                <View
                  key={item.id}
                  style={[styles.card, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.deptBadge}>
                      <Text style={styles.deptBadgeText}>{item.department}</Text>
                    </View>
                    <View style={styles.deadlineBadge}>
                      <Ionicons name="time-outline" size={12} color="#F59E0B" style={{ marginRight: 4 }} />
                      <Text style={styles.deadlineText}>Deadline: {item.deadline}</Text>
                    </View>
                  </View>

                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                  
                  <View style={styles.mentorRow}>
                    <Ionicons name="person-outline" size={14} color={COLORS.cyan} style={{ marginRight: 6 }} />
                    <Text style={styles.mentorName}>Guide: {item.mentor}</Text>
                  </View>

                  <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>{item.description}</Text>

                  {/* Tags */}
                  <View style={styles.tagRow}>
                    {item.tags.map((t, idx) => (
                      <View key={idx} style={[styles.tag, { backgroundColor: theme.inputBg }]}>
                        <Text style={[styles.tagText, { color: theme.textMuted }]}>{t}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Stipend & Duration */}
                  <View style={[styles.metaBox, { backgroundColor: theme.inputBg }]}>
                    <View style={styles.metaItem}>
                      <Text style={[styles.metaLabel, { color: theme.textMuted }]}>STIPEND</Text>
                      <Text style={[styles.metaValue, { color: theme.textPrimary }]}>{item.stipend}</Text>
                    </View>
                    <View style={[styles.metaDivider, { backgroundColor: theme.border }]} />
                    <View style={styles.metaItem}>
                      <Text style={[styles.metaLabel, { color: theme.textMuted }]}>DURATION</Text>
                      <Text style={[styles.metaValue, { color: theme.textPrimary }]}>{item.duration}</Text>
                    </View>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity
                    style={[styles.applyButton, isApplied && styles.appliedButton]}
                    onPress={() => handleApply(item.id, item.title)}
                  >
                    <Ionicons
                      name={isApplied ? 'checkmark-circle' : 'paper-plane'}
                      size={16}
                      color={isApplied ? COLORS.emerald : '#000'}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.applyButtonText, isApplied && styles.appliedButtonText]}>
                      {isApplied ? 'Application Submitted' : 'One-Tap Apply with Profile'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        ) : (
          <>
            <View style={styles.bannerCard}>
              <Ionicons name="flame" size={24} color="#F59E0B" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>Flagship Innovation Contests</Text>
                <Text style={styles.bannerSubtitle}>
                  Participate in national and university level technical competitions to build your research portfolio.
                </Text>
              </View>
            </View>

            {HACKATHONS_DATA.map((hack) => (
              <View
                key={hack.id}
                style={[styles.card, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.deptBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <Text style={[styles.deptBadgeText, { color: '#F59E0B' }]}>{hack.badge}</Text>
                  </View>
                  <View style={styles.deadlineBadge}>
                    <Ionicons name="calendar-outline" size={12} color={COLORS.cyan} style={{ marginRight: 4 }} />
                    <Text style={[styles.deadlineText, { color: COLORS.cyan }]}>{hack.date}</Text>
                  </View>
                </View>

                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{hack.title}</Text>
                <Text style={[styles.organizerText, { color: theme.textSecondary }]}>{hack.organizer}</Text>

                <View style={styles.prizeBox}>
                  <Ionicons name="ribbon" size={18} color="#F59E0B" style={{ marginRight: 8 }} />
                  <Text style={styles.prizeText}>{hack.prize}</Text>
                </View>

                <TouchableOpacity
                  style={styles.hackathonBtn}
                  onPress={() => {
                    Linking.openURL(hack.link).catch(() => {
                      Alert.alert('Info', `Registration portal for ${hack.title} opens shortly.`);
                    });
                  }}
                >
                  <Text style={styles.hackathonBtnText}>Register Team / View Guidelines</Text>
                  <Ionicons name="open-outline" size={15} color="#000" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: COLORS.cyan,
  },
  tabButtonText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
  },
  tabButtonTextActive: {
    color: '#000',
    fontFamily: FONTS.header,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    borderColor: 'rgba(6, 182, 212, 0.25)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: FONTS.header,
    marginBottom: 2,
  },
  bannerSubtitle: {
    color: '#CBD5E1',
    fontSize: 11,
    fontFamily: FONTS.body,
    lineHeight: 16,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deptBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deptBadgeText: {
    color: COLORS.cyan,
    fontFamily: FONTS.header,
    fontSize: 10,
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deadlineText: {
    color: '#F59E0B',
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: FONTS.header,
    lineHeight: 21,
    marginBottom: 6,
  },
  mentorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mentorName: {
    color: COLORS.cyan,
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
  },
  descriptionText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  metaBox: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaDivider: {
    width: 1,
  },
  metaLabel: {
    fontSize: 8,
    fontFamily: FONTS.header,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cyan,
    borderRadius: 8,
    paddingVertical: 10,
  },
  applyButtonText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 12,
  },
  appliedButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  appliedButtonText: {
    color: COLORS.emerald,
  },
  organizerText: {
    fontSize: 12,
    fontFamily: FONTS.body,
    marginBottom: 10,
  },
  prizeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  prizeText: {
    color: '#F59E0B',
    fontFamily: FONTS.header,
    fontSize: 12,
    flex: 1,
  },
  hackathonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cyan,
    borderRadius: 8,
    paddingVertical: 10,
  },
  hackathonBtnText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 12,
  },
});
