import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../api/client';

export default function ProfessorHomeScreen({ navigation }) {
  const { user, login, logout } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [funding, setFunding] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [statsRes, fundRes, propRes] = await Promise.all([
        api.getStats(),
        api.getFunding(),
        api.getProposals(),
      ]);
      if (statsRes?.success) setStats(statsRes.data);
      if (fundRes?.success) setFunding(fundRes.data);
      if (propRes?.success) setProposals(propRes.data);
    } catch (e) {
      console.warn('Error loading professor dashboard data', e);
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
    } else if (newRole === 'scholar') {
      login('neha.dcsa.phd@dhsgsu.edu.in', 'password', 'scholar', 'Neha Richhariya (Ph.D. Scholar)', 'DCSA');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Header
        title="PI Governance Desk"
        subtitle={`Principal Investigator • ${user?.department || 'DCSA'}`}
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
            tintColor={COLORS.gold}
          />
        }
      >
        {/* Professor Executive R&D Portfolio */}
        <View style={[styles.heroCard, { backgroundColor: theme.surfaceCard, borderColor: 'rgba(245, 158, 11, 0.25)' }]}>
          {/* R&D Capital Portfolio Summary */}
          <View style={[styles.portfolioBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.25)' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="ribbon" size={18} color={COLORS.gold} style={{ marginRight: 6 }} />
              <Text style={styles.portfolioLabel}>ACTIVE SANCTIONED R&D PORTFOLIO</Text>
            </View>
            <Text style={[styles.portfolioValue, { color: theme.textPrimary }]}>₹2,65,50,000</Text>
            <Text style={[styles.portfolioSub, { color: theme.textMuted }]}>Sponsored by DST-SERB, UGC & MPCOST Grants</Text>
          </View>

          {/* 3 Executive Metric Pillars */}
          <View style={[styles.metricsGrid, { backgroundColor: theme.inputBg }]}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: theme.textPrimary }]}>4</Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Ph.D. Scholars</Text>
              <Text style={styles.metricSub}>2 Synopses Ready</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: theme.textPrimary }]}>5</Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>IPO Patents</Text>
              <Text style={styles.metricSub}>3 Published</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: theme.textPrimary }]}>19</Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Q1 Papers</Text>
              <Text style={styles.metricSub}>h-index: 18</Text>
            </View>
          </View>
        </View>

        {/* PI Governance Actions Grid */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Institutional Governance Modules</Text>
        <View style={styles.toolsGrid}>
          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('ProposalsTab')}
          >
            <View style={[styles.toolIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="git-network-outline" size={20} color={COLORS.gold} />
            </View>
            <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>Grant Approvals</Text>
            <Text style={[styles.toolSub, { color: theme.textMuted }]}>3-Tier Clearance Desk</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('PatentsTab')}
          >
            <View style={[styles.toolIconWrap, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <Ionicons name="bulb-outline" size={20} color="#C084FC" />
            </View>
            <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>Patent Disclosures</Text>
            <Text style={[styles.toolSub, { color: theme.textMuted }]}>IPO Filings & Claims</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('LabScholarsTab')}
          >
            <View style={[styles.toolIconWrap, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
              <Ionicons name="people-outline" size={20} color={COLORS.cyan} />
            </View>
            <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>Supervised Scholars</Text>
            <Text style={[styles.toolSub, { color: theme.textMuted }]}>Thesis Review & Signoff</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <View style={[styles.toolIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="sparkles-outline" size={20} color={COLORS.emerald} />
            </View>
            <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>Faculty AI Drafter</Text>
            <Text style={[styles.toolSub, { color: theme.textMuted }]}>SERB / DST Proposals</Text>
          </TouchableOpacity>
        </View>

        {/* Live Sanctioned Grants Breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Sanctioned Research Grants</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProposalsTab')}>
            <Text style={styles.seeAllText}>Manage Grants</Text>
          </TouchableOpacity>
        </View>

        {funding.map((item, idx) => (
          <View
            key={item.id || idx}
            style={[styles.fundCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
          >
            <View style={styles.fundTop}>
              <View style={styles.agencyBadge}>
                <Text style={styles.agencyText}>{item.agency}</Text>
              </View>
              <Text style={[styles.fundAmount, { color: theme.textPrimary }]}>₹{(item.amount / 100000).toFixed(2)} Lakhs</Text>
            </View>

            <Text style={[styles.fundTitle, { color: theme.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.fundPi, { color: theme.textSecondary }]}>PI: {item.pi_name} • {item.department}</Text>

            <View style={[styles.fundFooter, { borderTopColor: theme.border }]}>
              <View style={styles.fundPeriod}>
                <Ionicons name="calendar-outline" size={12} color={theme.textMuted} style={{ marginRight: 4 }} />
                <Text style={[styles.fundPeriodText, { color: theme.textMuted }]}>{item.duration || '2024 - 2027 (Active)'}</Text>
              </View>
              <View style={styles.statusLive}>
                <Ionicons name="checkmark-circle" size={12} color={COLORS.gold} style={{ marginRight: 4 }} />
                <Text style={styles.statusLiveText}>{item.status || 'Disbursed'}</Text>
              </View>
            </View>
          </View>
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
    backgroundColor: COLORS.gold,
    marginRight: 6,
  },
  roleBadgeText: {
    color: COLORS.gold,
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
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heroInfo: {
    flex: 1,
  },
  profName: {
    fontSize: 15,
    fontFamily: FONTS.header,
  },
  profDesignation: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    marginTop: 2,
  },
  profDept: {
    fontSize: 11,
    fontFamily: FONTS.body,
    marginTop: 2,
  },
  portfolioBox: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
  },
  portfolioLabel: {
    color: COLORS.gold,
    fontSize: 9,
    fontFamily: FONTS.header,
    letterSpacing: 0.5,
  },
  portfolioValue: {
    fontSize: 22,
    fontFamily: FONTS.header,
    marginVertical: 2,
  },
  portfolioSub: {
    fontSize: 10,
    fontFamily: FONTS.body,
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
  metricVal: {
    fontSize: 16,
    fontFamily: FONTS.header,
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    marginTop: 2,
  },
  metricSub: {
    color: COLORS.gold,
    fontSize: 9,
    fontFamily: FONTS.body,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: FONTS.header,
    marginBottom: 10,
    marginTop: 6,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  fundCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  fundTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  agencyBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  agencyText: {
    color: COLORS.gold,
    fontSize: 10,
    fontFamily: FONTS.header,
  },
  fundAmount: {
    fontSize: 14,
    fontFamily: FONTS.header,
  },
  fundTitle: {
    fontSize: 13,
    fontFamily: FONTS.header,
    lineHeight: 18,
    marginBottom: 4,
  },
  fundPi: {
    fontSize: 11,
    fontFamily: FONTS.body,
    marginBottom: 10,
  },
  fundFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  fundPeriod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fundPeriodText: {
    fontSize: 10,
    fontFamily: FONTS.body,
  },
  statusLive: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLiveText: {
    color: COLORS.gold,
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
});
