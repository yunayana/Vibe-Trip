import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../src/lib/supabase';
import { useProfileStore } from '../store/profileStore';

export default function AISearchScreen() {
  const { profile } = useProfileStore();
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cities = [
    'Warsaw', 'Gdansk', 'Krakow', 'Wroclaw', 'Poznan',
    'Paris', 'London', 'Berlin', 'Amsterdam', 'Barcelona',
    'Madrid', 'Rome', 'Venice', 'Monaco',
    'Dubai', 'Singapore', 'Tokyo', 'Sydney', 'Bangkok',
    'Lisbon', 'Istanbul', 'Miami', 'Los Angeles',
  ];

  const vibes = [
    'party', 'relax', 'culture', 'nature',
    'mysterious', 'sunset', 'sad', 'lonely',
  ];

  const activities = [
    'find a great nightclub',
    'find a bar to party at',
    'find a cozy coffee shop',
    'find a great restaurant',
    'explore museums',
    'visit an art gallery',
    'enjoy a park',
    'find a green space to relax in',
    'explore ancient ruins',
    'visit a mysterious castle',
    'find the best viewpoint',
    'watch the sunset from somewhere special',
    'visit a historic cemetery',
    'find a quiet melancholic place',
    'find a quiet library',
    'find a place to be alone with my thoughts',
  ];

  const handleSurpriseMe = () => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const prompt = `I want to ${randomActivity} in ${randomCity} with a ${randomVibe} vibe`;
    setUserInput(prompt);
  };

  const saveSearchSession = async (location: string, vibe: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('search_sessions')
        .insert([{ user_id: user.id, location, vibe }]);

      if (error) console.error('Błąd zapisu historii:', error);
    } catch (error) {
      console.error('Błąd zapisu sesji:', error);
    }
  };

  const handleAISearch = async () => {
    if (!userInput.trim()) {
      Alert.alert('Błąd', 'Wpisz coś, aby AI mogło szukać!');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    // Budowanie inteligentnego promptu z danymi profilu
    const smartPrompt = `
      User Prompt: ${userInput.trim()}
      ---
      Dodatkowe preferencje użytkownika:
      - Styl podróży: ${profile.travelStyle || 'standardowy'}
      - Budżet: ${profile.budget || 'średni'}
      - Nickname: ${profile.nickname || 'Podróżnik'}
    `;

    try {
      const { data, error } = await supabase.functions.invoke(
        'analyze-vibe',
        {
          body: { prompt: smartPrompt },
        }
      );

      if (error) {
        throw new Error(error.message || 'Błąd serwera');
      }

      if (data && data.places) {
        await saveSearchSession(data.location, data.vibe);

        router.push({
          pathname: '/(main)/result',
          params: {
            vibe: data.vibe,
            location: data.location,
            places: JSON.stringify(data.places),
            refreshKey: Date.now().toString(),
          },
        });
      } else {
        Alert.alert(
          'Brak wyników',
          'AI nie znalazło miejsc dla tego zapytania.'
        );
      }
    } catch (error: any) {
      if (error.message?.includes('network')) {
        Alert.alert('Brak połączenia', 'Sprawdź swoje Wi-Fi lub dane komórkowe.');
      } else {
        Alert.alert('Problem z AI', 'Sztuczna inteligencja ma przerwę na kawę. Spróbuj za chwilę!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#050505', '#090909', '#101114', '#161821']}
      locations={[0, 0.35, 0.72, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoEmoji}>🌍</Text>
              </View>
              <Text style={styles.title}>Vibe Explorer</Text>
              <Text style={styles.subtitle}>
                Opisz swój vibe, a znajdziemy dla Ciebie miejsce
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Twój prompt</Text>
              <TextInput
                style={styles.input}
                placeholder="Np. Gdzie w Warszawie zjem dobry obiad w spokojnym, klimatycznym miejscu?"
                placeholderTextColor="#6F6F73"
                multiline
                value={userInput}
                onChangeText={setUserInput}
                editable={!isLoading}
                textAlignVertical="top"
              />

              <Pressable
                style={[styles.surpriseButton, isLoading && styles.disabledButton]}
                onPress={handleSurpriseMe}
                disabled={isLoading}
              >
                <Text style={styles.surpriseButtonText}>
                  Wylosuj vibe i miasto
                </Text>
              </Pressable>

              <Pressable
                style={[styles.searchButton, isLoading && styles.disabledButton]}
                onPress={handleAISearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loaderRow}>
                    <ActivityIndicator color="#0B0C0F" />
                    <Text style={[styles.searchButtonText, { marginLeft: 10 }]}>
                      Szukam vibe'u...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.searchButtonText}>
                    Znajdź mój vibe
                  </Text>
                )}
              </Pressable>

              <Text style={styles.helperText}>
                Podaj miasto, typ miejsca lub vibe. Możesz pisać
                pełnymi zdaniami, np. „Chcę spokojne miejsce z naturą
                na obrzeżach Berlina".
              </Text>
            </View>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 26,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#101114',
  },
  logoEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 30,
    color: '#F5F3EE',
    fontFamily: 'ProfileHeading',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#A3A5AE',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#101114',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#23242A',
  },
  label: {
    fontSize: 13,
    color: '#A3A5AE',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#14161B',
    borderWidth: 1,
    borderColor: '#262937',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 130,
    fontSize: 15,
    color: '#F5F3EE',
    marginBottom: 16,
  },
  surpriseButton: {
    backgroundColor: '#1F1F26',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#34343E',
  },
  surpriseButtonText: {
    color: '#F5F3EE',
    fontSize: 14,
    fontWeight: '700',
  },
  searchButton: {
    backgroundColor: '#F5F3EE',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#111214',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 12,
    color: '#777986',
    marginTop: 4,
    lineHeight: 18,
  },
});