import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌍 VibeTrip</Text>
      <Text style={styles.title}>Generator losowych podróży</Text>
      <Text style={styles.subtitle}>Odkrywaj miejsca według swojego vibe</Text>

      <Pressable style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1E2A38',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E2A38',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5B6470',
    textAlign: 'center',
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#2D6A8A',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});