import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { supabase } from '../src/lib/supabase';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const saveSearchSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("🔵 saveSearchSession user:", user?.id);
      console.log("🔵 location:", params.location, "vibe:", params.vibe);
      if (!user) {
        console.log("❌ Brak usera!");
        return;
      }

      const { data, error } = await supabase
        .from('search_sessions')
        .insert({
          user_id: user.id,
          location: params.location as string,
          vibe: params.vibe as string || 'general',
        })
        .select();

      console.log("✅ INSERT data:", data);
      console.log("❌ INSERT error:", error);

    } catch (e: any) {
      console.error("Błąd zapisu sesji:", e.message);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setPlaces([]);
    setSavedIds(new Set());

    if (params.places) {
      try {
        const decoded = JSON.parse(params.places as string);
        setPlaces(decoded);
        console.log("✅ Wyświetlam miejsca dla:", params.location);

        // Zapisujemy wyszukiwanie do search_sessions
        saveSearchSession();

      } catch (e) {
        console.error("❌ Błąd parsowania:", e);
      }
    }

    setIsLoading(false);
  }, [params.refreshKey, params.places]);

  const handleSave = async (item: any, index: number) => {
    if (savedIds.has(index)) {
      Alert.alert("Już zapisano", "To miejsce jest już w Twoich ulubionych.");
      return;
    }

    setSavingIndex(index);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Błąd", "Musisz być zalogowany, aby zapisywać miejsca.");
        return;
      }

      const { error } = await supabase
        .from('saved_places')
        .insert({
          user_id: user.id,
          place_name: item.name,
          address: item.address || params.location,
          vibe_category: params.vibe as string || 'general',
          lat: item.lat ?? null,
          lng: item.lon ?? null,
        });

      if (error) {
        if (error.code === '23505') {
          Alert.alert("Info", "To miejsce było już wcześniej zapisane!");
        } else {
          throw error;
        }
      }

      setSavedIds(prev => new Set(prev).add(index));
    } catch (e: any) {
      console.error("Błąd zapisu:", e.message);
      Alert.alert("Błąd", "Nie udało się zapisać. Sprawdź połączenie.");
    } finally {
      setSavingIndex(null);
    }
  };

  const vibeEmoji: Record<string, string> = {
    party: '🎉', relax: '☕', culture: '🏛️', nature: '🌲',
    mysterious: '🧭', sunset: '🌅', sad: '🕯️', lonely: '📚',
  };

  const vibe = params.vibe as string || 'vibe';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>← Wróć</Text>
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>
            {vibeEmoji[vibe] || '📍'} {params.location || 'Twoje miejsca'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isLoading
              ? "Ładowanie..."
              : `${places.length} propozycji · vibe: ${vibe}`}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2D6A8A" />
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(_, index) => `place-${index}-${params.refreshKey}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const isSaved = savedIds.has(index);
            const isSaving = savingIndex === index;

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.placeName}>{item.name}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {vibeEmoji[vibe]} {vibe}
                    </Text>
                  </View>
                </View>

                <Text style={styles.placeAddress}>
                  📍 {item.address || params.location}
                </Text>

                <Pressable
                  style={[styles.saveButton, isSaved && styles.saveButtonSaved]}
                  onPress={() => handleSave(item, index)}
                  disabled={isSaving || isSaved}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      {isSaved ? '❤️ Zapisano' : '🤍 Zapisz miejsce'}
                    </Text>
                  )}
                </Pressable>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nic nie znaleziono dla "{params.location}".
              </Text>
              <Text style={styles.emptySub}>
                Spróbuj wpisać inną lokalizację lub klimat.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: { marginBottom: 10 },
  backIcon: { fontSize: 16, color: '#2D6A8A', fontWeight: 'bold' },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E2A38',
    textTransform: 'capitalize',
  },
  headerSubtitle: { fontSize: 14, color: '#64748B' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2A38',
    flex: 1,
    marginRight: 10,
  },
  badge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#0369A1',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  placeAddress: { fontSize: 14, color: '#64748B', marginBottom: 14 },
  saveButton: {
    backgroundColor: '#2D6A8A',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveButtonSaved: {
    backgroundColor: '#E0F2FE',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E2A38',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
});