import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Message } from '@/types/chat';
import { CircleAlert as AlertCircle } from 'lucide-react-native';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  const hasImages = message.images && message.images.length > 0;
  const isError = message.status === 'error';
  const isSending = message.status === 'sending';  
  
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.6; // 60% of screen width
  
  const formatTimestamp = (timestamp: string) => {    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.assistantContainer
    ]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble,
        isError && styles.errorBubble
      ]}>
        {hasImages && (
          <View style={styles.imageContainer}>
            {message.images?.map((image, index) => (
              <TouchableOpacity key={index} style={styles.imageWrapper}>
                <Image 
                  source={{ uri: image }} 
                  style={[styles.image, { width: imageWidth, height: imageWidth * 0.75 }]} 
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {message.content && (
          <Text style={[
            styles.text,
            isUser ? styles.userText : styles.assistantText
          ]}>
            {message.content}
          </Text>
        )}
        
        {isError && (
          <View style={styles.errorContainer}>
            <AlertCircle size={16} color="#E53E3E" />
            <Text style={styles.errorText}>Failed to send. Tap to retry.</Text>
          </View>
        )}
        
        <View style={styles.footer}>
          {isSending ? (
            <Text style={styles.statusText}>Sending...</Text>
          ) : (
            <Text style={styles.timeText}>{formatTimestamp(message.timestamp)}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
    paddingBottom: 8,
  },
  userBubble: {
    backgroundColor: '#1A365D',
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  errorBubble: {
    backgroundColor: '#FED7D7',
    borderColor: '#FEB2B2',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  userText: {
    color: '#FFFFFF',
    fontFamily: 'SF-Pro-Regular',
  },
  assistantText: {
    color: '#2D3748',
    fontFamily: 'SF-Pro-Regular',
  },
  imageContainer: {
    marginBottom: 8,
  },
  imageWrapper: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#A0AEC0',
    fontFamily: 'SF-Pro-Regular',
  },
  statusText: {
    fontSize: 12,
    color: '#A0AEC0',
    fontFamily: 'SF-Pro-Regular',
    fontStyle: 'italic',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#E53E3E',
    marginLeft: 4,
    fontFamily: 'SF-Pro-Regular',
  },
});