import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useChatStore } from '@/store/chatStore';
import { Send, Info, RefreshCw } from 'lucide-react-native';
import MessageBubble from '@/components/MessageBubble';
import EmptyChat from '@/components/EmptyChat';

export default function TrafficLawScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();

  const {
    activeTrafficSessionId,
    messages,
    isLoading,
    error,
    setActiveSession,
    createSession,
    sendTrafficLawMessage,
    fetchTrafficLawHistory,
  } = useChatStore();

  const [input, setInput] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);

  // Adjusted to use separate active session for traffic law
  useEffect(() => {
    const initSession = async () => {
      if (sessionId) {
        // Use existing session
        setActiveSession(sessionId, 'traffic');
        setCurrentSessionId(sessionId);
        await fetchTrafficLawHistory({ sessionId });
      } else if (activeTrafficSessionId) {
        // Use active traffic session
        setCurrentSessionId(activeTrafficSessionId);
        if (
          !messages[activeTrafficSessionId] ||
          messages[activeTrafficSessionId].length === 0
        ) {
          await fetchTrafficLawHistory({ sessionId: activeTrafficSessionId });
        }
      }
    };

    initSession();
  }, [sessionId, activeTrafficSessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (currentSessionId && messages[currentSessionId]?.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentSessionId, messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const trimmedInput = input.trim();
    setInput('');

    let session = undefined;
    if (!currentSessionId) {
      // Create a new session if it doesn't exist
      session = await createSession('traffic', 'Traffic Law Consultation');
      setActiveSession(session.id, 'traffic');
      setCurrentSessionId(session.id);
    }

    // Send the message after session is created
    await sendTrafficLawMessage({
      sessionId: session?.id ?? currentSessionId!,
      content: trimmedInput || '',
      chatType: 'traffic',
    });
  };

  const sessionMessages = currentSessionId
    ? messages[currentSessionId] || []
    : [];

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.chatContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Info size={24} color="#E53E3E" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() =>
                  currentSessionId &&
                  fetchTrafficLawHistory({ sessionId: currentSessionId })
                }
              >
                <RefreshCw size={16} color="#1A365D" />
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : sessionMessages.length === 0 && !isLoading ? (
            <EmptyChat
              title="Traffic Law Consultation"
              description="Ask our legal experts about traffic laws, tickets, violations, or any traffic-related legal questions."
              suggestions={[
                'How can I get a driving license?',
                'What are the traffic signs?',
              ]}
              onSuggestionPress={(suggestion) => {
                setInput(suggestion);
              }}
            />
          ) : (
            <FlatList
              ref={flatListRef}
              data={sessionMessages}
              renderItem={({ item }) => <MessageBubble message={item} />}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              inverted={false}
              ListHeaderComponent={
                loadingHistory ? (
                  <View style={styles.loadingMore}>
                    <ActivityIndicator size="small" color="#1A365D" />
                    <Text style={styles.loadingMoreText}>
                      Loading earlier messages...
                    </Text>
                  </View>
                ) : null
              }
              ListFooterComponent={
                isLoading && !loadingHistory ? (
                  <View style={styles.loading}>
                    <ActivityIndicator size="small" color="#1A365D" />
                  </View>
                ) : null
              }
            />
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your question about traffic law..."
              placeholderTextColor="#A0AEC0"
              multiline
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !input.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 120,
    fontSize: 16,
    color: '#2D3748',
    fontFamily: 'SF-Pro-Regular',
  },
  sendButton: {
    backgroundColor: '#1A365D',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 16,
    color: '#E53E3E',
    marginVertical: 8,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryText: {
    fontFamily: 'SF-Pro-Medium',
    fontSize: 14,
    color: '#1A365D',
    marginLeft: 4,
  },
  loading: {
    padding: 16,
    alignItems: 'center',
  },
  loadingMore: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMoreText: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 14,
    color: '#718096',
    marginLeft: 8,
  },
});
