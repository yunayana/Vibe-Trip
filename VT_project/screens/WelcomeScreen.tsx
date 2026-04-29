import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <LinearGradient
      colors={['#020202', '#060606', '#0B0B0C', '#13141A']}
      locations={[0, 0.36, 0.72, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <Text style={styles.logo}>VibeTrip</Text>
          <Text style={styles.title}>Generator losowych podróży</Text>
          <Text style={styles.subtitle}>
            Odkrywaj miejsca według swojego vibe
          </Text>

          <Pressable onPress={onStart} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 38,
    color: '#F5F3EE',
    marginBottom: 20,
    fontFamily: 'ProfileHeading',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: '#F5F3EE',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A2A8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#111010',
    fontSize: 17,
    fontWeight: '800',
  },
});