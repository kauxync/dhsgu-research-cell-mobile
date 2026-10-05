import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ScrollView,
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

export default function StudentMentorsScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchResearchers = async () => {
    try {
      const params = {};
      if (selectedDept !== 'All') params.department = selectedDept;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.getResearchers(params);
      if (res && res.success) {
        setResearchers(res.data);
      }
    } catch (e) {
      console.warn('Error fetching mentors', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResearchers();
  }, [selectedDept]);

  const handleSearch = () => {
    setLoading(true);
    fetchResearchers();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchResearchers();
  };

  const handleRequestMentorship = (mentorName) => {
    Alert.alert(
      'Mentorship Inquiry Sent! 🎓',
      `Your request to collaborate on academic student projects with ${mentorName} has been transmitted to their institutional email.`
    );
  };

  const renderMentorCard = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ResearcherDetail', { id: item.id, researcher: item })}
      >
        <View style={styles.cardTop}>
          <Image
            source={{ uri: item.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
            style={styles.avatar}
          />
          <View style={styles.infoCol}>
            <Text style={[styles.nameText, { color: theme.textPrimary }]}>{item.name}</Text>
            <Text style={styles.desigText}>{item.designation}</Text>
            <Text style={[styles.deptText, { color: theme.textSecondary }]}>🏛️ {item.department_name}</Text>
          </View>
        </View>

        <View style={[styles.specBox, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)' }]}>
          <Text style={[styles.specText, { color: theme.textSecondary }]}>🎯 {item.specialization}</Text>
        </View>
      </TouchableOpacity>

      <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
        <View style={styles.metricRow}>
          <Text style={styles.hIndexTag}>H-Index: {item.h_index}</Text>
          <Text style={[styles.citTag, { color: theme.textSecondary, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' }]}>
            {item.citations_count} Citations
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.mentorBtn}
          activeOpacity={0.8}
          onPress={() => handleRequestMentorship(item.name)}
        >
          <Ionicons name="mail-outline" size={13} color="#000" style={{ marginRight: 4 }} />
          <Text style={styles.mentorBtnText}>Ask Mentorship</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Find Faculty Guides" subtitle="DHSGSU Student Mentorship Roster" navigation={navigation} />

      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Ionicons name="search" size={18} color={theme.textMuted} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.searchInput, { color: theme.textPrimary }]}
          placeholder="Search by faculty, AI, remote sensing, polymers..."
          placeholderTextColor={theme.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => { setSearchQuery(''); handleSearch(); }} style={{ padding: 4 }}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Responsive Department Filter Bar */}
      <View style={styles.deptTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}
        >
          {DEPARTMENTS.map((dept) => {
            const isActive = selectedDept === dept.id;
            return (
              <TouchableOpacity
                key={dept.id}
                style={[
                  styles.deptTab,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  isActive && styles.deptTabActive
                ]}
                activeOpacity={0.75}
                onPress={() => setSelectedDept(dept.id)}
              >
                <Ionicons
                  name={dept.icon}
                  size={14}
                  color={isActive ? '#000' : (isDark ? COLORS.cyan : '#0891B2')}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.deptTabText, { color: theme.textSecondary }, isActive && styles.deptTabTextActive]}>
                  {dept.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.cyan} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Loading Faculty Guides...</Text>
        </View>
      ) : (
        <FlatList
          data={researchers}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMentorCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.cyan]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Faculty Guides Found</Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>Try changing your department or search query.</Text>
            </View>
          }
        />
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
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
  },
  deptTabsContainer: {
    marginBottom: 8,
  },
  deptTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  deptTabActive: {
    backgroundColor: COLORS.cyan,
    borderColor: COLORS.cyan,
  },
  deptTabText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
  },
  deptTabTextActive: {
    color: '#000',
    fontFamily: FONTS.headingBold,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
  },
  infoCol: {
    flex: 1,
  },
  nameText: {
    fontFamily: FONTS.headingBold,
    fontSize: 14,
  },
  desigText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.cyan,
    marginTop: 2,
  },
  deptText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    marginTop: 2,
  },
  specBox: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  specText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hIndexTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
  },
  citTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
  },
  mentorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cyan,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  mentorBtnText: {
    fontFamily: FONTS.headingBold,
    fontSize: 11,
    color: '#000',
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
});
