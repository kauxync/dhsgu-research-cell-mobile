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

const FELLOWSHIPS = [
  {
    id: 'fel-1',
    name: 'CSIR-UGC Junior Research Fellowship (JRF)',
    agency: 'Council of Scientific & Industrial Research',
    amount: '₹37,000 / mo + HRA',
    contingency: '₹20,000 / annum',
    deadline: '28 Oct 2026',
    status: 'Active / Disbursed',
    target: 'Science & Engineering Ph.D. Scholars',
    link: 'https://csirhrdg.res.in',
  },
  {
    id: 'fel-2',
    name: 'DST-INSPIRE Fellowship for Doctoral Research',
    agency: 'Department of Science & Technology, Govt. of India',
    amount: '₹37,000 / mo + HRA',
    contingency: '₹20,000 / annum',
    deadline: '15 Nov 2026',
    status: 'Call for Proposals Open',
    target: 'University 1st Rank Holders in M.Sc./MCA',
    link: 'https://online-inspire.gov.in',
  },
  {
    id: 'fel-3',
    name: 'MPCOST Young Scientist Fellowship',
    agency: 'Madhya Pradesh Council of Science and Technology',
    amount: '₹25,000 / mo',
    contingency: '₹15,000 / annum',
    deadline: '10 Nov 2026',
    status: 'State Scheme Open',
    target: 'Scholars registered in MP Central/State Universities',
    link: 'https://mpcost.gov.in',
  },
  {
    id: 'fel-4',
    name: 'ICMR Senior Research Fellowship (SRF)',
    agency: 'Indian Council of Medical Research',
    amount: '₹42,000 / mo + HRA',
    contingency: '₹20,000 / annum',
    deadline: '05 Dec 2026',
    status: 'Upcoming Cycle',
    target: 'Biomedical, Bioinformatics & Life Science Scholars',
    link: 'https://main.icmr.nic.in',
  },
];

