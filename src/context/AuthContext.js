import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const INITIAL_MANUSCRIPTS = [
  {
    id: 'man-1',
    title: 'Attention-Guided Transformer Networks for Early Detection of Diabetic Retinopathy in Fundus Images',
    authorName: 'Neha Richhariya',
    scholarEmail: 'neha.dcsa.phd@dhsgsu.edu.in',
    department: 'DCSA',
    supervisorName: 'Dr. Pangambam Sendash Singh',
    journal: 'IEEE Transactions on Medical Imaging (Q1)',
    status: 'Approved & Published', // 'Pending Review', 'Approved & Published', 'Revision Requested'
    plagiarism: '6% (Urkund Verified)',
    stage: 'Published',
    wordCount: '8,420 words',
    supervisorApproved: true,
    supervisorNotes: 'Methodology and mathematical proofs verified. Approved for IEEE submission and DHSGSU repository archiving.',
    submissionDate: '28 Sep 2026',
    approvalDate: '02 Oct 2026',
    doi: '10.1109/TMI.2026.3491024',
  },
  {
    id: 'man-2',
    title: 'Hybrid Metaheuristic Optimization for Multi-Cloud Resource Allocation with SLA Constraints',
    authorName: 'Neha Richhariya',
    scholarEmail: 'neha.dcsa.phd@dhsgsu.edu.in',
    department: 'DCSA',
    supervisorName: 'Dr. Pangambam Sendash Singh',
    journal: 'Journal of Supercomputing, Springer (Q2)',
    status: 'Pending Review',
    plagiarism: '4% (Urkund Verified)',
    stage: 'Stage 3 / 4',
    wordCount: '7,150 words',
    supervisorApproved: false,
    supervisorNotes: 'Awaiting DRC meeting and supervisor signoff.',
    submissionDate: '03 Oct 2026',
    approvalDate: null,
    doi: null,
  },
  {
    id: 'man-3',
    title: 'Synthesis and Optoelectronic Characterization of MoS2 Monolayers via CVD for Photovoltaic Cell Efficiency',
    authorName: 'Vivek Kumar Mishra',
    scholarEmail: 'vivek.phys.phd@dhsgsu.edu.in',
    department: 'Physics',
    supervisorName: 'Prof. Ranveer Kumar',
    journal: 'Materials Letters, Elsevier (Q1)',
    status: 'Pending Review',
    plagiarism: '7% (Passed)',
    stage: 'Stage 2 / 4',
    wordCount: '5,200 words',
    supervisorApproved: false,
    supervisorNotes: 'Experimental data sheets attached.',
    submissionDate: '01 Oct 2026',
    approvalDate: null,
    doi: null,
  }
];

