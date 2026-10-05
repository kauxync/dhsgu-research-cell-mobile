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

export default function AddPublicationModal({ navigation }) {
  const insets = useSafeAreaInsets();
  const [entryType, setEntryType] = useState('Paper'); // 'Paper' or 'Patent'
  const [title, setTitle] = useState('');
  const [researcherId, setResearcherId] = useState('1');
  const [pubType, setPubType] = useState('Journal Paper');
  const [journal, setJournal] = useState('');
  const [year, setYear] = useState('2026');
  const [doi, setDoi] = useState('');
  const [abstract, setAbstract] = useState('');
  
  const [patentNumber, setPatentNumber] = useState('');
  const [patentStatus, setPatentStatus] = useState('Filed');

  const [submitting, setSubmitting] = useState(false);
  const { theme, isDark } = useTheme();

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter title / work name');
      return;
    }

    setSubmitting(true);
    try {
      if (entryType === 'Paper') {
        if (!journal.trim()) {
          Alert.alert('Validation Error', 'Please enter Journal / Publisher name');
          setSubmitting(false);
          return;
        }
        await api.createPublication({
          title: title.trim(),
          researcher_id: Number(researcherId),
          type: pubType,
          journal_or_publisher: journal.trim(),
          publication_year: Number(year),
          doi: doi.trim(),
          abstract: abstract.trim(),
          indexing: 'Scopus / SCI'
        });
        Alert.alert('Success', 'Research publication logged to DHSGSU MySQL database!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        if (!patentNumber.trim()) {
          Alert.alert('Validation Error', 'Please specify Patent / Application Number');
          setSubmitting(false);
          return;
        }
        await api.createPatent({
          title: title.trim(),
          inventor_id: Number(researcherId),
          patent_number: patentNumber.trim(),
          filing_date: new Date().toISOString().split('T')[0],
          status: patentStatus,
          abstract: abstract.trim(),
          jurisdiction: 'India / IPO'
        });
        Alert.alert('Success', 'Patent disclosure logged to DHSGSU IP Cell!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (e) {
      Alert.alert('Submission Error', 'Could not record document.');
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
        <Text style={[styles.topBarTitle, { color: theme.textPrimary }]}>Log Research Document</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 30, 48), width: '100%', maxWidth: 720, alignSelf: 'center' }}
      >
        {/* Entry Switcher */}
        <View style={[styles.entrySwitcher, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity 
            style={[styles.entryTab, entryType === 'Paper' && styles.entryTabActiveCyan]}
            onPress={() => setEntryType('Paper')}
          >
            <Text style={[styles.entryTabText, { color: theme.textSecondary }, entryType === 'Paper' && { color: theme.textPrimary, fontFamily: FONTS.bodyBold }]}>
              📄 Research Paper
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.entryTab, entryType === 'Patent' && styles.entryTabActiveGold]}
            onPress={() => setEntryType('Patent')}
          >
            <Text style={[styles.entryTabText, { color: theme.textSecondary }, entryType === 'Patent' && { color: theme.textPrimary, fontFamily: FONTS.bodyBold }]}>
              🛡️ Patent (IPO)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.inputLabel, { color: theme.textLight }]}>Title of Paper / Patent *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border }]}
            placeholder="e.g. Deep Learning for Hyperspectral Imaging..."
            placeholderTextColor={theme.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.inputLabel, { color: theme.textLight }]}>Author / Lead Researcher ID (1-21)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border }]}
            placeholder="1"
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            value={researcherId}
            onChangeText={setResearcherId}
          />

          {entryType === 'Paper' ? (
            <>
              <Text style={[styles.inputLabel, { color: theme.textLight }]}>Journal or Publisher *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border }]}
                placeholder="e.g. IEEE Transactions / Elsevier / Springer"
                placeholderTextColor={theme.textMuted}
                value={journal}
                onChangeText={setJournal}
              />

              <View style={styles.rowTwo}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.inputLabel, { color: theme.textLight }]}>Year</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border }]}
                    placeholder="2026"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="number-pad"
                    value={year}
                    onChangeText={setYear}
                  />
                </View>
                <View style={{ flex: 1.5 }}>
                  <Text style={[styles.inputLabel, { color: theme.textLight }]}>DOI (Optional)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border }]}
                    placeholder="10.1109/..."
                    placeholderTextColor={theme.textMuted}
                    value={doi}
                    onChangeText={setDoi}
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.inputLabel, { color: theme.textLight }]}>Patent Application Number *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border }]}
                placeholder="e.g. IN202421048291"
                placeholderTextColor={theme.textMuted}
                value={patentNumber}
                onChangeText={setPatentNumber}
              />

              <Text style={[styles.inputLabel, { color: theme.textLight }]}>Status</Text>
              <View style={styles.statusChipsRow}>
                {['Filed', 'Published', 'Granted'].map((st) => (
                  <TouchableOpacity
                    key={st}
                    style={[
                      styles.statusChip, 
                      { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', borderColor: theme.border },
                      patentStatus === st && styles.statusChipActive
                    ]}
                    onPress={() => setPatentStatus(st)}
                  >
                    <Text style={[styles.statusChipText, { color: theme.textSecondary }, patentStatus === st && styles.statusChipTextActive]}>{st}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Text style={[styles.inputLabel, { color: theme.textLight }]}>Abstract / Summary</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', color: theme.textPrimary, borderColor: theme.border, height: 90, textAlignVertical: 'top' }]}
            placeholder="Brief description of findings, methodology, and outcome..."
            placeholderTextColor={theme.textMuted}
            multiline
            value={abstract}
            onChangeText={setAbstract}
          />

          {/* Submit Action */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: entryType === 'Paper' ? COLORS.cyan : COLORS.gold }]}
            activeOpacity={0.85}
            disabled={submitting}
            onPress={handleSubmit}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.obsidian} />
            ) : (
              <Text style={styles.submitButtonText}>
                {entryType === 'Paper' ? 'Submit Publication to Repository →' : 'Log Patent Disclosure →'}
              </Text>
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
    backgroundColor: COLORS.background,
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
  closeBtn: {
    width: 36,
    height: 36,
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
  entrySwitcher: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginTop: 14,
    marginBottom: 12,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  entryTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  entryTabActiveCyan: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.cyan,
  },
  entryTabActiveGold: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  entryTabText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  entryTabTextActive: {
    color: COLORS.textPrimary,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  inputLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    fontFamily: FONTS.bodyRegular,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rowTwo: {
    flexDirection: 'row',
  },
  statusChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusChipActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: COLORS.gold,
  },
  statusChipText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  statusChipTextActive: {
    color: COLORS.gold,
  },
  submitButton: {
    marginTop: 20,
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
