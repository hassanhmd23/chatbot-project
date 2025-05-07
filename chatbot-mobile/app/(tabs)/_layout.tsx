import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useColorScheme, Platform, KeyboardAvoidingView } from 'react-native';
import {
  Chrome as Home,
  MessageCircle,
  Camera,
  User,
} from 'lucide-react-native';

export default function TabLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, user } = useAuthStore();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // If the user is not authenticated, redirect to the auth flow
    if (!isAuthenticated) {
      router.replace('/(auth)');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#F6AD55',
          tabBarInactiveTintColor:
            colorScheme === 'dark' ? '#CBD5E0' : '#718096',
          tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1A202C' : '#FFFFFF',
            borderTopColor: colorScheme === 'dark' ? '#2D3748' : '#E2E8F0',
            paddingBottom: Platform.OS === 'android' ? 10 : 8, // Adjust padding for Android
            paddingTop: Platform.OS === 'android' ? 10 : 8, // Adjust padding for Android
            height: Platform.OS === 'android' ? 70 : 80, // Ensure enough height for Android
          },
          tabBarLabelStyle: {
            fontFamily: 'SF-Pro-Medium',
            fontSize: 12,
            marginBottom: Platform.OS === 'android' ? 4 : 0, // Add margin for Android
          },
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1A202C' : '#FFFFFF',
          },
          headerTitleStyle: {
            fontFamily: 'SF-Pro-Bold',
            fontSize: 18,
            color: colorScheme === 'dark' ? '#FFFFFF' : '#1A365D',
          },
          tabBarHideOnKeyboard: true,
          headerShown: false
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            headerTitle: 'LegalConsult',
          }}
        />
        <Tabs.Screen
          name="traffic-law"
          options={{
            title: 'Traffic Law',
            tabBarIcon: ({ color, size }) => (
              <MessageCircle size={size} color={color} />
            ),
            headerTitle: 'Traffic Law Consultation',
          }}
        />
        <Tabs.Screen
          name="accident"
          options={{
            title: 'Accident',
            tabBarIcon: ({ color, size }) => (
              <Camera size={size} color={color} />
            ),
            headerTitle: 'Accident Analysis',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            headerTitle: 'My Profile',
          }}
        />
      </Tabs>
  );
}
