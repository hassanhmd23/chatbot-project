import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface EmptyChatProps {
  title: string;
  description: string;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
}

export default function EmptyChat({
  title,
  description,
  suggestions,
  onSuggestionPress,
}: EmptyChatProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {suggestions && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Try asking about:</Text>

            {suggestions?.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionButton}
                onPress={() => onSuggestionPress?.(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontFamily: 'SF-Pro-Bold',
    fontSize: 24,
    color: '#1A365D',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsTitle: {
    fontFamily: 'SF-Pro-Medium',
    fontSize: 18,
    color: '#2D3748',
    marginBottom: 16,
  },
  suggestionButton: {
    backgroundColor: '#EBF8FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  suggestionText: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 16,
    color: '#1A365D',
  },
});
