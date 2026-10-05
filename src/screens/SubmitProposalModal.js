import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';

export default function SubmitProposalModal({ navigation }) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [piId, setPiId] = useState('1');
  const [coInvestigators, setCoInvestigators] = useState('');
  const [agency, setAgency] = useState('MPCOST Research Grant');
  const [budget, setBudget] = useState('3500000');
  const [duration, setDuration] = useState('36');
  const [submitting, setSubmitting] = useState(false);
  const { theme, isDark } = useTheme();

  const handleSubmit = async () => {
    if (!title.trim() || !budget.trim()) {
      Alert.alert('Validation Error', 'Please specify Proposal Title and Requested Outlay');
      return;
    }

    setSubmitting(true);
    try {
      await api.createProposal({
        title: title.trim(),
        principal_investigator_id: Number(piId),
        co_investigators: coInvestigators.trim(),
        funding_agency: agency,
        budget_requested: Number(budget),
        duration_months: Number(duration) || 24
      });

      Alert.alert(
        'Proposal Submitted for DHSGSU Review!',
        'Your research proposal has been successfully logged to the Institutional Research Cell review dashboard.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to submit proposal to backend.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.topBar, { backgroundColor: theme.surface, borderBottomColor: theme.border, paddingTop: Math.max(insets.top + 6, 16) }]}>
        <TouchableOpacity 
          style={[styles.closeBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }]} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: theme.textPrimary }]}>Institutional Proposal Submission</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 30, 48) }}>
        <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.inputLabel, { color: theme.textLight }]}>Research Project Title *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border }]}
            placeholder="e.g. AI-Powered Hyperspectral Imaging for Crop Disease..."
            placeholderTextColor={theme.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.inputLabel, { color: theme.textLight }]}>Principal Investigator (PI) ID (1-21) *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border }]}
            placeholder="1"
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            value={piId}
            onChangeText={setPiId}
          />

          <Text style={[styles.inputLabel, { color: theme.textLight }]}>Co-Investigators / Departmental Collaborators</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border }]}
            placeholder="e.g. Dr. Kavita Sahu (DCSA), Dr. Ranjit Rajak (DCSA)"
            placeholderTextColor={theme.textMuted}
            value={coInvestigators}
            onChangeText={setCoInvestigators}
          />

          <Text style={[styles.inputLabel, { color: theme.textLight }]}>Target Funding Agency *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border }]}
            placeholder="e.g. SERB / DST / MPCOST / ICMR / DBT / MeitY"
            placeholderTextColor={theme.textMuted}
            value={agency}
            onChangeText={setAgency}
          />

          <View style={styles.rowTwo}>
            <View style={{ flex: 1.2, marginRight: 8 }}>
              <Text style={[styles.inputLabel, { color: theme.textLight }]}>Requested Budget (₹ INR) *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border }]}
                placeholder="3500000"
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
                value={budget}
                onChangeText={setBudget}
              />
            </View>
            <View style={{ flex: 0.8 }}>
              <Text style={[styles.inputLabel, { color: theme.textLight }]}>Duration (Mo)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border }]}
                placeholder="36"
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
                value={duration}
                onChangeText={setDuration}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.85}
            disabled={submitting}
            onPress={handleSubmit}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.obsidian} />
            ) : (
              <Text style={styles.submitButtonText}>Submit to University Research Committee →</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 15,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formCard: {
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
  },
  inputLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    fontFamily: FONTS.bodyRegular,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 1,
  },
  rowTwo: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: COLORS.gold,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: FONTS.headingBold,
    fontSize: 13,
    color: COLORS.obsidian,
  }
});
