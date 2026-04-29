import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../src/lib/supabase';

// Typ danych dla miejsca
interface Place {
  id: string;
  name: string;
  location: string;
  description: string;
  vibe: string;
}

export default function ResultsScreen() {
  // Pobieramy parametry przekazane z AISearchScreen
  const { vibe, location, originalQuery } = useLocalSearchParams();
  
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Debug: sprawdź w konsoli co przyszło z AI
    console.log("🔍 Parametry wyszukiwania:", { vibe, location });
    fetchResults();
  }, [vibe, location]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      // 1. Podstawowe zapytanie - filtrujemy po VIBE
      let query = supabase
        .from('places')
        .select('*')
        .eq('vibe', vibe);

      const { data, error } = await query;

      if (error) throw error;

      let finalResults = data || [];

      // 2. Jeśli AI podało lokalizację, spróbujmy przefiltrować wyniki lokalnie
      // Dzięki temu, jeśli w mieście X nie ma nic, pokażemy cokolwiek o tym samym vibe
      if (location && location !== 'null' && finalResults.length > 0) {
        const filteredByCity = finalResults.filter(p => 
          p.location.toLowerCase().includes(location.toString().toLowerCase())
        );

        // Jeśli znaleźliśmy coś w tym mieście - super. 
        // Jeśli nie - zostajemy przy ogólnych wynikach dla danego vibe.
        if (filteredByCity.length > 0) {
          finalResults = filteredByCity;
        }
      }

      setPlaces(finalResults);
    } catch (error) {
      console.error("❌ Błąd pobierania wyników:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPlace = ({ item }: { item: Place }) => (
    <View style={styles.placeCard}>
      <Text style={styles.placeName}>{item.name}</Text>
      <Text style={styles.placeLocation}>📍 {item.location}</Text>
      <Text style={styles.placeDescription}>{item.description}</Text>
      <View style={styles.vibeTag}>
        <Text style={styles.vibeTagText}># {item.vibe}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>← Powrót do wyszukiwarki</Text>
        </Pressable>
        <Text style={styles.title}>Dopasowane miejsca</Text>
        <Text style={styles.queryText}>Dla: "{originalQuery}"</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2D6A8A" />
          <Text style={styles.loadingText}>AI szuka najlepszych miejsc...</Text>
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={renderPlace}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Niestety nie mamy jeszcze w bazie miejsc pasujących do klimatu: "{vibe}"
              </Text>
              <Pressable style={styles.retryButton} onPress={() => router.back()}>
                <Text style={styles.retryButtonText}>Spróbuj opisać to inaczej</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#5B6470',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5EC',
  },
  backButton: {
    color: '#2D6A8A',
    fontWeight: '600',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E2A38',
  },
  queryText: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 4,
  },
  listContent: {
    padding: 20,
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E1E5EC',
    // Cień
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2A38',
  },
  placeLocation: {
    fontSize: 14,
    color: '#2D6A8A',
    marginVertical: 6,
    fontWeight: '600',
  },
  placeDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  vibeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 12,
  },
  vibeTagText: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2D6A8A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  }
});