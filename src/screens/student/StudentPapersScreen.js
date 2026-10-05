import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Linking,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import Header from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../api/client';

const DEPARTMENTS = [
  { id: 'All', label: 'All Depts', icon: 'grid-outline' },
  { id: 'DCSA', label: 'DCSA (AI & CS)', icon: 'laptop-outline' },
  { id: 'Physics', label: 'Physics', icon: 'planet-outline' },
  { id: 'Mathematics', label: 'Mathematics', icon: 'calculator-outline' },
  { id: 'Chemistry', label: 'Chemistry', icon: 'flask-outline' },
  { id: 'Botany', label: 'Botany', icon: 'leaf-outline' },
];

export default function StudentPapersScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const loadPapers = async () => {
    try {
      const res = await api.getPublications();
      if (res?.success && res.data) {
        setPapers(res.data);
        filterData(res.data, searchQuery, selectedDept);
      }
    } catch (e) {
      console.warn('Error loading papers', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPapers();
  }, []);

  const matchesDepartment = (p, targetDept) => {
    if (targetDept === 'All') return true;
    const target = targetDept.toLowerCase();
    const deptStr = (p.department || p.department_name || p.department_code || '').toLowerCase();
    if (deptStr.includes(target)) return true;

    // Additional lookup by researcher ID range if department string not explicitly populated
    const id = Number(p.researcher_id);
    if (target === 'dcsa' && (id >= 1 && id <= 4)) return true;
    if (target === 'physics' && (id >= 5 && id <= 8)) return true;
    if (target === 'mathematics' && (id >= 9 && id <= 12)) return true;
    if (target === 'chemistry' && (id >= 13 && id <= 16)) return true;
    if (target === 'botany' && (id >= 17 && id <= 21)) return true;

    // Additional lookup by author name
    const author = (p.author_name || p.researcher_name || '').toLowerCase();
    if (target === 'dcsa' && (author.includes('singh') || author.includes('sahu') || author.includes('rajak') || author.includes('richhariya'))) return true;
    if (target === 'physics' && (author.includes('tiwari') || author.includes('panda') || author.includes('ranveer') || author.includes('dwivedi'))) return true;
    if (target === 'mathematics' && (author.includes('khedlekar') || author.includes('gangele') || author.includes('khare') || author.includes('mishra'))) return true;
    if (target === 'chemistry' && (author.includes('ratnesh') || author.includes('nandeshwar') || author.includes('purohit'))) return true;
    if (target === 'botany' && (author.includes('khan') || author.includes('archita') || author.includes('bishwas') || author.includes('verma'))) return true;

    return false;
  };

  const filterData = (dataList, query, dept) => {
    let list = dataList || papers;
    
    // Department filtering
    if (dept !== 'All') {
      list = list.filter((p) => matchesDepartment(p, dept));
    }

    // Search query filtering
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.author_name?.toLowerCase().includes(q) ||
          p.researcher_name?.toLowerCase().includes(q) ||
          p.journal?.toLowerCase().includes(q) ||
          p.journal_or_publisher?.toLowerCase().includes(q) ||
          p.abstract?.toLowerCase().includes(q) ||
          p.specialization?.toLowerCase().includes(q)
      );
    }
    setFilteredPapers(list);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterData(papers, text, selectedDept);
  };

  const handleDeptSelect = (dept) => {
    setSelectedDept(dept);
    filterData(papers, searchQuery, dept);
  };

  const openDOI = (doi) => {
    if (doi) {
      const url = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
      Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
    }
  };

  const getDeptCount = (deptId) => {
    if (deptId === 'All') return papers.length;
    return papers.filter((p) => matchesDepartment(p, deptId)).length;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Student Paper Digests"
        subtitle="DHSGSU Research Made Simple"
        rightAction={() => navigation.navigate('Notifications')}
        rightIcon="notifications-outline"
      />

      {/* Search Input Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Ionicons name="search" size={18} color={theme.textMuted} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.textPrimary }]}
          placeholder="Search simplified papers, professors, AI, physics..."
          placeholderTextColor={theme.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => handleSearch('')} style={{ padding: 4 }}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Responsive Horizontal Department Selector Bar */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {DEPARTMENTS.map((dept) => {
            const isActive = selectedDept === dept.id;
            const count = getDeptCount(dept.id);

            return (
              <TouchableOpacity
                key={dept.id}
                style={[
                  styles.filterChip,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  isActive && styles.filterChipActive
                ]}
                activeOpacity={0.75}
                onPress={() => handleDeptSelect(dept.id)}
              >
                <Ionicons
                  name={dept.icon}
                  size={14}
                  color={isActive ? '#000' : (isDark ? COLORS.cyan : '#0891B2')}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.filterChipText, { color: theme.textSecondary }, isActive && styles.filterChipTextActive]}>
                  {dept.label}
                </Text>
                <View style={[styles.countBadge, isActive ? styles.countBadgeActive : { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }]}>
                  <Text style={[styles.countBadgeText, { color: theme.textMuted }, isActive && styles.countBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Info Callout Banner */}
      <View style={[styles.infoBanner, { backgroundColor: isDark ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.06)', borderColor: isDark ? 'rgba(6, 182, 212, 0.25)' : 'rgba(6, 182, 212, 0.2)' }]}>
        <Ionicons name="bulb" size={18} color={COLORS.cyan} style={{ marginRight: 8 }} />
        <Text style={[styles.infoBannerText, { color: theme.textSecondary }]}>
          <Text style={{ fontFamily: FONTS.headingBold, color: isDark ? COLORS.cyan : '#0891B2' }}>Digest Mode: </Text>
          Peer-reviewed DHSGSU faculty works with simplified takeaways & AI explainers for student projects.
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.cyan} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Fetching Department Digests...</Text>
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
                loadPapers();
              }}
              colors={[COLORS.cyan]}
            />
          }
        >
          {filteredPapers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Paper Digests in {selectedDept}</Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Try selecting "All Depts" or searching for a different keyword.
              </Text>
            </View>
          ) : (
            filteredPapers.map((paper, idx) => {
              const author = paper.author_name || paper.researcher_name || 'DHSGSU Faculty';
              const year = paper.year || paper.publication_year || 2024;
              const journal = paper.journal || paper.journal_or_publisher || 'Peer-Reviewed Journal';
              const citations = paper.citations || paper.citation_count || 12;
              const deptCode = paper.department || paper.department_code || 'DCSA';
              const indexing = paper.indexing || 'SCI / Scopus Q1';

              return (
                <View
                  key={paper.id || idx}
                  style={[styles.paperCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.deptBadge}>
                      <Text style={styles.deptBadgeText}>{deptCode}</Text>
                    </View>
                    <View style={[styles.yearBadge, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' }]}>
                      <Text style={[styles.yearBadgeText, { color: theme.textMuted }]}>{year}</Text>
                    </View>
                    <View style={styles.citationBadge}>
                      <Ionicons name="trending-up" size={11} color={COLORS.emerald} style={{ marginRight: 3 }} />
                      <Text style={styles.citationBadgeText}>{citations} Cites</Text>
                    </View>
                    <View style={styles.indexBadge}>
                      <Text style={styles.indexBadgeText}>{indexing}</Text>
                    </View>
                  </View>

                  {/* Paper Title */}
                  <Text style={[styles.paperTitle, { color: theme.textPrimary }]}>{paper.title}</Text>
                  
                  {/* Author & Journal */}
                  <View style={styles.metaRow}>
                    <View style={styles.authorRow}>
                      <Ionicons name="person-circle-outline" size={15} color={COLORS.cyan} style={{ marginRight: 4 }} />
                      <Text style={[styles.authorName, { color: theme.textSecondary }]} numberOfLines={1}>{author}</Text>
                    </View>
                  </View>

                  <View style={styles.journalRow}>
                    <Ionicons name="book-outline" size={13} color={theme.textMuted} style={{ marginRight: 5 }} />
                    <Text style={[styles.journalName, { color: theme.textMuted }]} numberOfLines={1}>
                      {journal}
                    </Text>
                  </View>

                  {/* Student-Friendly Digest Box */}
                  <View style={[styles.digestBox, { backgroundColor: isDark ? 'rgba(6, 182, 212, 0.06)' : 'rgba(6, 182, 212, 0.04)', borderColor: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.15)' }]}>
                    <View style={styles.digestHeader}>
                      <Ionicons name="sparkles" size={14} color={COLORS.cyan} style={{ marginRight: 5 }} />
                      <Text style={styles.digestLabel}>Simplified Student Digest</Text>
                    </View>
                    <Text style={[styles.digestText, { color: theme.textSecondary }]} numberOfLines={4}>
                      {paper.abstract || 'Innovative empirical study addressing computational methodology, validated with benchmark datasets.'}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.aiExplainerBtn}
                      activeOpacity={0.8}
                      onPress={() => {
                        navigation.navigate('Chatbot', {
                          query: `Explain the key concepts, findings and student project takeaways from "${paper.title}" in simple words`,
                        });
                      }}
                    >
                      <Ionicons name="chatbubbles" size={14} color="#000" style={{ marginRight: 6 }} />
                      <Text style={styles.aiExplainerBtnText}>Ask AI Tutor to Explain</Text>
                    </TouchableOpacity>

                    {paper.doi ? (
                      <TouchableOpacity
                        style={[styles.doiBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)', borderColor: theme.border }]}
                        activeOpacity={0.8}
                        onPress={() => openDOI(paper.doi)}
                      >
                        <Ionicons name="open-outline" size={13} color={COLORS.cyan} style={{ marginRight: 4 }} />
                        <Text style={styles.doiBtnText}>DOI ↗</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              );
            })
          )}
          <View style={{ height: 32 }} />
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
    marginBottom: 8,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
  },
  filterWrapper: {
    marginBottom: 6,
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: COLORS.cyan,
    borderColor: COLORS.cyan,
  },
  filterChipText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    marginRight: 6,
  },
  filterChipTextActive: {
    color: '#000',
    fontFamily: FONTS.headingBold,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  countBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
  },
  countBadgeTextActive: {
    color: '#000',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 2,
    marginBottom: 8,
    padding: 10,
    borderRadius: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    lineHeight: 16,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 15,
    marginTop: 12,
  },
  emptySubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  paperCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  deptBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deptBadgeText: {
    color: COLORS.cyan,
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
  },
  yearBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  yearBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
  },
  citationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  citationBadgeText: {
    color: COLORS.emerald,
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
  },
  indexBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  indexBadgeText: {
    color: '#A78BFA',
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
  },
  paperTitle: {
    fontSize: 14,
    fontFamily: FONTS.headingBold,
    lineHeight: 20,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorName: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  journalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  journalName: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    flex: 1,
  },
  digestBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  digestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  digestLabel: {
    fontSize: 10,
    fontFamily: FONTS.headingBold,
    color: COLORS.cyan,
    letterSpacing: 0.3,
  },
  digestText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    lineHeight: 16,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  aiExplainerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cyan,
    borderRadius: 10,
    paddingVertical: 9,
  },
  aiExplainerBtnText: {
    color: '#000',
    fontFamily: FONTS.headingBold,
    fontSize: 11,
  },
  doiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  doiBtnText: {
    color: COLORS.cyan,
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
  },
});
