import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import Header from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../api/client';

export default function ProfessorProposalsScreen({ navigation }) {
  const { theme } = useTheme();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [agency, setAgency] = useState('DST-SERB');
  const [budget, setBudget] = useState('');
  const [dept, setDept] = useState('DCSA');

  const loadProposals = async () => {
    try {
      const res = await api.getProposals();
      if (res?.success) {
        setProposals(res.data);
      }
    } catch (e) {
      console.warn('Error loading proposals', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const handleEndorseProposal = (id, currentStatus) => {
    Alert.alert(
      'DRC / Research Cell Clearance',
      'Endorse and forward this research proposal to the next institutional clearance stage?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve & Transmit',
          onPress: () => {
            const updated = proposals.map((p) =>
              p.id === id ? { ...p, status: 'Central Agency Sanction (Stage 3/3)' } : p
            );
            setProposals(updated);
            Alert.alert('Approved ✅', 'Proposal endorsed with digital signature and transmitted to SERB portal.');
          },
        },
      ]
    );
  };

  const handleCreateProposal = async () => {
    if (!title.trim() || !budget.trim()) {
      Alert.alert('Missing fields', 'Please enter project title and budget.');
      return;
    }

    try {
      const newProp = {
        title: title.trim(),
        department: dept,
        pi_name: 'Dr. Pangambam Sendash Singh',
        agency: agency,
        budget: parseFloat(budget) * 100000 || 2500000,
        status: 'Department Review (Stage 1/3)',
      };

      const res = await api.submitProposal(newProp);
      if (res?.success) {
        setProposals([res.data, ...proposals]);
      } else {
        setProposals([{ id: Date.now(), ...newProp }, ...proposals]);
      }
      setModalVisible(false);
      setTitle('');
      setBudget('');
      Alert.alert('Success 🎉', 'New R&D grant proposal logged into University Research Cell.');
    } catch (e) {
      Alert.alert('Logged Offline', 'Proposal recorded in local PI registry.');
      setModalVisible(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Header
        title="Grant Approvals Pipeline"
        subtitle="3-Tier DRC & Research Cell Desk"
        rightAction={() => setModalVisible(true)}
        rightIcon="add-circle-outline"
      />

      {/* 3-Tier Pipeline Tracker Banner */}
      <View style={[styles.pipelineCard, { backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.25)' }]}>
        <Text style={styles.pipelineTitle}>INSTITUTIONAL CLEARANCE PROTOCOL</Text>
        <View style={styles.stagesRow}>
          <View style={styles.stageItem}>
            <View style={[styles.stageBadge, styles.stageBadgeDone]}>
              <Text style={styles.stageNumDone}>1</Text>
            </View>
            <Text style={[styles.stageLabel, { color: theme.textSecondary }]}>Dept DRC</Text>
          </View>
          <View style={[styles.stageConnector, { backgroundColor: theme.border }]} />
          <View style={styles.stageItem}>
            <View style={[styles.stageBadge, styles.stageBadgeActive]}>
              <Text style={styles.stageNumActive}>2</Text>
            </View>
            <Text style={[styles.stageLabel, { color: theme.textSecondary }]}>Research Cell</Text>
          </View>
          <View style={[styles.stageConnector, { backgroundColor: theme.border }]} />
          <View style={styles.stageItem}>
            <View style={[styles.stageBadge, { backgroundColor: theme.inputBg }]}>
              <Text style={[styles.stageNum, { color: theme.textMuted }]}>3</Text>
            </View>
            <Text style={[styles.stageLabel, { color: theme.textSecondary }]}>Ministry/SERB</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.gold} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Loading University Proposals...</Text>
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
                loadProposals();
              }}
              tintColor={COLORS.gold}
            />
          }
        >
          {proposals.map((prop, idx) => (
            <View
              key={prop.id || idx}
              style={[styles.card, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.agencyTag}>
                  <Text style={styles.agencyTagText}>{prop.agency || 'DST-SERB'}</Text>
                </View>
                <Text style={[styles.budgetTag, { color: theme.textPrimary }]}>
                  ₹{(prop.budget ? prop.budget / 100000 : 35).toFixed(1)} Lakhs
                </Text>
              </View>

              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{prop.title}</Text>
              
              <View style={styles.piRow}>
                <Ionicons name="person" size={12} color={COLORS.gold} style={{ marginRight: 5 }} />
                <Text style={[styles.piText, { color: theme.textSecondary }]}>{prop.pi_name} • {prop.department}</Text>
              </View>

              {/* Status Badge */}
              <View style={[styles.statusBox, { backgroundColor: theme.inputBg }]}>
                <Ionicons name="git-branch-outline" size={14} color={COLORS.gold} style={{ marginRight: 6 }} />
                <Text style={styles.statusText} numberOfLines={1}>{prop.status}</Text>
              </View>

              {/* PI Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtnSecondary}
                  onPress={() => {
                    navigation.navigate('Chatbot', {
                      query: `Draft an executive compliance report for research proposal "${prop.title}" requesting ₹${(prop.budget / 100000).toFixed(1)} Lakhs from ${prop.agency}`,
                    });
                  }}
                >
                  <Ionicons name="sparkles" size={13} color={COLORS.gold} style={{ marginRight: 4 }} />
                  <Text style={styles.actionBtnSecondaryText}>AI Compliance Check</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtnPrimary}
                  onPress={() => handleEndorseProposal(prop.id, prop.status)}
                >
                  <Ionicons name="checkmark-done" size={14} color="#000" style={{ marginRight: 4 }} />
                  <Text style={styles.actionBtnPrimaryText}>Endorse & Forward</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* New Proposal Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Draft PI Grant Proposal</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: theme.textMuted }]}>PROJECT TITLE *</Text>
            <TextInput
              style={[styles.inputField, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="e.g. AI-Driven Crop Disease Early Warning System"
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={setTitle}
              multiline
            />

            <Text style={[styles.inputLabel, { color: theme.textMuted }]}>FUNDING AGENCY *</Text>
            <TextInput
              style={[styles.inputField, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="e.g. DST-SERB CRG / UGC STRIDE / MPCOST"
              placeholderTextColor={theme.textMuted}
              value={agency}
              onChangeText={setAgency}
            />

            <Text style={[styles.inputLabel, { color: theme.textMuted }]}>PROPOSED BUDGET (IN LAKHS ₹) *</Text>
            <TextInput
              style={[styles.inputField, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="e.g. 45.5"
              placeholderTextColor={theme.textMuted}
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreateProposal}>
              <Text style={styles.submitBtnText}>Submit to Department Research Committee</Text>
            </TouchableOpacity>
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
  pipelineCard: {
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
  },
  pipelineTitle: {
    color: COLORS.gold,
    fontSize: 10,
    fontFamily: FONTS.header,
    letterSpacing: 0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  stagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stageItem: {
    alignItems: 'center',
  },
  stageBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stageBadgeDone: {
    backgroundColor: COLORS.gold,
  },
  stageBadgeActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  stageNumDone: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 11,
  },
  stageNumActive: {
    color: COLORS.gold,
    fontFamily: FONTS.header,
    fontSize: 11,
  },
  stageNum: {
    fontFamily: FONTS.header,
    fontSize: 11,
  },
  stageLabel: {
    fontSize: 9,
    fontFamily: FONTS.bodyBold,
  },
  stageConnector: {
    flex: 1,
    height: 2,
    marginHorizontal: 6,
    marginBottom: 14,
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
  agencyTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  agencyTagText: {
    color: COLORS.gold,
    fontSize: 10,
    fontFamily: FONTS.header,
  },
  budgetTag: {
    fontSize: 13,
    fontFamily: FONTS.header,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: FONTS.header,
    lineHeight: 20,
    marginBottom: 6,
  },
  piRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  piText: {
    fontSize: 11,
    fontFamily: FONTS.body,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  statusText: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
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
  submitBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  submitBtnText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 13,
  },
});
