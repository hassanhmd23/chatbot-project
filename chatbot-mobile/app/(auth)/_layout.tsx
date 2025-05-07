import { Stack } from 'expo-router/stack';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If the user is authenticated, redirect to the main app
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}