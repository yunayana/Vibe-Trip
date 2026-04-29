import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import  ElectricBorderSvg  from '../components/ElectricBorderSvg';
import { supabase } from '../src/lib/supabase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Błąd', 'Hasła nie są identyczne');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Błąd rejestracji', error.message);
    } else {
      Alert.alert(
        'Sukces!',
        'Sprawdź swoją skrzynkę e-mail, aby potwierdzić konto.'
      );
      router.replace('/login');
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
          <Text style={styles.title}>Zaloz konto</Text>
          <Text style={styles.subtitle}>
            Zapisuj ulubione miejsca i historię swoich vibe’ów
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

            <TextInput
              style={styles.input}
              placeholder="Powtórz hasło"
              placeholderTextColor="#6F6F73"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <Pressable
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#F5F3EE" />
              ) : (
                <Text style={styles.buttonText}>Zarejestruj się</Text>
              )}
            </Pressable>

            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.link}>Masz już konto? Zaloguj się</Text>
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
      backgroundColor: '#101011',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 15,
      fontSize: 16,
      color: '#F5F3EE',
      marginBottom: 14,
  },
  button: {
      backgroundColor: '#232323',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.10)',
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