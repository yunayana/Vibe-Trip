import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../src/lib/supabase';
import { getUserHistory } from '../src/services/userService';

export default function ProfileScreen() {
  const [email, setEmail] = useState<string | undefined>('');
  const [historyCount, setHistoryCount] = useState(0);
  const [lastVibe, setLastVibe] = useState('Brak danych');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      setLoading(true);
      
      // 1. Pobierz dane o sesji (email)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email);
        
        // 2. Pobierz historię, aby policzyć miejsca i sprawdzić ostatni vibe
        const history = await getUserHistory(user.id);
        if (history && history.length > 0) {
          setHistoryCount(history.length);
          setLastVibe(history[0].vibe); // Pobiera vibe z ostatniego wpisu
        }
      }
    } catch (error: any) {
      console.error('Błąd pobierania danych profilu:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Błąd', 'Nie udało się wylogować.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#2D6A8A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.subtitle}>Dane użytkownika i ustawienia konta</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>

        <Text style={styles.label}>Historia wyszukiwań</Text>
        <Text style={styles.value}>{historyCount} zapisanych lokalizacji</Text>

        <Text style={styles.label}>Ostatni vibe</Text>
        <Text style={styles.value}>✨ {lastVibe.charAt(0).toUpperCase() + lastVibe.slice(1)}</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Wyloguj się</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E2A38',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#5B6470',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E1E5EC',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: '#7A8494',
    marginBottom: 4,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: '#1E2A38',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#E84855',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});