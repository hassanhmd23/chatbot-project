import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Image 
        source={{ uri: 'https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg' }} 
        style={styles.backgroundImage} 
      />
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>LegalConsult</Text>
          <Text style={styles.tagline}>Expert legal advice at your fingertips</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Link href="/signin" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/signup" asChild>
            <TouchableOpacity style={styles.buttonOutline}>
              <Text style={styles.buttonOutlineText}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A365D',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 54, 93, 0.85)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontFamily: 'SF-Pro-Bold',
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 24,
    width: '100%',
  },
  button: {
    backgroundColor: '#F6AD55',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontFamily: 'SF-Pro-Medium',
    fontSize: 18,
    color: '#1A365D',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  buttonOutlineText: {
    fontFamily: 'SF-Pro-Medium',
    fontSize: 18,
    color: '#FFFFFF',
  },
  footerText: {
    fontFamily: 'SF-Pro-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
    textAlign: 'center',
  },
});