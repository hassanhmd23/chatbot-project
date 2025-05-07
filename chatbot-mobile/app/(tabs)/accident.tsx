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
  Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useChatStore } from '@/store/chatStore';
import {
  Send,
  Info,
  RefreshCw,
  Image as ImageIcon,
  Circle as XCircle,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import MessageBubble from '@/components/MessageBubble';
import EmptyChat from '@/components/EmptyChat';

export default function AccidentScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const {
    activeAccidentSessionId,
    messages,
    isLoading,
    error,
    setActiveSession,
    createSession,
    sendAccidentMessage,
    fetchAccidentHistory,
  } = useChatStore();

  const [input, setInput] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Initialize the session
  useEffect(() => {
    const initSession = async () => {
      if (sessionId) {
        // Use existing session
        setActiveSession(sessionId, 'accident');
        setCurrentSessionId(sessionId);
        await fetchAccidentHistory({ sessionId });
      } else if (activeAccidentSessionId) {
        // Use active accident session
        setCurrentSessionId(activeAccidentSessionId);
        if (
          !messages[activeAccidentSessionId] ||
          messages[activeAccidentSessionId].length === 0
        ) {
          await fetchAccidentHistory({ sessionId: activeAccidentSessionId });
        }
      }
    };

    initSession();
  }, [sessionId, activeAccidentSessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (currentSessionId && messages[currentSessionId]?.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentSessionId, messages]);

  const handleSendMessage = async () => {
    if (!input.trim() && selectedImages.length === 0) return;

    const trimmedInput = input.trim();
    setInput('');

    const imagesToSend = [...selectedImages];
    setSelectedImages([]);
    setUploadingImages(true);

    try {
      let session = undefined;
      if (!currentSessionId) {
        // Create a new session if it doesn't exist
        session = await createSession('accident', 'Accident Analysis');
        setActiveSession(session.id, 'accident');
        setCurrentSessionId(session.id);
      }

      // Send the message after session is created
      await sendAccidentMessage({
        sessionId: session?.id ?? currentSessionId!,
        content: trimmedInput || '',
        images: imagesToSend,
        chatType: 'accident',
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedImages([
          ...selectedImages,
          ...result.assets.map((asset) => asset.uri),
        ]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const sessionMessages = currentSessionId
    ? messages[currentSessionId] || []
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={80}
      >
        <View style={styles.chatContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Info size={24} color="#E53E3E" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() =>
                  currentSessionId &&
                  fetchAccidentHistory({ sessionId: currentSessionId })
                }
              >
                <RefreshCw size={16} color="#1A365D" />
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : sessionMessages.length === 0 && !isLoading ? (
            <EmptyChat
              title="Accident Analysis"
              description="Start by saying hello to our agent, and enjoy analysis to your accidents."
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

          {selectedImages.length > 0 && (
            <View style={styles.selectedImagesContainer}>
              <FlatList
                data={selectedImages}
                horizontal
                renderItem={({ item, index }) => (
                  <View style={styles.selectedImageWrapper}>
                    <Image
                      source={{ uri: item }}
                      style={styles.selectedImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <XCircle size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => `${item}-${index}`}
                contentContainerStyle={styles.selectedImagesList}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={pickImage}
            >
              <ImageIcon size={24} color="#718096" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Describe your accident situation..."
              placeholderTextColor="#A0AEC0"
              multiline
              value={input}
              onChangeText={setInput}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                !input.trim() &&
                  selectedImages.length === 0 &&
                  styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={
                (!input.trim() && selectedImages.length === 0) ||
                isLoading ||
                uploadingImages
              }
            >
              {uploadingImages ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Send size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 32,
  },
  selectedImagesContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
  },
  selectedImagesList: {
    paddingHorizontal: 12,
  },
  selectedImageWrapper: {
    marginRight: 8,
    position: 'relative',
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#1A365D',
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  imagePickerButton: {
    paddingHorizontal: 12,
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
