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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../api/client';

export default function StudentChatbotScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { theme } = useTheme();
  const initialQuery = route?.params?.query || '';
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${user?.name || 'Student'}! 👋\n\nI am your **DHSGSU AI Study Tutor**. I can help you with:\n\n• Explaining complex faculty research papers in simple English/Hindi\n• Choosing your final-year B.Tech / M.Sc. / BCA / MCA project topics\n• Finding the right faculty guide for your research interests\n• Preparing for campus lab internships & hackathons\n\nHow can I help your studies today?`,
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
    '💡 Final year project ideas in AI & IoT',
    '📄 Explain Dr. Sendash Singh’s deep learning paper',
    '🔬 Which professor works on Phytochemistry?',
    '🎯 How to apply for Summer Lab Internship?',
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
      const response = await api.askAI(text, 'student');
      const aiReply = response?.data?.reply || response?.reply || 
        "Here is what I found from the DHSGSU academic database: Our university faculty across DCSA, Physics, Chemistry, Mathematics, and Botany actively welcome undergraduate and postgraduate students into funded research initiatives. Feel free to connect directly through the Mentors tab or explore the Papers digest tab.";
      
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
        text: "I am having trouble reaching the DHSGSU knowledge base right now. Here's a quick tip: You can browse verified faculty papers directly in the 'Paper Digests' tab or connect with faculty advisors in the 'Mentors' tab.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Message copied to clipboard.');
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.msgContainer, isUser ? styles.msgUserContainer : styles.msgAiContainer]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={14} color="#000" />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.bubbleUser, { backgroundColor: COLORS.cyan }]
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
        title="AI Study Tutor"
        subtitle="DHSGSU Student Knowledge Copilot"
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
          <ActivityIndicator size="small" color={COLORS.cyan} />
          <Text style={styles.typingText}>AI Tutor is analyzing DHSGSU curriculum & papers...</Text>
        </View>
      )}

      {/* Input Bar */}
      <View style={[styles.inputContainer, { backgroundColor: theme.surfaceCard, borderTopColor: theme.border, paddingBottom: Math.max(insets.bottom + 4, 10) }]}>
        <TextInput
          style={[styles.textInput, { color: theme.textPrimary }]}
          placeholder="Ask tutor about projects, papers, faculty..."
          placeholderTextColor={theme.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
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
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.25)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
  },
  quickPromptText: {
    color: COLORS.cyan,
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
    backgroundColor: COLORS.cyan,
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
    color: COLORS.cyan,
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
    backgroundColor: COLORS.cyan,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
