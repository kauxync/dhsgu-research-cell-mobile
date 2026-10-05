import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Onboarding, Auth & General Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ResearcherDetailScreen from '../screens/ResearcherDetailScreen';
import AddPublicationModal from '../screens/AddPublicationModal';
import SubmitProposalModal from '../screens/SubmitProposalModal';
import SettingsScreen from '../screens/SettingsScreen';

// Student Screens
import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import StudentMentorsScreen from '../screens/student/StudentMentorsScreen';
import StudentPapersScreen from '../screens/student/StudentPapersScreen';
import StudentInternshipsScreen from '../screens/student/StudentInternshipsScreen';
import StudentChatbotScreen from '../screens/student/StudentChatbotScreen';

// Scholar Screens
import ScholarHomeScreen from '../screens/scholar/ScholarHomeScreen';
import ScholarFellowshipsScreen from '../screens/scholar/ScholarFellowshipsScreen';
import ScholarManuscriptsScreen from '../screens/scholar/ScholarManuscriptsScreen';
import ScholarLibraryScreen from '../screens/scholar/ScholarLibraryScreen';
import ScholarChatbotScreen from '../screens/scholar/ScholarChatbotScreen';

// Professor Screens
import ProfessorHomeScreen from '../screens/professor/ProfessorHomeScreen';
import ProfessorProposalsScreen from '../screens/professor/ProfessorProposalsScreen';
import ProfessorPatentsScreen from '../screens/professor/ProfessorPatentsScreen';
import ProfessorLabScholarsScreen from '../screens/professor/ProfessorLabScholarsScreen';
import ProfessorChatbotScreen from '../screens/professor/ProfessorChatbotScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 1. DEDICATED STUDENT TAB NAVIGATOR (Cyber-Cyan Theme)
function StudentTabNavigator() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.cyan,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.tabBarBg,
          borderTopColor: theme.tabBarBorder,
          height: 56 + (insets.bottom > 0 ? insets.bottom : 8),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          paddingTop: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.bodyBold,
          fontSize: 10,
          letterSpacing: 0.2,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'StudentHomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'StudentMentorsTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'StudentPapersTab') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'StudentInternshipsTab') {
            iconName = focused ? 'rocket' : 'rocket-outline';
          } else if (route.name === 'StudentSettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={21} color={color} />;
        },
      })}
    >
      <Tab.Screen name="StudentHomeTab" component={StudentHomeScreen} options={{ title: 'Hub' }} />
      <Tab.Screen name="StudentMentorsTab" component={StudentMentorsScreen} options={{ title: 'Mentors' }} />
      <Tab.Screen name="StudentPapersTab" component={StudentPapersScreen} options={{ title: 'Digests' }} />
      <Tab.Screen name="StudentInternshipsTab" component={StudentInternshipsScreen} options={{ title: 'Launchpad' }} />
      <Tab.Screen name="StudentSettingsTab" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

// 2. DEDICATED RESEARCH SCHOLAR TAB NAVIGATOR (Emerald Aurora Theme)
function ScholarTabNavigator() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.emerald,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.tabBarBg,
          borderTopColor: theme.tabBarBorder,
          height: 56 + (insets.bottom > 0 ? insets.bottom : 8),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          paddingTop: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.bodyBold,
          fontSize: 10,
          letterSpacing: 0.2,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'ScholarHomeTab') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'FellowshipsTab') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'ManuscriptsTab') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'LibraryTab') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'ScholarSettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={21} color={color} />;
        },
      })}
    >
      <Tab.Screen name="ScholarHomeTab" component={ScholarHomeScreen} options={{ title: 'Thesis Hub' }} />
      <Tab.Screen name="FellowshipsTab" component={ScholarFellowshipsScreen} options={{ title: 'Fellowships' }} />
      <Tab.Screen name="ManuscriptsTab" component={ScholarManuscriptsScreen} options={{ title: 'Manuscripts' }} />
      <Tab.Screen name="LibraryTab" component={ScholarLibraryScreen} options={{ title: 'DOI Library' }} />
      <Tab.Screen name="ScholarSettingsTab" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

// 3. DEDICATED PROFESSOR / PI TAB NAVIGATOR (Imperial Gold Theme)
function ProfessorTabNavigator() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.tabBarBg,
          borderTopColor: theme.tabBarBorder,
          height: 56 + (insets.bottom > 0 ? insets.bottom : 8),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          paddingTop: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.bodyBold,
          fontSize: 10,
          letterSpacing: 0.2,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'ProfessorHomeTab') {
            iconName = focused ? 'ribbon' : 'ribbon-outline';
          } else if (route.name === 'ProposalsTab') {
            iconName = focused ? 'git-network' : 'git-network-outline';
          } else if (route.name === 'PatentsTab') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'LabScholarsTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ProfessorSettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={21} color={color} />;
        },
      })}
    >
      <Tab.Screen name="ProfessorHomeTab" component={ProfessorHomeScreen} options={{ title: 'PI Desk' }} />
      <Tab.Screen name="ProposalsTab" component={ProfessorProposalsScreen} options={{ title: 'Approvals' }} />
      <Tab.Screen name="PatentsTab" component={ProfessorPatentsScreen} options={{ title: 'Patents' }} />
      <Tab.Screen name="LabScholarsTab" component={ProfessorLabScholarsScreen} options={{ title: 'Scholars' }} />
      <Tab.Screen name="ProfessorSettingsTab" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { showSplash, isFirstLaunch, user } = useAuth();

  // 1. Step 1: Splash screen of 1 second
  if (showSplash) {
    return <SplashScreen />;
  }

  // 2. Step 2: Starter / Onboarding page (one-time after app installed)
  if (isFirstLaunch) {
    return <OnboardingScreen />;
  }

  // 3. Step 3: Login or Register page (with Student, Scholar, Professor role picker)
  if (!user) {
    return <AuthScreen />;
  }

  // 4. Step 4: User-based dynamic Tab Navigator matching exact role
  const role = user?.role || 'student';
  const RoleMainTabs =
    role === 'professor'
      ? ProfessorTabNavigator
      : role === 'scholar'
      ? ScholarTabNavigator
      : StudentTabNavigator;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={RoleMainTabs} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ResearcherDetail" component={ResearcherDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen
        name="AddPublication"
        component={AddPublicationModal}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="SubmitProposal"
        component={SubmitProposalModal}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="Chatbot"
        component={
          role === 'professor'
            ? ProfessorChatbotScreen
            : role === 'scholar'
            ? ScholarChatbotScreen
            : StudentChatbotScreen
        }
      />
    </Stack.Navigator>
  );
}
