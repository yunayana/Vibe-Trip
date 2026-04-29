import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../src/lib/supabase';
import  ElectricBorderSvg  from '../components/ElectricBorderSvg';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Błąd logowania', error.message);
    } else {
      router.replace('/dashboard');
    }

    setLoading(false);
  };

  return (
    <LinearGradient
      colors={['#050505', '#090909', '#111111', '#2A2A2A']}
      locations={[0, 0.45, 0.78, 1]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>VibeTrip</Text>
          <Text style={styles.title}>Zaloguj sie</Text>
          <Text style={styles.subtitle}>
            Wróć do swoich podróżniczych vibe’ów
          </Text>
        </View>

        <ElectricBorderSvg
          borderRadius={24}
          strokeColor="#F8FEFF"
          glowColor="#8BE9FF"
          strokeWidth={1.3}
          padding={10}
        >
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6F6F73"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Hasło"
              placeholderTextColor="#6F6F73"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#F5F3EE" />
              ) : (
                <Text style={styles.buttonText}>Zaloguj się</Text>
              )}
            </Pressable>

            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.link}>Nie masz konta? Zarejestruj się</Text>
            </Pressable>
          </View>
        </ElectricBorderSvg>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 28,
  },
  logo: {
    fontSize: 34,
    color: '#F5F3EE',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'ProfileHeading',
  },
  title: {
    fontSize: 32,
    color: '#F5F3EE',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'ProfileHeading',
  },
  subtitle: {
    fontSize: 15,
    color: '#9A9A9F',
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#F5F3EE',
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#3A3A3A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#F5F3EE',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#B9B9BE',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.65,
  },
});