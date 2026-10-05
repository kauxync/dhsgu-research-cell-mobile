import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../api/client';

export default function ScholarChatbotScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { theme } = useTheme();
  const initialQuery = route?.params?.query || '';
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: `Greetings ${user?.name || 'Scholar'}! 🔬\n\nI am your **Ph.D. Scholar Research Copilot**. I am tuned to help you with:\n\n• Abstract polishing & academic tone enhancement for Q1/SCI journals\n• Literature synthesis & identifying research gaps\n• Drafting point-by-point responses to peer reviewers\n• Formatting BibTeX citations & finding high-impact journal scopes\n\nHow can I accelerate your manuscript or thesis today?`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const quickPrompts = [
    '✨ Polish my manuscript abstract for IEEE Q1',
    '📊 Suggest Scopus journals for Deep Learning in Healthcare',
    '📝 Draft a polite response to Reviewer 2 comments',
    '🔍 Identify research gaps in Cloud Edge Offloading',
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await api.askAI(text, 'scholar');
      const aiReply = response?.data?.reply || response?.reply || 
        "Based on academic conventions and DHSGSU doctoral guidelines: Ensure your manuscript highlights novel contributions in Section 1 (Introduction) and provides empirical benchmark comparisons in Section 4. For peer review responses, acknowledge the reviewer's insight before explaining exact manuscript revisions.";
      
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I am unable to connect to the DHSGSU research server right now. Tip: You can check your drafts in the 'Manuscripts' tab or generate BibTeX references in the 'Library' tab.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Research text copied to clipboard.');
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.msgContainer, isUser ? styles.msgUserContainer : styles.msgAiContainer]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="school" size={14} color="#000" />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.bubbleUser, { backgroundColor: COLORS.emerald }]
              : [styles.bubbleAi, { backgroundColor: theme.surfaceCard, borderColor: theme.border }],
          ]}
        >
          <Text
            style={[
              styles.msgText,
              isUser ? styles.msgTextUser : [styles.msgTextAi, { color: theme.textPrimary }],
            ]}
          >
            {item.text}
          </Text>
          <View style={styles.bubbleFooter}>
            <Text style={[styles.timeText, { color: theme.textMuted }]}>{item.time}</Text>
            {!isUser && (
              <TouchableOpacity onPress={() => copyToClipboard(item.text)} style={styles.copyBtn}>
                <Ionicons name="copy-outline" size={12} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Header
        title="Scholar AI Copilot"
        subtitle="Doctoral Research & Manuscript Assistant"
        rightAction={() => navigation.navigate('Notifications')}
        rightIcon="notifications-outline"
      />

      {/* Suggested Quick Prompts */}
      <View style={[styles.quickPromptContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {quickPrompts.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.quickPromptBadge}
              onPress={() => handleSend(prompt)}
            >
              <Text style={styles.quickPromptText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Message Stream */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {loading && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={COLORS.emerald} />
          <Text style={styles.typingText}>Scholar AI is synthesizing doctoral literature...</Text>
        </View>
      )}

      {/* Input Bar */}
      <View style={[styles.inputContainer, { backgroundColor: theme.surfaceCard, borderTopColor: theme.border, paddingBottom: Math.max(insets.bottom + 4, 10) }]}>
        <TextInput
          style={[styles.textInput, { color: theme.textPrimary }]}
          placeholder="Ask Scholar AI for abstract polish, journal targeting..."
          placeholderTextColor={theme.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={600}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || loading}
        >
          <Ionicons name="arrow-up" size={20} color={inputText.trim() ? '#000' : theme.textMuted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  quickPromptContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  quickPromptBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
  },
  quickPromptText: {
    color: COLORS.emerald,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  msgContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '88%',
  },
  msgUserContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  msgAiContainer: {
    alignSelf: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  bubble: {
    borderRadius: 14,
    padding: 12,
  },
  bubbleUser: {
    borderBottomRightRadius: 2,
  },
  bubbleAi: {
    borderWidth: 1,
    borderBottomLeftRadius: 2,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: FONTS.body,
  },
  msgTextUser: {
    color: '#000',
    fontFamily: FONTS.bodyBold,
  },
  msgTextAi: {},
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
    gap: 6,
  },
  timeText: {
    fontSize: 10,
    fontFamily: FONTS.body,
  },
  copyBtn: {
    padding: 2,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  typingText: {
    color: COLORS.emerald,
    fontSize: 11,
    fontFamily: FONTS.body,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 13,
    maxHeight: 90,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.emerald,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
