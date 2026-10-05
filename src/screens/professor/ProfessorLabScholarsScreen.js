import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const LAB_SCHOLARS = [
  {
    id: 'sch-1',
    name: 'Neha Richhariya',
    regNo: 'DHSGSU/PHD/2023/04',
    topic: 'Deep Learning Architectures for Multimodal Medical Diagnostics',
    stage: 'Stage 3: 2 Q1 Papers (1 Published)',
    progress: 75,
    fellowship: 'CSIR JRF (Active)',
    lastMeeting: '28 Sep 2026',
    pendingReview: 'Chapter 4: Transformer Feature Fusion Draft',
  },
  {
    id: 'sch-2',
    name: 'Amit Kumar Verma',
    regNo: 'DHSGSU/PHD/2022/11',
    topic: 'Energy-Efficient Resource Allocation in Heterogeneous Edge-Cloud Clusters',
    stage: 'Stage 4: Synopsis Ready for Pre-Submission',
    progress: 95,
    fellowship: 'DST-INSPIRE Fellow',
    lastMeeting: '01 Oct 2026',
    pendingReview: 'Final Ph.D. Thesis Synopsis Document',
  },
  {
    id: 'sch-3',
    name: 'Pooja Vishwakarma',
    regNo: 'DHSGSU/PHD/2024/02',
    topic: 'Graph Neural Networks for Vulnerability Assessment in Smart Grid Networks',
    stage: 'Stage 2: Comprehensive Viva Completed',
    progress: 45,
    fellowship: 'UGC NET-JRF',
    lastMeeting: '15 Sep 2026',
    pendingReview: 'Comprehensive Literature Survey Report',
  },
  {
    id: 'sch-4',
    name: 'Rohit Sahu',
    regNo: 'DHSGSU/PHD/2024/18',
    topic: 'Privacy-Preserving Federated Learning with Differential Privacy Guarantees',
    stage: 'Stage 1: Ph.D. Coursework Exam Completed',
    progress: 25,
    fellowship: 'University Research Fellowship',
    lastMeeting: '10 Sep 2026',
    pendingReview: 'Research Proposal Outline for RDC',
  },
];

