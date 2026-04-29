import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { supabase } from '../src/lib/supabase';

/**
 * Ekran wyszukiwarki AI "Vibe Search"
 * Wysyła tekst użytkownika do Edge Function (Groq/AI), 
 * a następnie przekierowuje do pliku app/result.tsx
 */
export default function AISearchScreen() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Główna funkcja wyszukiwania
  const handleAISearch = async (textToProcess?: string) => {
    // Używamy tekstu z przycisku lub z pola tekstowego
    const prompt = textToProcess || userInput;
    
    if (!prompt.trim()) {
      Alert.alert("Błąd", "Napisz najpierw, jakiego klimatu podróży szukasz!");
      return;
    }

    Keyboard.dismiss(); // Schowaj klawiaturę po kliknięciu
    setIsLoading(true);

    try {
      // 1. Wywołanie Supabase Edge Function 'analyze-vibe'
      const { data, error } = await supabase.functions.invoke('analyze-vibe', {
        body: { prompt: prompt }
      });

      if (error) throw error;

      // 2. Nawigacja do Twojego pliku result.tsx w folderze app
      router.push({
        pathname: '/result', 
        params: { 
          vibe: data?.vibe || '', 
          location: data?.location || '',
          originalQuery: prompt 
        }
      });

    } catch (error: any) {
      console.error("Błąd AI Search:", error);
      Alert.alert(
        "Ups!", 
        "Nie udało się przeanalizować Twojego zapytania. Sprawdź połączenie i spróbuj ponownie."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Nagłówek */}
        <Text style={styles.title}>AI Vibe Search</Text>
        <Text style={styles.subtitle}>
          Opisz jak chcesz spędzić czas, a my znajdziemy idealne miejsce.
        </Text>

        {/* Pole tekstowe */}
        <TextInput
          style={styles.input}
          placeholder="Np. Chcę szaloną noc w dużym mieście"
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={userInput}
          onChangeText={setUserInput}
          editable={!isLoading}
        />

        {/* Sekcja szybkich podpowiedzi */}
        <Text style={styles.sectionTitle}>Szybkie pomysły</Text>
        <View style={styles.promptList}>
          {[
            "Spokojna natura i jezioro",
            "Miasto na weekend i nocne życie",
            "Zwiedzanie zabytków i kultura"
          ].map((item, index) => (
            <Pressable 
              key={index} 
              style={styles.promptChip}
              onPress={() => {
                setUserInput(item);
                handleAISearch(item);
              }}
              disabled={isLoading}
            >
              <Text style={styles.promptText}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {/* Przycisk wyszukiwania */}
        <Pressable
          style={[styles.searchButton, isLoading && styles.disabledButton]}
          onPress={() => handleAISearch()}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.searchButtonText}>🔎 Znajdź mój vibe</Text>
          )}
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
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
    fontWeight: '800',
    color: '#1E2A38',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#64748B',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 20,
    fontSize: 16,
    color: '#1E2A38',
    minHeight: 120,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2A38',
    marginBottom: 16,
  },
  promptList: {
    marginBottom: 32,
  },
  promptChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  promptText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: '#2D6A8A',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    shadowColor: '#2D6A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});