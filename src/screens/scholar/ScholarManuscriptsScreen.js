import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ScholarManuscriptsScreen({ navigation }) {
  const { manuscripts, submitScholarManuscript, user } = useAuth();
  const { theme } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newJournal, setNewJournal] = useState('');
  const [newAbstract, setNewAbstract] = useState('');
  const [plagiarismScore, setPlagiarismScore] = useState('5%');
  const [plagCheck, setPlagCheck] = useState(true);
  const [affilCheck, setAffilCheck] = useState(true);
  const [ethicsCheck, setEthicsCheck] = useState(true);

  const handleSubmitForApproval = async () => {
    if (!newTitle.trim() || !newJournal.trim()) {
      Alert.alert('Missing Info', 'Please enter manuscript title and target journal.');
      return;
    }

    if (!plagCheck || !affilCheck) {
      Alert.alert('Checklist Incomplete', 'Please confirm plagiarism check and institutional affiliation declarations.');
      return;
    }

    await submitScholarManuscript({
      title: newTitle.trim(),
      journal: newJournal.trim(),
      abstract: newAbstract.trim(),
      plagiarism: `${plagiarismScore} (Urkund Scan)`,
      stage: 'Stage 2: Supervisor Approval',
      wordCount: `${Math.floor(Math.random() * 3000 + 4500)} words`,
    });

    setModalVisible(false);
    setNewTitle('');
    setNewJournal('');
    setNewAbstract('');
    Alert.alert(
      'Submitted to Supervisor! 📜',
      `Your manuscript has been sent to Dr. ${user?.supervisor || 'Pangambam Sendash Singh'} for digital sign-off and Bonafide endorsement.`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Header
        title="Manuscripts & Approvals"
        subtitle="Scholar Publishing Pipeline"
        rightAction={() => setModalVisible(true)}
        rightIcon="add-circle-outline"
      />

      {/* Institutional Publishing Rule Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="shield-checkmark" size={20} color={COLORS.emerald} style={{ marginRight: 8 }} />
        <Text style={styles.infoText}>
          UGC & DHSGSU Mandatory Rule: Every doctoral research paper requires supervisor digital endorsement before university repository upload.
        </Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {manuscripts.map((item) => {
          const isApproved = item.status === 'Approved & Published' || item.supervisorApproved;
          const isPending = item.status === 'Pending Review' || !item.supervisorApproved;

          return (
            <View
              key={item.id}
              style={[
                styles.card,
                { backgroundColor: theme.surfaceCard, borderColor: isApproved ? 'rgba(16, 185, 129, 0.3)' : theme.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.statusBadge,
                    isApproved && { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
                    isPending && { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
                  ]}
                >
                  <Ionicons
                    name={isApproved ? 'checkmark-circle' : 'time'}
                    size={12}
                    color={isApproved ? COLORS.emerald : '#F59E0B'}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: isApproved ? COLORS.emerald : '#F59E0B' },
                    ]}
                  >
                    {isApproved ? 'Approved by Supervisor' : 'Pending Professor Approval'}
                  </Text>
                </View>
                <Text style={[styles.dateText, { color: theme.textMuted }]}>
                  {item.submissionDate || 'Recent'}
                </Text>
              </View>

              <Text style={[styles.titleText, { color: theme.textPrimary }]}>{item.title}</Text>

              <View style={styles.journalRow}>
                <Ionicons name="book" size={14} color={COLORS.emerald} style={{ marginRight: 6 }} />
                <Text style={styles.journalName}>{item.journal}</Text>
              </View>

              {/* Plagiarism & Verification Grid */}
              <View style={[styles.metricGrid, { backgroundColor: theme.inputBg }]}>
                <View style={styles.metricBox}>
                  <Text style={[styles.metricLabel, { color: theme.textMuted }]}>SIMILARITY</Text>
                  <Text style={[styles.metricValue, { color: COLORS.emerald }]}>{item.plagiarism || '5%'}</Text>
                </View>

                <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />

                <View style={styles.metricBox}>
                  <Text style={[styles.metricLabel, { color: theme.textMuted }]}>SUPERVISOR</Text>
                  <Text
                    style={[
                      styles.metricValue,
                      { color: isApproved ? COLORS.emerald : '#F59E0B' },
                    ]}
                  >
                    {isApproved ? 'Endorsed ✅' : 'In Review ⏳'}
                  </Text>
                </View>

                <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />

                <View style={styles.metricBox}>
                  <Text style={[styles.metricLabel, { color: theme.textMuted }]}>STAGE</Text>
                  <Text style={[styles.metricValue, { color: theme.textPrimary }]}>
                    {item.stage || (isApproved ? 'Published' : 'Stage 2/4')}
                  </Text>
                </View>
              </View>

              {/* Supervisor Notes Box */}
              {item.supervisorNotes && (
                <View style={styles.notesBox}>
                  <Ionicons name="chatbubble-ellipses-outline" size={13} color={COLORS.emerald} style={{ marginRight: 6 }} />
                  <Text style={[styles.notesText, { color: theme.textSecondary }]} numberOfLines={2}>
                    <Text style={{ fontFamily: FONTS.bodyBold, color: COLORS.emerald }}>Supervisor Note: </Text>
                    {item.supervisorNotes}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtnSecondary}
                  onPress={() => {
                    navigation.navigate('Chatbot', {
                      query: `Review manuscript "${item.title}" targeted for ${item.journal} and suggest Q1 reviewers response`,
                    });
                  }}
                >
                  <Ionicons name="sparkles" size={14} color={COLORS.emerald} style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnSecondaryText}>AI Polish</Text>
                </TouchableOpacity>

                {isApproved ? (
                  <View style={styles.publishedBadge}>
                    <Ionicons name="library" size={14} color="#000" style={{ marginRight: 4 }} />
                    <Text style={styles.publishedBadgeText}>Published in Repository</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.actionBtnPrimary}
                    onPress={() => {
                      Alert.alert(
                        'Supervisor Review Status',
                        `Manuscript submitted to Dr. ${user?.supervisor || 'Pangambam Sendash Singh'}. When approved, it will automatically receive DHSGSU digital seal and DOI.`
                      );
                    }}
                  >
                    <Ionicons name="time-outline" size={14} color="#000" style={{ marginRight: 4 }} />
                    <Text style={styles.actionBtnPrimaryText}>Track Clearance</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Submit New Manuscript Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Submit Manuscript for Approval</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>MANUSCRIPT WORKING TITLE *</Text>
              <TextInput
                style={[styles.inputField, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                placeholder="e.g. Multimodal Deep Learning for Medical Diagnostics"
                placeholderTextColor={theme.textMuted}
                value={newTitle}
                onChangeText={setNewTitle}
                multiline
              />

              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>TARGETED JOURNAL / CONFERENCE *</Text>
              <TextInput
                style={[styles.inputField, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                placeholder="e.g. IEEE Transactions on Medical Imaging (Q1)"
                placeholderTextColor={theme.textMuted}
                value={newJournal}
                onChangeText={setNewJournal}
              />

              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>ABSTRACT / SUMMARY</Text>
              <TextInput
                style={[styles.inputField, { height: 70, backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                placeholder="Brief summary of research contribution and methodology..."
                placeholderTextColor={theme.textMuted}
                value={newAbstract}
                onChangeText={setNewAbstract}
                multiline
              />

              {/* UGC & Supervisor Clearance Checklist */}
              <Text style={[styles.checklistTitle, { color: theme.textPrimary }]}>Pre-Submission Clearance Checklist</Text>

              <TouchableOpacity style={styles.checkRow} onPress={() => setPlagCheck(!plagCheck)}>
                <Ionicons
                  name={plagCheck ? 'checkbox' : 'square-outline'}
                  size={18}
                  color={plagCheck ? COLORS.emerald : theme.textMuted}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.checkText, { color: theme.textSecondary }]}>
                  Similarity index ≤ 10% verified via Urkund / Turnitin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkRow} onPress={() => setAffilCheck(!affilCheck)}>
                <Ionicons
                  name={affilCheck ? 'checkbox' : 'square-outline'}
                  size={18}
                  color={affilCheck ? COLORS.emerald : theme.textMuted}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.checkText, { color: theme.textSecondary }]}>
                  Affiliation: Dept of Computer Science, DHSGSU Sagar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkRow} onPress={() => setEthicsCheck(!ethicsCheck)}>
                <Ionicons
                  name={ethicsCheck ? 'checkbox' : 'square-outline'}
                  size={18}
                  color={ethicsCheck ? COLORS.emerald : theme.textMuted}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.checkText, { color: theme.textSecondary }]}>
                  Author contribution & ethical declarations signed
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitForApproval}>
                <Ionicons name="paper-plane" size={16} color="#000" style={{ marginRight: 6 }} />
                <Text style={styles.submitBtnText}>Transmit to Supervisor Desk</Text>
              </TouchableOpacity>
            </ScrollView>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 10,
    padding: 10,
  },
  infoText: {
    flex: 1,
    color: COLORS.emerald,
    fontSize: 11,
    fontFamily: FONTS.body,
    lineHeight: 16,
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
    marginBottom: 14,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.header,
  },
  dateText: {
    fontSize: 10,
    fontFamily: FONTS.body,
  },
  titleText: {
    fontSize: 14,
    fontFamily: FONTS.header,
    lineHeight: 20,
    marginBottom: 6,
  },
  journalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  journalName: {
    color: COLORS.emerald,
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
  },
  metricGrid: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
  },
  metricLabel: {
    fontSize: 8,
    fontFamily: FONTS.header,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  notesText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.body,
    lineHeight: 16,
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
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  actionBtnSecondaryText: {
    color: COLORS.emerald,
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
  },
  actionBtnPrimary: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.emerald,
    borderRadius: 8,
    paddingVertical: 9,
  },
  actionBtnPrimaryText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 11,
  },
  publishedBadge: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.emerald,
    borderRadius: 8,
    paddingVertical: 9,
  },
  publishedBadgeText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 11,
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: FONTS.header,
  },
  inputLabel: {
    fontSize: 10,
    fontFamily: FONTS.header,
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 10,
  },
  inputField: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    fontSize: 12,
    fontFamily: FONTS.body,
  },
  checklistTitle: {
    fontSize: 12,
    fontFamily: FONTS.header,
    marginTop: 14,
    marginBottom: 8,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkText: {
    fontSize: 11,
    fontFamily: FONTS.body,
    flex: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.emerald,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  submitBtnText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 13,
  },
});
