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
  View
} from 'react-native';
import { supabase } from '../src/lib/supabase';

export default function AISearchScreen() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Available cities for "Surprise me" feature
  const cities = [
    'Warsaw', 'Gdansk', 'Krakow', 'Wroclaw', 'Poznan',
    'Paris', 'London', 'Berlin', 'Amsterdam', 'Barcelona',
    'Madrid', 'Rome', 'Venice', 'Monaco',
    'Dubai', 'Singapore', 'Tokyo', 'Sydney', 'Bangkok',
    'Lisbon', 'Istanbul', 'Miami', 'Los Angeles',
  ];
  
  // All 8 vibes matching the edge function
  const vibes = [
    'party',
    'relax',
    'culture',
    'nature',
    'mysterious',
    'sunset',
    'sad',
    'lonely',
  ];

  // Activities mapped to each vibe's amenity options
  const activities = [
    // party → nightclub
    'find a great nightclub',
    'find a bar to party at',
    // relax → cafe
    'find a cozy coffee shop',
    'find a great restaurant',
    // culture → museum
    'explore museums',
    'visit an art gallery',
    // nature → park
    'enjoy a park',
    'find a green space to relax in',
    // mysterious → ruins
    'explore ancient ruins',
    'visit a mysterious castle',
    // sunset → viewpoint
    'find the best viewpoint',
    'watch the sunset from somewhere special',
    // sad → cemetery
    'visit a historic cemetery',
    'find a quiet melancholic place',
    // lonely → library
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

  const handleAISearch = async () => {
    if (!userInput.trim()) {
      Alert.alert("Błąd", "Wpisz coś, aby AI mogło szukać!");
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      console.log("🚀 Wysyłam request do Supabase...");

      const { data, error } = await supabase.functions.invoke('analyze-vibe', {
        body: { prompt: userInput.trim() }
      });

      console.log("📥 RESPONSE:", { data, error });

      if (error) {
        console.error("Szczegóły błędu serwera:", error);
        throw new Error(error.message || "Błąd serwera");
      }

      if (data && data.places) {
        console.log("✅ Sukces! Dane dotarły do aplikacji.");
        
        router.push({
          pathname: '/(main)/result', 
          params: { 
            vibe: data.vibe, 
            location: data.location,
            places: JSON.stringify(data.places), 
            refreshKey: Date.now().toString() 
          }
        });
      } else {
        Alert.alert("Brak wyników", "AI nie znalazło miejsc dla tego zapytania.");
      }

    } catch (error: any) {
      console.error("Błąd AI Search:", error.message);
      
      Alert.alert(
        "Problemy techniczne", 
        "Serwer potrzebuje więcej czasu na przeszukanie map. Spróbuj kliknąć przycisk jeszcze raz – wyniki są zazwyczaj cachowane i za drugim razem pójdzie szybciej."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.earthBadge}><Text style={{ fontSize: 40 }}>🌍</Text></View>
        <Text style={styles.title}>Vibe Explorer</Text>
        <Text style={styles.subtitle}>Gdzie chcesz dzisiaj pojechać?</Text>

        <TextInput
          style={styles.input}
          placeholder="Np. Gdzie w Warszawie zjem dobry obiad?"
          placeholderTextColor="#94A3B8"
          multiline
          value={userInput}
          onChangeText={setUserInput}
          editable={!isLoading}
        />
        
        {/* Surprise me button */}
        <Pressable 
          style={styles.surpriseButton}
          onPress={handleSurpriseMe}
          disabled={isLoading}
        >
          <Text style={styles.surpriseButtonText}>🎲 Surprise me!</Text>
        </Pressable>
        
        {/* Main search button */}
        <Pressable 
          style={[styles.searchButton, isLoading && styles.disabledButton]} 
          onPress={handleAISearch} 
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={[styles.searchButtonText, {marginLeft: 10}]}>Szukam...</Text>
            </View>
          ) : (
            <Text style={styles.searchButtonText}>🔎 Znajdź mój vibe</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#F7F8FA' },
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 24 },
  earthBadge: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', color: '#1E2A38', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 40 },
  input: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 24, 
    padding: 24, 
    minHeight: 140, 
    marginBottom: 16, 
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#1E2A38'
  },
  surpriseButton: { 
    backgroundColor: '#7C3AED', 
    height: 48, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 12
  },
  surpriseButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  searchButton: { backgroundColor: '#2D6A8A', height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  disabledButton: { backgroundColor: '#94A3B8' },
  searchButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  loaderRow: { flexDirection: 'row', alignItems: 'center' }
});