export function AuthProvider({ children }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [user, setUser] = useState(null);
  const [manuscripts, setManuscripts] = useState(INITIAL_MANUSCRIPTS);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    async function loadStoredState() {
      try {
        const [onboarded, storedUser, storedManuscripts] = await Promise.all([
          AsyncStorage.getItem('@dhsgsu_onboarded'),
          AsyncStorage.getItem('@dhsgsu_user'),
          AsyncStorage.getItem('@dhsgsu_manuscripts')
        ]);

        if (onboarded === 'true') {
          setIsFirstLaunch(false);
        }
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        if (storedManuscripts) {
          setManuscripts(JSON.parse(storedManuscripts));
        }
      } catch (e) {
        console.warn('Error loading auth state', e);
      }
    }

    loadStoredState();
    return () => clearTimeout(timer);
  }, []);

  const completeOnboarding = async () => {
    setIsFirstLaunch(false);
    try {
      await AsyncStorage.setItem('@dhsgsu_onboarded', 'true');
    } catch (e) {
      console.warn('Error saving onboarding state', e);
    }
  };

  const login = async (email, password, role = 'student', name = null, department = 'DCSA') => {
    let defaultUser = {
      email,
      role, // 'student', 'scholar', 'professor'
      department: department || 'DCSA',
    };

    if (role === 'professor') {
      defaultUser = {
        ...defaultUser,
        name: name || 'Dr. Pangambam Sendash Singh',
        designation: 'Assistant Professor & In-Charge',
        specialization: 'Deep Learning, Remote Sensing & Hyperspectral Imaging',
        phone: '+91 94251 78901',
        orcid: '0000-0002-3490-5812',
        scopusId: '57194829101',
        bio: 'Faculty in Department of Computer Science & Applications (DCSA), Dr. Harisingh Gour Vishwavidyalaya. Active PI in DST-SERB funded research programs.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      };
    } else if (role === 'scholar') {
      defaultUser = {
        ...defaultUser,
        name: name || 'Neha Richhariya (Ph.D. Scholar)',
        designation: 'Senior Ph.D. Research Fellow (CSIR JRF)',
        specialization: 'Deep Learning Architectures for Medical Diagnostics',
        phone: '+91 91112 34567',
        scholarId: 'DHSGSU/PHD/2023/04',
        supervisor: 'Dr. Pangambam Sendash Singh',
        orcid: '0000-0002-1194-8833',
        scopusId: '58102938471',
        bio: 'Doctoral Scholar in DCSA working on neural vision transformers and multimodal clinical disease prediction under Dr. P. S. Singh.',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
      };
    } else {
      defaultUser = {
        ...defaultUser,
        name: name || 'Aarav Sharma',
        designation: 'B.Tech / MCA Final Year Student',
        specialization: 'Artificial Intelligence & Cloud Computing',
        phone: '+91 98260 12345',
        studentId: 'Y23112001',
        bio: 'UG/PG Scholar at DHSGSU exploring applied machine learning, computer vision lab projects, and open-source innovations.',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      };
    }

    setUser(defaultUser);
    try {
      await AsyncStorage.setItem('@dhsgsu_user', JSON.stringify(defaultUser));
    } catch (e) {
      console.warn('Error saving user session', e);
    }
  };

  const updateUserProfile = async (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    try {
      await AsyncStorage.setItem('@dhsgsu_user', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving updated profile', e);
    }
    return updated;
  };

  const register = async (name, email, password, role, department) => {
    await login(email, password, role, name, department);
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('@dhsgsu_user');
    } catch (e) {
      console.warn('Error clearing user session', e);
    }
  };

  // Scholar Document Publishing & Professor Approval Workflow
  const submitScholarManuscript = async (manuscriptData) => {
    const newDoc = {
      id: `man-${Date.now()}`,
      authorName: user?.name || 'Ph.D. Scholar',
      scholarEmail: user?.email || 'scholar@dhsgsu.edu.in',
      department: user?.department || 'DCSA',
      supervisorName: user?.supervisor || 'Dr. Pangambam Sendash Singh',
      status: 'Pending Review',
      supervisorApproved: false,
      supervisorNotes: 'Awaiting professor evaluation and Bonafide verification.',
      submissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      approvalDate: null,
      ...manuscriptData
    };

    const updatedList = [newDoc, ...manuscripts];
    setManuscripts(updatedList);
    try {
      await AsyncStorage.setItem('@dhsgsu_manuscripts', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Error saving manuscripts', e);
    }
    return newDoc;
  };

  const approveScholarManuscript = async (manuscriptId, notes = 'Approved by Research Supervisor') => {
    const updatedList = manuscripts.map((m) => {
      if (m.id === manuscriptId) {
        return {
          ...m,
          status: 'Approved & Published',
          supervisorApproved: true,
          supervisorNotes: notes,
          approvalDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          doi: m.doi || `10.1000/dhsgsu.${Date.now().toString().slice(-6)}`,
          stage: 'Published'
        };
      }
      return m;
    });

    setManuscripts(updatedList);
    try {
      await AsyncStorage.setItem('@dhsgsu_manuscripts', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Error approving manuscript', e);
    }
  };

  const rejectScholarManuscript = async (manuscriptId, notes = 'Please address literature comparison and re-verify plagiarism.') => {
    const updatedList = manuscripts.map((m) => {
      if (m.id === manuscriptId) {
        return {
          ...m,
          status: 'Revision Requested',
          supervisorApproved: false,
          supervisorNotes: notes,
          approvalDate: null
        };
      }
      return m;
    });

    setManuscripts(updatedList);
    try {
      await AsyncStorage.setItem('@dhsgsu_manuscripts', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Error revising manuscript', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        showSplash,
        isFirstLaunch,
        completeOnboarding,
        user,
        login,
        register,
        logout,
        updateUserProfile,
        manuscripts,
        submitScholarManuscript,
        approveScholarManuscript,
        rejectScholarManuscript
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
