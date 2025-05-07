import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, SafeAreaView, Image } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { LogOut, ChevronRight, Shield, Bell, CircleHelp as HelpCircle, Settings, User } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name.split(' ').map(name => name[0]).join('')}
              </Text>
            </View>
          </View>
          
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.memberSince}>Member since {formatDate(user?.created_at || new Date().toISOString())}</Text>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#E53E3E" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
      </View>
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
    justifyContent: 'space-between'
  },
  profileHeader: {
    backgroundColor: '#1A365D',
    paddingTop: 40,
    paddingBottom: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F6AD55',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'SF-Pro-Bold',
    fontSize: 32,
    color: '#1A365D',
  },
  userName: {
    fontFamily: 'SF-Pro-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  memberSince: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontFamily: 'SF-Pro-Bold',
    fontSize: 18,
    color: '#1A365D',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuText: {
    fontFamily: 'SF-Pro-Medium',
    fontSize: 16,
    color: '#2D3748',
  },
  menuSubtext: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
  },
  logoutText: {
    fontFamily: 'SF-Pro-Medium',
    fontSize: 16,
    color: '#E53E3E',
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
});