export default function ProfessorLabScholarsScreen({ navigation }) {
  const { manuscripts, approveScholarManuscript, rejectScholarManuscript } = useAuth();
  const { theme, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'roster'
  const [selectedManuscript, setSelectedManuscript] = useState(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [supervisorNotes, setSupervisorNotes] = useState('');

  const pendingManuscripts = manuscripts.filter((m) => !m.supervisorApproved);
  const approvedManuscripts = manuscripts.filter((m) => m.supervisorApproved);

  const handleOpenReview = (manuscript) => {
    setSelectedManuscript(manuscript);
    setSupervisorNotes(
      'Verified novelty against Urkund report. Methodology sound and adherence to DHSGSU standard affiliation confirmed.'
    );
    setReviewModalVisible(true);
  };

  const handleApprove = async () => {
    if (!selectedManuscript) return;
    await approveScholarManuscript(selectedManuscript.id, supervisorNotes);
    setReviewModalVisible(false);
    Alert.alert(
      'Manuscript Endorsed! ✅',
      `Digital Bonafide Certificate and NOC issued for "${selectedManuscript.title.substring(0, 30)}...". It has been approved for journal submission and DHSGSU archive.`
    );
  };

  const handleRequestRevisions = async () => {
    if (!selectedManuscript) return;
    await rejectScholarManuscript(selectedManuscript.id, supervisorNotes || 'Please revise experimental evaluation.');
    setReviewModalVisible(false);
    Alert.alert('Revisions Requested', 'Feedback transmitted to scholar portal.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Header
        title="Scholar Supervision Desk"
        subtitle="Endorsement Pipeline & Thesis Roster"
        rightAction={() => navigation.navigate('Notifications')}
        rightIcon="notifications-outline"
      />

      {/* Tab Switcher */}
      <View style={[styles.tabBar, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'approvals' && styles.tabBtnActive]}
          onPress={() => setActiveTab('approvals')}
        >
          <Ionicons
            name="checkmark-done-circle"
            size={16}
            color={activeTab === 'approvals' ? '#000' : theme.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabBtnText, activeTab === 'approvals' && styles.tabBtnTextActive]}>
            Publishing Approvals ({pendingManuscripts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'roster' && styles.tabBtnActive]}
          onPress={() => setActiveTab('roster')}
        >
          <Ionicons
            name="people"
            size={16}
            color={activeTab === 'roster' ? '#000' : theme.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabBtnText, activeTab === 'roster' && styles.tabBtnTextActive]}>
            Supervision Roster ({LAB_SCHOLARS.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'approvals' ? (
          <>
            <View style={[styles.banner, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.06)', borderColor: isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.2)' }]}>
              <Ionicons name="ribbon" size={22} color={COLORS.gold} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.bannerTitle, { color: theme.textPrimary }]}>Supervisor Publication Clearance Desk</Text>
                <Text style={[styles.bannerSub, { color: theme.textSecondary }]}>
                  Review scholar manuscripts, verify similarity reports, and sign digital Bonafide certificates before repository publication.
                </Text>
              </View>
            </View>

            {/* Pending Approvals List */}
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Pending Scholar Submissions ({pendingManuscripts.length})
            </Text>

            {pendingManuscripts.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
                <Ionicons name="checkmark-circle" size={36} color={COLORS.gold} />
                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>All Scholar Manuscripts Reviewed</Text>
                <Text style={[styles.emptySub, { color: theme.textMuted }]}>
                  No pending publications awaiting supervisor endorsement.
                </Text>
              </View>
            ) : (
              pendingManuscripts.map((m) => (
                <View
                  key={m.id}
                  style={[styles.card, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.scholarBadge}>
                      <Ionicons name="person" size={11} color={COLORS.gold} style={{ marginRight: 4 }} />
                      <Text style={styles.scholarBadgeText}>{m.authorName || 'Ph.D. Scholar'}</Text>
                    </View>
                    <View style={styles.similarityBadge}>
                      <Text style={styles.similarityText}>{m.plagiarism || 'Urkund Checked'}</Text>
                    </View>
                  </View>

                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{m.title}</Text>

                  <View style={styles.journalRow}>
                    <Ionicons name="book-outline" size={13} color={theme.textMuted} style={{ marginRight: 5 }} />
                    <Text style={[styles.journalText, { color: theme.textSecondary }]}>Target: {m.journal}</Text>
                  </View>

                  {m.abstract && (
                    <Text style={[styles.abstractSnippet, { color: theme.textMuted }]} numberOfLines={2}>
                      {m.abstract}
                    </Text>
                  )}

                  {/* Endorsement Actions */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionBtnSecondary}
                      onPress={() => {
                        navigation.navigate('Chatbot', {
                          query: `Evaluate doctoral manuscript "${m.title}" for UGC-CARE / IEEE compliance and novelty check`,
                        });
                      }}
                    >
                      <Ionicons name="sparkles" size={13} color={COLORS.gold} style={{ marginRight: 4 }} />
                      <Text style={styles.actionBtnSecondaryText}>AI Review</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtnPrimary}
                      onPress={() => handleOpenReview(m)}
                    >
                      <Ionicons name="checkmark-done" size={14} color="#000" style={{ marginRight: 4 }} />
                      <Text style={styles.actionBtnPrimaryText}>Review & Endorse</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            {/* Approved Manuscripts Section */}
            {approvedManuscripts.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: 14 }]}>
                  Approved & Endorsed Publications ({approvedManuscripts.length})
                </Text>
                {approvedManuscripts.map((m) => (
                  <View
                    key={m.id}
                    style={[styles.approvedCard, { backgroundColor: theme.surfaceCard, borderColor: 'rgba(16, 185, 129, 0.25)' }]}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.approvedBadge}>
                        <Ionicons name="shield-checkmark" size={12} color={COLORS.emerald} style={{ marginRight: 4 }} />
                        <Text style={styles.approvedBadgeText}>Supervisor Endorsed</Text>
                      </View>
                      <Text style={[styles.dateText, { color: theme.textMuted }]}>{m.approvalDate || 'Approved'}</Text>
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{m.title}</Text>
                    <Text style={[styles.journalText, { color: COLORS.emerald }]}>
                      By {m.authorName} • {m.journal}
                    </Text>
                    {m.doi && (
                      <Text style={styles.doiText}>DOI: {m.doi}</Text>
                    )}
                  </View>
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {/* Supervision Roster View */}
            {LAB_SCHOLARS.map((scholar) => (
              <View
                key={scholar.id}
                style={[styles.card, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.avatarMini}>
                    <Ionicons name="person" size={16} color={COLORS.gold} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.scholarName, { color: theme.textPrimary }]}>{scholar.name}</Text>
                    <Text style={[styles.regText, { color: theme.textMuted }]}>{scholar.regNo} • {scholar.fellowship}</Text>
                  </View>
                  <View style={styles.progressPill}>
                    <Text style={styles.progressPillText}>{scholar.progress}%</Text>
                  </View>
                </View>

                <Text style={[styles.topicText, { color: theme.textSecondary }]}>{scholar.topic}</Text>

                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${scholar.progress}%` }]} />
                </View>

                <View style={styles.stageRow}>
                  <Ionicons name="flag-outline" size={13} color={COLORS.gold} style={{ marginRight: 4 }} />
                  <Text style={styles.stageText}>{scholar.stage}</Text>
                </View>

                <View style={[styles.reviewBox, { backgroundColor: theme.inputBg }]}>
                  <Text style={styles.reviewTitle}>Pending Chapter Submission:</Text>
                  <Text style={[styles.reviewContent, { color: theme.textPrimary }]}>{scholar.pendingReview}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Supervisor Review & Endorsement Modal */}
      <Modal visible={reviewModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Supervisor Bonafide Endorsement</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            {selectedManuscript && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.modalDocTitle, { color: theme.textPrimary }]}>{selectedManuscript.title}</Text>
                <Text style={[styles.modalScholarMeta, { color: COLORS.gold }]}>
                  Author: {selectedManuscript.authorName} ({selectedManuscript.department || 'DCSA'})
                </Text>
                <Text style={[styles.modalScholarMeta, { color: theme.textSecondary }]}>
                  Target Journal: {selectedManuscript.journal}
                </Text>

                <View style={[styles.similarityBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <Ionicons name="shield-checkmark" size={18} color={COLORS.emerald} style={{ marginRight: 8 }} />
                  <Text style={styles.similarityBoxText}>
                    Urkund Similarity: {selectedManuscript.plagiarism || '6%'} (Within UGC permissible limit ≤ 10%)
                  </Text>
                </View>

                <Text style={[styles.inputLabel, { color: theme.textMuted }]}>SUPERVISOR REMARKS / CLEARANCE NOTE</Text>
                <TextInput
                  style={[styles.inputField, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                  placeholder="Enter endorsement remarks for university research committee..."
                  placeholderTextColor={theme.textMuted}
                  value={supervisorNotes}
                  onChangeText={setSupervisorNotes}
                  multiline
                />

                <View style={styles.modalBtnRow}>
                  <TouchableOpacity style={styles.revisionBtn} onPress={handleRequestRevisions}>
                    <Text style={styles.revisionBtnText}>Request Revisions</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.approveBtn} onPress={handleApprove}>
                    <Ionicons name="checkmark-done" size={16} color="#000" style={{ marginRight: 6 }} />
                    <Text style={styles.approveBtnText}>Sign & Approve</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
    marginVertical: 10,
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
    backgroundColor: COLORS.gold,
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
    paddingTop: 4,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: FONTS.header,
  },
  bannerSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontFamily: FONTS.body,
    marginTop: 2,
    lineHeight: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: FONTS.header,
    marginBottom: 8,
  },
  emptyCard: {
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 14,
    fontFamily: FONTS.header,
    marginTop: 8,
  },
  emptySub: {
    fontSize: 11,
    fontFamily: FONTS.body,
    marginTop: 2,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  approvedCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scholarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scholarBadgeText: {
    color: COLORS.gold,
    fontSize: 10,
    fontFamily: FONTS.header,
  },
  similarityBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  similarityText: {
    color: COLORS.emerald,
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  approvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  approvedBadgeText: {
    color: COLORS.emerald,
    fontSize: 10,
    fontFamily: FONTS.header,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: FONTS.header,
    lineHeight: 20,
    marginBottom: 4,
  },
  journalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  journalText: {
    fontSize: 11,
    fontFamily: FONTS.body,
  },
  abstractSnippet: {
    fontSize: 11,
    fontFamily: FONTS.body,
    lineHeight: 16,
    marginBottom: 10,
  },
  doiText: {
    color: COLORS.emerald,
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    marginTop: 4,
  },
  dateText: {
    fontSize: 10,
    fontFamily: FONTS.body,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
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
    flex: 1.4,
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
  avatarMini: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  scholarName: {
    fontSize: 14,
    fontFamily: FONTS.header,
  },
  regText: {
    fontSize: 10,
    fontFamily: FONTS.body,
    marginTop: 1,
  },
  progressPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  progressPillText: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.header,
  },
  topicText: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    lineHeight: 18,
    marginBottom: 8,
  },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 3,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageText: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  reviewBox: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
  },
  reviewTitle: {
    color: COLORS.gold,
    fontSize: 10,
    fontFamily: FONTS.header,
  },
  reviewContent: {
    fontSize: 11,
    fontFamily: FONTS.body,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: FONTS.header,
  },
  modalDocTitle: {
    fontSize: 14,
    fontFamily: FONTS.header,
    lineHeight: 20,
    marginBottom: 4,
  },
  modalScholarMeta: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    marginBottom: 2,
  },
  similarityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  similarityBoxText: {
    color: COLORS.emerald,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    flex: 1,
  },
  inputLabel: {
    fontSize: 10,
    fontFamily: FONTS.header,
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 6,
  },
  inputField: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    fontSize: 12,
    fontFamily: FONTS.body,
    height: 80,
    textAlignVertical: 'top',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    marginBottom: 14,
  },
  revisionBtn: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revisionBtnText: {
    color: '#EF4444',
    fontFamily: FONTS.header,
    fontSize: 12,
  },
  approveBtn: {
    flex: 1.4,
    flexDirection: 'row',
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveBtnText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 12,
  },
});
