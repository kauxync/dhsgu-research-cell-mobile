import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UniversityLogo from '../components/UniversityLogo';

const ROLES = [
  {
    id: 'student',
    title: 'Student',
    tagline: 'Undergraduate / Postgraduate',
    icon: 'school',
    color: COLORS.cyan,
    desc: 'Access faculty guides, mentorship requests, simplified paper digests & lab openings.',
  },
  {
    id: 'scholar',
    title: 'Research Scholar',
    tagline: 'Ph.D. / JRF / Postdoc Fellow',
    icon: 'flask',
    color: COLORS.emerald,
    desc: '4-Stage thesis roadmap, fellowship tracker, plagiarism scanner & supervisor sign-off.',
  },
  {
    id: 'professor',
    title: 'Professor / PI',
    tagline: 'Principal Investigator & Faculty',
    icon: 'ribbon',
    color: COLORS.gold,
    desc: '₹2.65 Cr R&D grant portfolio, 3-tier DRC approvals, patent showcase & scholar desk.',
  },
];

const DEPARTMENTS = [
  'DCSA',
  'Physics',
  'Mathematics',
  'Chemistry',
  'Botany',
];

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { login, register } = useAuth();
  const { theme, isDark } = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState('student');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('DCSA');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeRoleObj = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  const handleQuickLogin = async (roleType) => {
    setLoading(true);
    try {
      if (roleType === 'professor') {
        await login('pssingh@dhsgsu.edu.in', 'password', 'professor', 'Dr. Pangambam Sendash Singh', 'DCSA');
      } else if (roleType === 'scholar') {
        await login('neha.dcsa.phd@dhsgsu.edu.in', 'password', 'scholar', 'Neha Richhariya (Ph.D. Scholar)', 'DCSA');
      } else {
        await login('student@dhsgsu.edu.in', 'password', 'student', 'Aarav Sharma', 'DCSA');
      }
    } catch (e) {
      Alert.alert('Login Error', 'Unable to initialize session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your university email and password.');
      return;
    }

    if (!isLogin && !name.trim()) {
      Alert.alert('Missing Name', 'Please enter your full name for registration.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email.trim(), password.trim(), selectedRole, null, department);
      } else {
        await register(name.trim(), email.trim(), password.trim(), selectedRole, department);
      }
    } catch (e) {
      Alert.alert('Authentication Failed', 'Please verify your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top + 10, 28), paddingBottom: Math.max(insets.bottom + 20, 36) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* University Header Brand */}
        <View style={styles.brandHeader}>
          <UniversityLogo size={68} color={activeRoleObj.color} />
          <Text style={[styles.universityTitle, { color: theme.textPrimary, marginTop: 10 }]}>
            Dr. Harisingh Gour Vishwavidyalaya
          </Text>
          <Text style={[styles.portalSubtitle, { color: activeRoleObj.color }]}>
            CENTRAL UNIVERSITY R&D ECOSYSTEM
          </Text>
        </View>

        {/* 1-Tap Quick Demo Logins Banner */}
        <View style={[styles.quickLoginCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
          <Text style={[styles.quickLoginLabel, { color: theme.textMuted }]}>
            1-TAP DEMO INSTANT ACCESS
          </Text>
          <View style={styles.quickButtonsRow}>
            <TouchableOpacity
              style={[styles.quickBtn, { borderColor: COLORS.cyan, backgroundColor: 'rgba(6, 182, 212, 0.12)' }]}
              onPress={() => handleQuickLogin('student')}
              disabled={loading}
            >
              <Ionicons name="school-outline" size={14} color={COLORS.cyan} style={{ marginRight: 4 }} />
              <Text style={[styles.quickBtnText, { color: COLORS.cyan }]}>Student</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickBtn, { borderColor: COLORS.emerald, backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}
              onPress={() => handleQuickLogin('scholar')}
              disabled={loading}
            >
              <Ionicons name="flask-outline" size={14} color={COLORS.emerald} style={{ marginRight: 4 }} />
              <Text style={[styles.quickBtnText, { color: COLORS.emerald }]}>Scholar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickBtn, { borderColor: COLORS.gold, backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}
              onPress={() => handleQuickLogin('professor')}
              disabled={loading}
            >
              <Ionicons name="ribbon-outline" size={14} color={COLORS.gold} style={{ marginRight: 4 }} />
              <Text style={[styles.quickBtnText, { color: COLORS.gold }]}>Professor</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mode Segmented Tab (Sign In / Register) */}
        <View style={[styles.segmentContainer, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.segmentBtn, isLogin && [styles.segmentBtnActive, { backgroundColor: activeRoleObj.color }]]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.segmentText, isLogin ? styles.segmentTextActive : { color: theme.textMuted }]}>
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, !isLogin && [styles.segmentBtnActive, { backgroundColor: activeRoleObj.color }]]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.segmentText, !isLogin ? styles.segmentTextActive : { color: theme.textMuted }]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Role Dropdown Selector */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Select Academic Role</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={[
              styles.dropdownHeader,
              { backgroundColor: theme.surfaceCard, borderColor: isRoleDropdownOpen ? activeRoleObj.color : theme.border },
            ]}
            onPress={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            activeOpacity={0.8}
          >
            <View style={[styles.dropdownIconBox, { backgroundColor: `${activeRoleObj.color}25` }]}>
              <Ionicons name={activeRoleObj.icon} size={18} color={activeRoleObj.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.dropdownSelectedTitle, { color: activeRoleObj.color }]}>
                {activeRoleObj.title}
              </Text>
              <Text style={[styles.dropdownSelectedTagline, { color: theme.textMuted }]}>
                {activeRoleObj.tagline}
              </Text>
            </View>
            <Ionicons
              name={isRoleDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={activeRoleObj.color}
            />
          </TouchableOpacity>

          {/* Expandable Dropdown Menu */}
          {isRoleDropdownOpen && (
            <View style={[styles.dropdownMenu, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <TouchableOpacity
                    key={r.id}
                    style={[
                      styles.dropdownItem,
                      { borderBottomColor: theme.border },
                      isSelected && { backgroundColor: `${r.color}15` },
                    ]}
                    onPress={() => {
                      setSelectedRole(r.id);
                      setIsRoleDropdownOpen(false);
                    }}
                  >
                    <View style={[styles.dropdownItemIconBox, { backgroundColor: `${r.color}25` }]}>
                      <Ionicons name={r.icon} size={16} color={r.color} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.dropdownItemTitle, { color: isSelected ? r.color : theme.textPrimary }]}>
                        {r.title}
                      </Text>
                      <Text style={[styles.dropdownItemTagline, { color: theme.textMuted }]}>
                        {r.tagline}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={18} color={r.color} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Selected Role Capabilities Note */}
        <View style={[styles.roleDescBox, { backgroundColor: `${activeRoleObj.color}10`, borderColor: `${activeRoleObj.color}35` }]}>
          <Ionicons name="information-circle" size={16} color={activeRoleObj.color} style={{ marginRight: 6 }} />
          <Text style={[styles.roleDescText, { color: theme.textSecondary }]}>
            {activeRoleObj.desc}
          </Text>
        </View>

        {/* Auth Input Form */}
        <View style={[styles.formCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
          {!isLogin && (
            <>
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>FULL NAME *</Text>
              <View style={[styles.inputWrap, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Ionicons name="person-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  placeholder="e.g. Dr. Kavita Sahu"
                  placeholderTextColor={theme.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>DEPARTMENT *</Text>
              <View style={styles.deptRow}>
                {DEPARTMENTS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.deptChip,
                      { backgroundColor: theme.inputBg, borderColor: theme.border },
                      department === d && { backgroundColor: activeRoleObj.color, borderColor: activeRoleObj.color },
                    ]}
                    onPress={() => setDepartment(d)}
                  >
                    <Text style={[styles.deptChipText, { color: department === d ? '#000' : theme.textMuted }]}>
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Text style={[styles.inputLabel, { color: theme.textMuted }]}>INSTITUTIONAL EMAIL *</Text>
          <View style={[styles.inputWrap, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
            <Ionicons name="mail-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="user@dhsgsu.edu.in"
              placeholderTextColor={theme.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={[styles.inputLabel, { color: theme.textMuted }]}>PASSWORD *</Text>
          <View style={[styles.inputWrap, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
            <Ionicons name="lock-closed-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="••••••••"
              placeholderTextColor={theme.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={theme.textMuted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: activeRoleObj.color }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>
                  {isLogin ? `Access as ${activeRoleObj.title}` : `Register as ${activeRoleObj.title}`}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#000" style={{ marginLeft: 6 }} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={[styles.footerNotice, { color: theme.textMuted }]}>
          Verified Single Sign-On for Sagar University Faculty, Doctoral Scholars & Students.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  universityLogoBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  universityLogoImg: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  universityTitle: {
    fontSize: 16,
    fontFamily: FONTS.header,
    textAlign: 'center',
  },
  portalSubtitle: {
    fontSize: 10,
    fontFamily: FONTS.header,
    letterSpacing: 1,
    marginTop: 3,
  },
  quickLoginCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  quickLoginLabel: {
    fontSize: 9,
    fontFamily: FONTS.header,
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickBtnText: {
    fontSize: 11,
    fontFamily: FONTS.header,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {},
  segmentText: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
  },
  segmentTextActive: {
    color: '#000',
    fontFamily: FONTS.header,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: FONTS.header,
    marginBottom: 8,
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  dropdownIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownSelectedTitle: {
    fontSize: 13,
    fontFamily: FONTS.header,
  },
  dropdownSelectedTagline: {
    fontSize: 10,
    fontFamily: FONTS.body,
    marginTop: 1,
  },
  dropdownMenu: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 6,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  dropdownItemIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItemTitle: {
    fontSize: 12,
    fontFamily: FONTS.header,
  },
  dropdownItemTagline: {
    fontSize: 10,
    fontFamily: FONTS.body,
    marginTop: 1,
  },
  roleDescBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  roleDescText: {
    fontSize: 11,
    fontFamily: FONTS.body,
    lineHeight: 16,
    flex: 1,
  },
  formCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 9,
    fontFamily: FONTS.header,
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.body,
  },
  eyeBtn: {
    padding: 4,
  },
  deptRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  deptChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  deptChipText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#000',
    fontFamily: FONTS.header,
    fontSize: 13,
  },
  footerNotice: {
    fontSize: 10,
    fontFamily: FONTS.body,
    textAlign: 'center',
    lineHeight: 14,
  },
});
