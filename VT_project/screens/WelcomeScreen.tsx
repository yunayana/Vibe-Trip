import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

// Dodajemy interfejs dla propsów (TypeScript)
interface WelcomeScreenProps {
  onStart?: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌍 VibeTrip</Text>
      <Text style={styles.title}>Generator losowych podróży</Text>
      <Text style={styles.subtitle}>Odkrywaj miejsca według swojego vibe</Text>

      {/* Jeśli onStart jest przekazany (ekran startowy), używamy go. 
          Jeśli nie (ekran po zalogowaniu), przycisk może robić co innego. */}
      <Pressable 
        style={styles.button} 
        onPress={onStart ? onStart : () => console.log("Jesteś już wewnątrz aplikacji!")}
      >
        <Text style={styles.buttonText}>
          {onStart ? "Start" : "Szukaj Vibe'u"}
        </Text>
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