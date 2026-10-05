import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import Header from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../api/client';

export default function ScholarLibraryScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', 'DCSA', 'Physics', 'Mathematics', 'Chemistry', 'Botany'];

  const loadData = async () => {
    try {
      const res = await api.getPublications();
      if (res?.success) {
        setPapers(res.data);
        filterList(res.data, searchQuery, selectedDept);
      }
    } catch (e) {
      console.warn('Error loading library data', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filterList = (data, query, dept) => {
    let list = data || papers;
    if (dept !== 'All') {
      list = list.filter((p) => p.department === dept);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.author_name?.toLowerCase().includes(q) ||
          p.journal?.toLowerCase().includes(q) ||
          p.doi?.toLowerCase().includes(q)
      );
    }
    setFilteredPapers(list);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterList(papers, text, selectedDept);
  };

  const handleDept = (dept) => {
    setSelectedDept(dept);
    filterList(papers, searchQuery, dept);
  };

  const copyBibtex = (paper) => {
    const bibtexKey = `${paper.author_name?.split(' ').pop() || 'Scholar'}${paper.year || '2025'}`;
    const bib = `@article{${bibtexKey},
  title={{${paper.title}}},
  author={{${paper.author_name}}},
  journal={{${paper.journal || 'DHSGSU Research Journal'}}},
  year={${paper.year || 2024}},
  doi={${paper.doi || '10.1000/dhsgsu.res'}}
}`;
    Clipboard.setString(bib);
    Alert.alert('BibTeX Exported! 📋', `BibTeX entry for "${paper.title.substring(0, 30)}..." copied to clipboard.`);
  };

  const copyApa = (paper) => {
    const apa = `${paper.author_name} (${paper.year || 2024}). ${paper.title}. ${paper.journal || 'DHSGSU Journal'}. https://doi.org/${paper.doi || ''}`;
    Clipboard.setString(apa);
    Alert.alert('APA Citation Exported! 📋', 'Standard APA reference copied to clipboard.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Header
        title="DOI & Reference Hub"
        subtitle="DHSGSU Scopus / SCI Citation Desk"
        rightAction={() => navigation.navigate('Notifications')}
        rightIcon="notifications-outline"
      />

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
        <Ionicons name="search" size={18} color={theme.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: theme.textPrimary }]}
          placeholder="Search DOI, author, title, keywords..."
          placeholderTextColor={theme.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => handleSearch('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Department Chips */}
      <View style={styles.filterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {departments.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.filterChip,
                { backgroundColor: theme.surfaceCard, borderColor: theme.border },
                selectedDept === d && styles.filterChipActive
              ]}
              onPress={() => handleDept(d)}
            >
              <Text style={[styles.filterChipText, { color: theme.textMuted }, selectedDept === d && styles.filterChipTextActive]}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.emerald} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Indexing University Repository...</Text>
        </View>
      ) : (
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
          {filteredPapers.map((paper, idx) => (
            <View
              key={paper.id || idx}
              style={[styles.card, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.deptBadge}>
                  <Text style={styles.deptBadgeText}>{paper.department}</Text>
                </View>
                <View style={[styles.citationsBadge, { backgroundColor: theme.inputBg }]}>
                  <Ionicons name="trending-up" size={12} color={COLORS.emerald} style={{ marginRight: 4 }} />
                  <Text style={styles.citationsText}>{paper.citations || 0} Citations</Text>
                </View>
              </View>

              <Text style={[styles.paperTitle, { color: theme.textPrimary }]}>{paper.title}</Text>

              <View style={styles.metaRow}>
                <View style={styles.authorBadge}>
                  <Ionicons name="person" size={11} color={COLORS.emerald} style={{ marginRight: 4 }} />
                  <Text style={[styles.metaAuthor, { color: theme.textSecondary }]} numberOfLines={1}>
                    {paper.author_name}
                  </Text>
                </View>
                <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>
                <Text style={[styles.metaYear, { color: theme.textMuted }]}>{paper.year || 2024}</Text>
              </View>

              {paper.journal ? (
                <Text style={[styles.journalText, { color: theme.textMuted }]} numberOfLines={2}>
                  🏛️ {paper.journal}
                </Text>
              ) : null}

              {paper.doi ? (
                <View style={[styles.doiContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                  <Text style={[styles.doiLabel, { color: theme.textMuted }]}>DOI: </Text>
                  <Text style={styles.doiValue} numberOfLines={1} ellipsizeMode="middle">{paper.doi}</Text>
                </View>
              ) : null}

              {/* Citation Export Actions */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.exportBtn, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)' }]}
                  onPress={() => copyBibtex(paper)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="code-slash" size={13} color={COLORS.emerald} style={{ marginRight: 4 }} />
                  <Text style={styles.exportBtnText}>BibTeX</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.exportBtn, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)' }]}
                  onPress={() => copyApa(paper)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="copy-outline" size={13} color={COLORS.emerald} style={{ marginRight: 4 }} />
                  <Text style={styles.exportBtnText}>APA 7</Text>
                </TouchableOpacity>

                {paper.doi ? (
                  <TouchableOpacity
                    style={styles.openDoiBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      const url = paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`;
                      Linking.openURL(url).catch((e) => console.log(e));
                    }}
                  >
                    <Ionicons name="open-outline" size={13} color="#000" style={{ marginRight: 4 }} />
                    <Text style={styles.openDoiBtnText}>Direct Link</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 13,
  },
  filterWrap: {
    marginBottom: 4,
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: COLORS.emerald,
    borderColor: COLORS.emerald,
  },
  filterChipText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
  },
  filterChipTextActive: {
    color: '#000',
    fontFamily: FONTS.header,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
    paddingTop: 6,
  },
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  deptBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deptBadgeText: {
    color: COLORS.emerald,
    fontSize: 10,
    fontFamily: FONTS.header,
  },
  citationsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  citationsText: {
    color: COLORS.emerald,
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  paperTitle: {
    fontSize: 13,
    fontFamily: FONTS.header,
    lineHeight: 18,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 4,
  },
  authorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  metaAuthor: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  metaDot: {
    marginHorizontal: 2,
  },
  metaYear: {
    fontSize: 11,
    fontFamily: FONTS.body,
  },
  journalText: {
    fontSize: 11,
    fontFamily: FONTS.body,
    marginBottom: 8,
    lineHeight: 15,
  },
  doiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 10,
    borderWidth: 1,
  },
  doiLabel: {
    fontSize: 10,
    fontFamily: FONTS.header,
  },
  doiValue: {
    color: COLORS.emerald,
    fontSize: 10,
    fontFamily: FONTS.body,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  exportBtn: {
    flex: 1,
    minWidth: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  exportBtnText: {
    color: COLORS.emerald,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  openDoiBtn: {
    flex: 1.2,
    minWidth: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.emerald,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  openDoiBtnText: {
    color: '#000',
    fontSize: 11,
    fontFamily: FONTS.header,
  },
});
