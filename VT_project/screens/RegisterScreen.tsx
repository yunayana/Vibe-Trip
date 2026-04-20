import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../src/lib/supabase'; // Upewnij się, że ścieżka jest poprawna

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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Błąd rejestracji', error.message);
    } else {
      Alert.alert('Sukces!', 'Sprawdź swoją skrzynkę e-mail, aby potwierdzić konto.');
      router.replace('/login');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌍 VibeTrip</Text>
      <Text style={styles.title}>Załóż konto</Text>
      <Text style={styles.subtitle}>
        Zapisuj ulubione miejsca i historię swoich vibe’ów
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Powtórz hasło"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Pressable 
        style={[styles.button, loading && { opacity: 0.7 }]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Zarejestruj się</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push('/login')}>
        <Text style={styles.link}>Masz już konto? Zaloguj się</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E2A38',
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E2A38',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#5B6470',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9E0E6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2D6A8A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#2D6A8A',
    fontSize: 14,
    fontWeight: '500',
  },
});