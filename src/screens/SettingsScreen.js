import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
  Modal,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import Header from '../components/Header';
import UniversityLogo from '../components/UniversityLogo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen({ navigation }) {
  const { user, updateUserProfile, login, logout } = useAuth();
  const { themeMode, setThemeMode, isDark, theme } = useTheme();

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [course, setCourse] = useState(user?.course || user?.designation || '');
  const [department, setDepartment] = useState(user?.department || 'DCSA');
  const [specialization, setSpecialization] = useState(user?.specialization || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [orcid, setOrcid] = useState(user?.orcid || '');
  const [scopusId, setScopusId] = useState(user?.scopusId || '');
  const [scholarId, setScholarId] = useState(user?.scholarId || user?.studentId || '');
  const [bio, setBio] = useState(user?.bio || '');

  // Modals Visibility
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [appInfoModalVisible, setAppInfoModalVisible] = useState(false);
  const [policyModalVisible, setPolicyModalVisible] = useState(false);

  // Preference Toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  const departments = ['DCSA', 'Physics', 'Mathematics', 'Chemistry', 'Botany'];
  const role = user?.role || 'student';
  const accentColor = role === 'professor' ? COLORS.gold : role === 'scholar' ? COLORS.emerald : COLORS.cyan;

  const roleLabel = 
    role === 'professor' ? 'FACULTY PI / PROFESSOR' : 
    role === 'scholar' ? 'PH.D. RESEARCH SCHOLAR' : 'ENROLLED STUDENT';

  const defaultCourse = 
    role === 'professor' ? 'Professor & Principal Investigator' :
    role === 'scholar' ? 'Doctor of Philosophy (Ph.D.)' : 'Master of Computer Applications (MCA)';

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile({
        name: name.trim(),
        course: course.trim(),
        designation: course.trim(),
        department,
        specialization: specialization.trim(),
        email: email.trim(),
        phone: phone.trim(),
        orcid: orcid.trim(),
        scopusId: scopusId.trim(),
        scholarId: scholarId.trim(),
        bio: bio.trim(),
      });
      setEditModalVisible(false);
      Alert.alert('Profile Updated! ✅', 'Your institutional account details have been saved successfully.');
    } catch (e) {
      Alert.alert('Update Error', 'Unable to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleSwitch = (newRole) => {
    if (newRole === 'professor') {
      login('pssingh@dhsgsu.edu.in', 'password', 'professor', 'Dr. Pangambam Sendash Singh', 'DCSA');
    } else if (newRole === 'scholar') {
      login('neha.dcsa.phd@dhsgsu.edu.in', 'password', 'scholar', 'Neha Richhariya (Ph.D. Scholar)', 'DCSA');
    } else {
      login('student@dhsgsu.edu.in', 'password', 'student', 'Aarav Sharma', 'DCSA');
    }
  };

  const handleOpenLink = (url) => {
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Cannot open institutional webpage.'));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Settings & Governance"
        subtitle={`${user?.name || 'Account'} • ${role.toUpperCase()}`}
        showNotifications={false}
      />

      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ===================== 1. PROFILE INFO CARD ===================== */}
        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.profileTopRow}>
            <View style={[styles.avatarRing, { borderColor: accentColor, backgroundColor: `${accentColor}18` }]}>
              <Ionicons
                name={role === 'professor' ? 'ribbon' : role === 'scholar' ? 'school' : 'person'}
                size={30}
                color={accentColor}
              />
            </View>

            <View style={styles.profileInfoTextCol}>
              <View style={[styles.roleBadge, { backgroundColor: `${accentColor}18`, borderColor: accentColor }]}>
                <Text style={[styles.roleBadgeText, { color: accentColor }]}>{roleLabel}</Text>
              </View>

              <Text style={[styles.profileName, { color: theme.textPrimary }]} numberOfLines={1}>
                {user?.name || 'Academic User'}
              </Text>

              <Text style={[styles.profileCourse, { color: theme.textSecondary }]} numberOfLines={1}>
                🎓 {user?.course || user?.designation || defaultCourse}
              </Text>

              <Text style={[styles.profileDept, { color: theme.textMuted }]} numberOfLines={1}>
                🏛️ Dept of {user?.department || 'DCSA'}, DHSGSU Sagar
              </Text>
            </View>
          </View>

          {/* Specialization / ID snippet */}
          <View style={[styles.specializationBox, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)', borderColor: theme.border }]}>
            <Text style={[styles.specializationLabel, { color: theme.textMuted }]}>
              {role === 'scholar' ? 'THESIS FOCUS:' : role === 'professor' ? 'LAB EXPERTISE:' : 'SPECIALIZATION:'}
            </Text>
            <Text style={[styles.specializationValue, { color: theme.textPrimary }]} numberOfLines={1}>
              {user?.specialization || 'Applied Computing & R&D'}
            </Text>
          </View>
        </View>

        {/* ===================== 2. ACTION BUTTONS LIST ===================== */}
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Account & Configurations</Text>

        <View style={[styles.menuListCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Button 1: Edit Account Details */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]} 
            activeOpacity={0.7}
            onPress={() => setEditModalVisible(true)}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(6, 182, 212, 0.12)' }]}>
              <Ionicons name="create-outline" size={20} color={COLORS.cyan} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.menuItemTitle, { color: theme.textPrimary }]}>Edit Account Details</Text>
              <Text style={[styles.menuItemSub, { color: theme.textMuted }]}>Name, Course, Department, ORCID & Bio</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>

          {/* Button 2: Appearance & Theme */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]} 
            activeOpacity={0.7}
            onPress={() => setThemeModalVisible(true)}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
              <Ionicons name="color-palette-outline" size={20} color={COLORS.gold} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.menuItemTitle, { color: theme.textPrimary }]}>Appearance & Theme</Text>
              <Text style={[styles.menuItemSub, { color: theme.textMuted }]}>
                Current Mode: <Text style={{ fontFamily: FONTS.headingBold, color: accentColor }}>{themeMode.toUpperCase()}</Text>
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>

          {/* Button 3: App Info */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]} 
            activeOpacity={0.7}
            onPress={() => setAppInfoModalVisible(true)}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.emerald} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.menuItemTitle, { color: theme.textPrimary }]}>App Info & University Profile</Text>
              <Text style={[styles.menuItemSub, { color: theme.textMuted }]}>DHSGSU Sagar • Estd. 1946 • v2.4.0</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>

          {/* Button 4: Research Policies & UGC Rules */}
          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.7}
            onPress={() => setPolicyModalVisible(true)}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.12)' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.menuItemTitle, { color: theme.textPrimary }]}>Research Integrity & Policies</Text>
              <Text style={[styles.menuItemSub, { color: theme.textMuted }]}>UGC Guidelines, Plagiarism rules & DRC flow</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* ===================== 3. SYSTEM PREFERENCES ===================== */}
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Preferences & Alerts</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={[styles.switchTitle, { color: theme.textPrimary }]}>University Push Bulletins</Text>
              <Text style={[styles.switchSub, { color: theme.textMuted }]}>Grant deadlines, conferences & thesis endorsements</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#334155', true: accentColor }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.switchRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={[styles.switchTitle, { color: theme.textPrimary }]}>Offline Repository Cache</Text>
              <Text style={[styles.switchSub, { color: theme.textMuted }]}>Cache paper digests and faculty guide profiles</Text>
            </View>
            <Switch
              value={offlineSyncEnabled}
              onValueChange={setOfflineSyncEnabled}
              trackColor={{ false: '#334155', true: accentColor }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ===================== 4. LOGOUT BUTTON ===================== */}
        <TouchableOpacity 
          style={styles.logoutBtn} 
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to log out of your DHSGSU portal account?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: logout }
              ]
            );
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
          <Text style={styles.logoutBtnText}>Sign Out of University Portal</Text>
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: theme.textMuted }]}>
          Dr. Harisingh Gour Vishwavidyalaya • Central University Sagar (M.P.)
        </Text>
      </ScrollView>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT ACCOUNT DETAILS                                             */}
      {/* ========================================================================= */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>Edit Account Details</Text>
                <Text style={[styles.modalSubheading, { color: theme.textMuted }]}>Update your institutional profile information</Text>
              </View>
              <TouchableOpacity 
                style={[styles.modalCloseBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }]} 
                onPress={() => setEditModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 480 }}>
              {/* Name */}
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>FULL NAME *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Dr. Pangambam Sendash Singh"
                placeholderTextColor={theme.textMuted}
              />

              {/* Course / Degree */}
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>
                {role === 'student' ? 'COURSE / DEGREE PROGRAM *' : role === 'scholar' ? 'DOCTORAL PROGRAM / ENROLMENT *' : 'DESIGNATION / FACULTY TITLE *'}
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                value={course}
                onChangeText={setCourse}
                placeholder="e.g. MCA (Computer Science) / Ph.D. Scholar / Assistant Professor"
                placeholderTextColor={theme.textMuted}
              />

              {/* Department */}
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>DEPARTMENT *</Text>
              <View style={styles.deptChipsRow}>
                {departments.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.deptChip,
                      { backgroundColor: theme.inputBg, borderColor: theme.border },
                      department === d && { backgroundColor: accentColor, borderColor: accentColor },
                    ]}
                    onPress={() => setDepartment(d)}
                  >
                    <Text style={[styles.deptChipText, { color: department === d ? '#000' : theme.textSecondary }]}>
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Specialization */}
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>
                {role === 'scholar' ? 'THESIS TOPIC / DISSERTATION *' : 'SPECIALIZATION / RESEARCH DOMAIN *'}
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                value={specialization}
                onChangeText={setSpecialization}
                placeholder="e.g. Deep Learning, Remote Sensing & NLP"
                placeholderTextColor={theme.textMuted}
              />

              {/* Email */}
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>INSTITUTIONAL EMAIL</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="user@dhsgsu.edu.in"
                placeholderTextColor={theme.textMuted}
              />

              {/* Phone */}
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>PHONE / MOBILE NUMBER</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+91 94251 XXXXX"
                placeholderTextColor={theme.textMuted}
              />

              {/* ORCID / Scopus */}
              {(role === 'scholar' || role === 'professor') && (
                <>
                  <Text style={[styles.inputLabel, { color: theme.textMuted }]}>ORCID IDENTIFIER</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                    value={orcid}
                    onChangeText={setOrcid}
                    placeholder="0000-0002-XXXX-XXXX"
                    placeholderTextColor={theme.textMuted}
                  />

                  <Text style={[styles.inputLabel, { color: theme.textMuted }]}>SCOPUS AUTHOR ID</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                    value={scopusId}
                    onChangeText={setScopusId}
                    placeholder="57194829101"
                    placeholderTextColor={theme.textMuted}
                  />
                </>
              )}

              {/* Bio */}
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>ACADEMIC BIO / SUMMARY</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                placeholder="Brief summary of research experience and academic background..."
                placeholderTextColor={theme.textMuted}
              />

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: accentColor }]}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={18} color="#000" style={{ marginRight: 6 }} />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: APPEARANCE & THEME                                               */}
      {/* ========================================================================= */}
      <Modal visible={themeModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>Appearance & Theme</Text>
                <Text style={[styles.modalSubheading, { color: theme.textMuted }]}>Choose your preferred visual style</Text>
              </View>
              <TouchableOpacity 
                style={[styles.modalCloseBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }]} 
                onPress={() => setThemeModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.themeOptionsCol}>
              {/* Option 1: Dark Mode */}
              <TouchableOpacity
                style={[
                  styles.themeOptionCard,
                  { backgroundColor: theme.inputBg, borderColor: theme.border },
                  themeMode === 'dark' && { borderColor: accentColor, backgroundColor: `${accentColor}14` }
                ]}
                onPress={() => setThemeMode('dark')}
              >
                <View style={[styles.themeOptionIconCircle, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
                  <Ionicons name="moon" size={20} color={themeMode === 'dark' ? accentColor : '#CBD5E1'} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.themeOptionTitle, { color: theme.textPrimary }]}>Dark Mode</Text>
                  <Text style={[styles.themeOptionSub, { color: theme.textMuted }]}>Obsidian dark palette optimized for battery & low-light</Text>
                </View>
                {themeMode === 'dark' && <Ionicons name="checkmark-circle" size={22} color={accentColor} />}
              </TouchableOpacity>

              {/* Option 2: Light Mode */}
              <TouchableOpacity
                style={[
                  styles.themeOptionCard,
                  { backgroundColor: theme.inputBg, borderColor: theme.border },
                  themeMode === 'light' && { borderColor: accentColor, backgroundColor: `${accentColor}14` }
                ]}
                onPress={() => setThemeMode('light')}
              >
                <View style={[styles.themeOptionIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Ionicons name="sunny" size={20} color={themeMode === 'light' ? accentColor : '#F59E0B'} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.themeOptionTitle, { color: theme.textPrimary }]}>Light Mode</Text>
                  <Text style={[styles.themeOptionSub, { color: theme.textMuted }]}>High-contrast clean institutional daylight appearance</Text>
                </View>
                {themeMode === 'light' && <Ionicons name="checkmark-circle" size={22} color={accentColor} />}
              </TouchableOpacity>

              {/* Option 3: System Mode */}
              <TouchableOpacity
                style={[
                  styles.themeOptionCard,
                  { backgroundColor: theme.inputBg, borderColor: theme.border },
                  themeMode === 'system' && { borderColor: accentColor, backgroundColor: `${accentColor}14` }
                ]}
                onPress={() => setThemeMode('system')}
              >
                <View style={[styles.themeOptionIconCircle, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
                  <Ionicons name="phone-portrait-outline" size={20} color={themeMode === 'system' ? accentColor : COLORS.cyan} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.themeOptionTitle, { color: theme.textPrimary }]}>System Default</Text>
                  <Text style={[styles.themeOptionSub, { color: theme.textMuted }]}>Automatically synchronize with your device OS settings</Text>
                </View>
                {themeMode === 'system' && <Ionicons name="checkmark-circle" size={22} color={accentColor} />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: accentColor, marginTop: 14 }]}
              onPress={() => setThemeModalVisible(false)}
            >
              <Text style={styles.saveButtonText}>Apply Theme</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: APP INFO & UNIVERSITY DETAILS                                    */}
      {/* ========================================================================= */}
      <Modal visible={appInfoModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>About DHSGSU R&D Portal</Text>
                <Text style={[styles.modalSubheading, { color: theme.textMuted }]}>Institutional Research & Development Ecosystem</Text>
              </View>
              <TouchableOpacity 
                style={[styles.modalCloseBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }]} 
                onPress={() => setAppInfoModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 440 }}>
              <View style={{ alignItems: 'center', marginVertical: 12 }}>
                <UniversityLogo size={74} color={COLORS.gold} />
                <Text style={[styles.infoUniName, { color: theme.textPrimary }]}>
                  Dr. Harisingh Gour Vishwavidyalaya
                </Text>
                <Text style={[styles.infoUniSub, { color: COLORS.gold }]}>
                  (A Central University • Estd. 1946 • NAAC 'A' Grade)
                </Text>
                <Text style={[styles.infoLocation, { color: theme.textMuted }]}>
                  Sagar, Madhya Pradesh 470003, India
                </Text>
              </View>

              <View style={[styles.infoDetailsCard, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoRowLabel, { color: theme.textMuted }]}>Application Version:</Text>
                  <Text style={[styles.infoRowValue, { color: theme.textPrimary }]}>2.4.0 (Build 2026.10)</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <View style={styles.infoRow}>
                  <Text style={[styles.infoRowLabel, { color: theme.textMuted }]}>Covered Departments:</Text>
                  <Text style={[styles.infoRowValue, { color: theme.textPrimary }]}>DCSA, Physics, Math, Chem, Botany</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <View style={styles.infoRow}>
                  <Text style={[styles.infoRowLabel, { color: theme.textMuted }]}>R&D Grants Sanctioned:</Text>
                  <Text style={[styles.infoRowValue, { color: COLORS.emerald }]}>₹2.65 Crore (SERB, MPCOST)</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <View style={styles.infoRow}>
                  <Text style={[styles.infoRowLabel, { color: theme.textMuted }]}>Technical Cell:</Text>
                  <Text style={[styles.infoRowValue, { color: theme.textPrimary }]}>Dept. of Computer Science & Applications</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.webLinkBtn, { borderColor: COLORS.cyan }]}
                onPress={() => handleOpenLink('https://dhsgsu.edu.in')}
              >
                <Ionicons name="globe-outline" size={16} color={COLORS.cyan} style={{ marginRight: 6 }} />
                <Text style={[styles.webLinkBtnText, { color: COLORS.cyan }]}>Visit Official University Portal ↗</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 4: RESEARCH POLICIES & UGC RULES                                    */}
      {/* ========================================================================= */}
      <Modal visible={policyModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>Research Integrity Policies</Text>
                <Text style={[styles.modalSubheading, { color: theme.textMuted }]}>DHSGSU & UGC Doctoral Publishing Directives</Text>
              </View>
              <TouchableOpacity 
                style={[styles.modalCloseBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }]} 
                onPress={() => setPolicyModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 440 }}>
              <View style={[styles.policyItem, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Text style={[styles.policyTitle, { color: COLORS.emerald }]}>1. Mandatory Supervisor Sign-off</Text>
                <Text style={[styles.policyBody, { color: theme.textSecondary }]}>
                  Under university statutes, every Ph.D. scholar must submit draft manuscripts to their recognized research supervisor before journal transmission or institutional repository indexing.
                </Text>
              </View>

              <View style={[styles.policyItem, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Text style={[styles.policyTitle, { color: COLORS.cyan }]}>2. Urkund Plagiarism Permissible Limit</Text>
                <Text style={[styles.policyBody, { color: theme.textSecondary }]}>
                  Overall similarity index must remain strictly ≤ 10% (excluding common bibliography and quoted phrases) as certified by the central library INFLIBNET cell.
                </Text>
              </View>

              <View style={[styles.policyItem, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Text style={[styles.policyTitle, { color: COLORS.gold }]}>3. Institutional Affiliation Standard</Text>
                <Text style={[styles.policyBody, { color: theme.textSecondary }]}>
                  Affiliation must read: "Department of [Name], Dr. Harisingh Gour Vishwavidyalaya (A Central University), Sagar 470003, M.P., India."
                </Text>
              </View>
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
  profileCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  profileInfoTextCol: {
    flex: 1,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 4,
  },
  roleBadgeText: {
    fontFamily: FONTS.headingBold,
    fontSize: 9,
    letterSpacing: 0.4,
  },
  profileName: {
    fontFamily: FONTS.headingBold,
    fontSize: 16,
    marginBottom: 2,
  },
  profileCourse: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    marginBottom: 2,
  },
  profileDept: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
  },
  specializationBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  specializationLabel: {
    fontFamily: FONTS.headingBold,
    fontSize: 9,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  specializationValue: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
  },
  sectionHeading: {
    fontFamily: FONTS.headingBold,
    fontSize: 13,
    letterSpacing: 0.2,
    marginBottom: 8,
    marginTop: 6,
  },
  menuListCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextCol: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 13,
    marginBottom: 2,
  },
  menuItemSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  switchTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 13,
    marginBottom: 2,
  },
  switchSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  roleButtonsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  roleSwitchBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleSwitchBtnText: {
    fontFamily: FONTS.headingBold,
    fontSize: 11,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  logoutBtnText: {
    fontFamily: FONTS.headingBold,
    fontSize: 13,
    color: '#EF4444',
  },
  footerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 10,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    maxHeight: '90%',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalHeading: {
    fontFamily: FONTS.headingBold,
    fontSize: 16,
  },
  modalSubheading: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontFamily: FONTS.headingBold,
    fontSize: 10,
    letterSpacing: 0.4,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  deptChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  deptChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  deptChipText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  saveButtonText: {
    fontFamily: FONTS.headingBold,
    fontSize: 13,
    color: '#000',
  },

  // Theme options
  themeOptionsCol: {
    gap: 10,
    marginVertical: 10,
  },
  themeOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  themeOptionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeOptionTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 13,
    marginBottom: 2,
  },
  themeOptionSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
  },

  // App Info
  infoUniName: {
    fontFamily: FONTS.headingBold,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  infoUniSub: {
    fontFamily: FONTS.headingSemiBold,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  infoLocation: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    marginTop: 2,
  },
  infoDetailsCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoRowLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
  },
  infoRowValue: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
  },
  webLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 8,
  },
  webLinkBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
  },

  // Policy Items
  policyItem: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  policyTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 12,
    marginBottom: 4,
  },
  policyBody: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    lineHeight: 16,
  },
});