export default function ScholarFellowshipsScreen({ navigation }) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('fellowships'); // 'fellowships' or 'contingency'
  const [contingencyClaimed, setContingencyClaimed] = useState(14500);
  const totalContingency = 20000;

  const handleClaimContingency = () => {
    Alert.alert(
      'Contingency Bill Submission',
      'Submit research book purchase, conference registration fee, or chemical consumables bill for HOD endorsement?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upload Invoice',
          onPress: () => {
            Alert.alert('Success', 'Contingency voucher logged. Forwarded to DHSGSU Finance Office.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Header
        title="Fellowships & Grants"
        subtitle="Stipend Radar & Contingency Desk"
        rightAction={() => navigation.navigate('Notifications')}
        rightIcon="notifications-outline"
      />

      {/* Tab Switcher */}
      <View style={[styles.tabContainer, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'fellowships' && styles.tabBtnActive]}
          onPress={() => setActiveTab('fellowships')}
        >
          <Ionicons
            name="cash-outline"
            size={16}
            color={activeTab === 'fellowships' ? '#000' : theme.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabBtnText, { color: theme.textMuted }, activeTab === 'fellowships' && styles.tabBtnTextActive]}>
            National Fellowships ({FELLOWSHIPS.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'contingency' && styles.tabBtnActive]}
          onPress={() => setActiveTab('contingency')}
        >
          <Ionicons
            name="receipt-outline"
            size={16}
            color={activeTab === 'contingency' ? '#000' : theme.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabBtnText, { color: theme.textMuted }, activeTab === 'contingency' && styles.tabBtnTextActive]}>
            Contingency Fund
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'fellowships' ? (
          <>
            {/* Directives Banner */}
            <View style={styles.infoBanner}>
              <Ionicons name="information-circle" size={20} color={COLORS.emerald} style={{ marginRight: 8 }} />
              <Text style={styles.infoText}>
                DHSGSU scholars receive automated monthly JRF/SRF attendance validation through Canara Bank Portal.
              </Text>
            </View>

            {FELLOWSHIPS.map((fel) => (
              <View
                key={fel.id}
                style={[styles.card, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              >
                <View style={styles.cardTop}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{fel.status}</Text>
                  </View>
                  <View style={styles.deadlineContainer}>
                    <Ionicons name="timer-outline" size={12} color="#F59E0B" style={{ marginRight: 4 }} />
                    <Text style={styles.deadlineText}>Deadline: {fel.deadline}</Text>
                  </View>
                </View>

                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{fel.name}</Text>
                <Text style={[styles.agencyText, { color: theme.textMuted }]}>{fel.agency}</Text>

                <View style={[styles.amountGrid, { backgroundColor: theme.inputBg }]}>
                  <View style={styles.amountCol}>
                    <Text style={[styles.amountLabel, { color: theme.textMuted }]}>MONTHLY STIPEND</Text>
                    <Text style={[styles.amountVal, { color: theme.textPrimary }]}>{fel.amount}</Text>
                  </View>
                  <View style={[styles.amountDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.amountCol}>
                    <Text style={[styles.amountLabel, { color: theme.textMuted }]}>ANNUAL CONTINGENCY</Text>
                    <Text style={[styles.amountVal, { color: theme.textPrimary }]}>{fel.contingency}</Text>
                  </View>
                </View>

                <View style={styles.targetRow}>
                  <Ionicons name="checkmark-circle-outline" size={14} color={COLORS.emerald} style={{ marginRight: 6 }} />
                  <Text style={[styles.targetText, { color: theme.textSecondary }]}>{fel.target}</Text>
                </View>

                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => Linking.openURL(fel.link).catch(() => Alert.alert('Error', 'Unable to open portal link'))}
                >
                  <Text style={styles.applyBtnText}>View Guidelines & Official Portal</Text>
                  <Ionicons name="open-outline" size={14} color="#000" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        ) : (
          <>
            {/* Contingency Tracker View */}
            <View style={[styles.contingencyCard, { backgroundColor: theme.surfaceCard, borderColor: 'rgba(16, 185, 129, 0.25)' }]}>
              <Text style={[styles.contingencyTitle, { color: theme.textPrimary }]}>Annual Contingency Grant 2026-27</Text>
              <Text style={[styles.contingencySub, { color: theme.textMuted }]}>Sanctioned under UGC Research Fellowship Scheme</Text>

              <View style={styles.progressContainer}>
                <View style={[styles.progressBarBg, { backgroundColor: theme.inputBg }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${(contingencyClaimed / totalContingency) * 100}%` },
                    ]}
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={[styles.progressVal, { color: theme.textSecondary }]}>Utilized: ₹{contingencyClaimed.toLocaleString()}</Text>
                  <Text style={[styles.progressVal, { color: theme.textSecondary }]}>Remaining: ₹{(totalContingency - contingencyClaimed).toLocaleString()}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.claimButton}
                onPress={handleClaimContingency}
              >
                <Ionicons name="add-circle" size={18} color="#000" style={{ marginRight: 6 }} />
                <Text style={styles.claimButtonText}>Submit New Invoice Claim</Text>
              </TouchableOpacity>
            </View>

            {/* Approved Expense History */}
            <Text style={[styles.historyTitle, { color: theme.textPrimary }]}>Approved Expense Claims</Text>

            <View style={[styles.historyItem, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
              <View style={styles.historyIcon}>
                <Ionicons name="book-outline" size={18} color={COLORS.emerald} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.historyName, { color: theme.textPrimary }]}>Springer Books & IEEE Access Page Charges</Text>
                <Text style={[styles.historyMeta, { color: theme.textMuted }]}>Approved on 14 Aug 2026 • Voucher #DHS-CON-884</Text>
              </View>
              <Text style={styles.historyAmount}>₹9,500</Text>
            </View>

            <View style={[styles.historyItem, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
              <View style={styles.historyIcon}>
                <Ionicons name="flask-outline" size={18} color={COLORS.emerald} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.historyName, { color: theme.textPrimary }]}>Chemical Reagents & GPU Cloud Compute Time</Text>
                <Text style={[styles.historyMeta, { color: theme.textMuted }]}>Approved on 02 Jun 2026 • Voucher #DHS-CON-612</Text>
              </View>
              <Text style={styles.historyAmount}>₹5,000</Text>
            </View>
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: COLORS.emerald,
  },
  tabBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
  },
  tabBtnTextActive: {
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  infoText: {
    flex: 1,
    color: COLORS.emerald,
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
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    color: '#F59E0B',
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: FONTS.header,
    lineHeight: 20,
    marginBottom: 2,
  },
  agencyText: {
    fontSize: 11,
    fontFamily: FONTS.body,
    marginBottom: 10,
  },
  amountGrid: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  amountCol: {
    flex: 1,
    alignItems: 'center',
  },
  amountDivider: {
    width: 1,
  },
  amountLabel: {
    fontSize: 8,
    fontFamily: FONTS.header,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  amountVal: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  targetText: {
    fontSize: 11,
    fontFamily: FONTS.body,
    flex: 1,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.emerald,
    borderRadius: 8,
    paddingVertical: 9,
  },
  applyBtnText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 11,
  },
  contingencyCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  contingencyTitle: {
    fontSize: 15,
    fontFamily: FONTS.header,
    marginBottom: 2,
  },
  contingencySub: {
    fontSize: 11,
    fontFamily: FONTS.body,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.emerald,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressVal: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.emerald,
    borderRadius: 8,
    paddingVertical: 10,
  },
  claimButtonText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 12,
  },
  historyTitle: {
    fontSize: 14,
    fontFamily: FONTS.header,
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  historyName: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    marginBottom: 2,
  },
  historyMeta: {
    fontSize: 10,
    fontFamily: FONTS.body,
  },
  historyAmount: {
    color: COLORS.emerald,
    fontFamily: FONTS.header,
    fontSize: 13,
    marginLeft: 8,
  },
});
