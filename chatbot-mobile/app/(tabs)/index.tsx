import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { ChevronRight, MessageCircle, Camera, Info } from 'lucide-react-native';
import { ChatSession } from '@/types/chat';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    trafficSessions,
    accidentSessions,
    fetchSessions,
    isLoading,
    error,
    setActiveSession,
    emptyMessages,
  } = useChatStore();
  const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    // Combine and sort sessions by date for the Recent section
    const combined = [...trafficSessions, ...accidentSessions].sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );

    setRecentSessions(combined);
  }, [trafficSessions, accidentSessions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const navigateToChat = (session: ChatSession) => {
    if (session.chatType === 'traffic') {
      router.push({
        pathname: '/(tabs)/traffic-law',
        params: { sessionId: session.id },
      });
    } else {
      router.push({
        pathname: '/(tabs)/accident',
        params: { sessionId: session.id },
      });
    }
  };

  const startNewTrafficConsultation = () => {
    setActiveSession(undefined, 'traffic');
    emptyMessages();
    router.push('/(tabs)/traffic-law');
  };

  const startNewAccidentAnalysis = () => {
    setActiveSession(undefined, 'accident');
    emptyMessages();
    router.push('/(tabs)/accident');
  };

  const renderSessionItem = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      style={styles.sessionItem}
      onPress={() => navigateToChat(item)}
    >
      <View style={styles.sessionIcon}>
        {item.chatType === 'traffic' ? (
          <MessageCircle size={24} color="#1A365D" />
        ) : (
          <Camera size={24} color="#1A365D" />
        )}
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.sessionMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <Text style={styles.sessionDate}>{formatDate(item.lastUpdated)}</Text>
      <ChevronRight size={20} color="#A0AEC0" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Hello, {user?.name.split(' ')[0]}</Text>
          <Text style={styles.welcomeText}>How can we help you today?</Text>
        </View>

        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Our Services</Text>

          <View style={styles.servicesGrid}>
            <TouchableOpacity
              style={styles.serviceCard}
              onPress={startNewTrafficConsultation}
            >
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg',
                }}
                style={styles.serviceImage}
              />
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>Traffic Law</Text>
                <Text style={styles.serviceDescription}>
                  Get expert advice on traffic violations, tickets, and
                  regulations
                </Text>
                <View style={styles.serviceButton}>
                  <Text style={styles.serviceButtonText}>
                    Start consultation
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceCard}
              onPress={startNewAccidentAnalysis}
            >
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/163016/crash-test-collision-60-km-h-distraction-163016.jpeg',
                }}
                style={styles.serviceImage}
              />
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>Accident Analysis</Text>
                <Text style={styles.serviceDescription}>
                  Get professional assessment of your accident case with photo
                  analysis
                </Text>
                <View style={styles.serviceButton}>
                  <Text style={styles.serviceButtonText}>Start analysis</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Consultations</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                Loading recent consultations...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Info size={24} color="#E53E3E" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : recentSessions.length > 0 ? (
            <FlatList
              data={recentSessions}
              renderItem={renderSessionItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                You don't have any consultations yet. Start a new one using the
                services above.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 24,
    backgroundColor: '#1A365D',
  },
  greeting: {
    fontFamily: 'SF-Pro-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeText: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  servicesSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'SF-Pro-Bold',
    fontSize: 20,
    color: '#1A365D',
    marginBottom: 16,
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  serviceImage: {
    width: '100%',
    height: 150,
  },
  serviceContent: {
    padding: 16,
  },
  serviceTitle: {
    fontFamily: 'SF-Pro-Bold',
    fontSize: 18,
    color: '#1A365D',
    marginBottom: 8,
  },
  serviceDescription: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 16,
    lineHeight: 22,
  },
  serviceButton: {
    backgroundColor: '#F6AD55',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  serviceButtonText: {
    fontFamily: 'SF-Pro-Medium',
    fontSize: 16,
    color: '#1A365D',
  },
  recentSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontFamily: 'SF-Pro-Medium',
    fontSize: 16,
    color: '#1A365D',
    marginBottom: 4,
  },
  sessionMessage: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 14,
    color: '#718096',
  },
  sessionDate: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 14,
    color: '#A0AEC0',
    marginRight: 8,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 16,
    color: '#718096',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
  },
  errorText: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 16,
    color: '#E53E3E',
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
  },
  emptyText: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  viewAllText: {
    fontFamily: 'SF-Pro-Medium',
    fontSize: 16,
    color: '#1A365D',
  },
  tipSection: {
    padding: 24,
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: '#1A365D',
    borderRadius: 16,
    padding: 24,
  },
  tipTitle: {
    fontFamily: 'SF-Pro-Bold',
    fontSize: 18,
    color: '#F6AD55',
    marginBottom: 8,
  },
  tipText: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
});
