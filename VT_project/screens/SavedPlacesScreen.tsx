import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../src/lib/supabase';

interface SavedPlace {
  id: string;
  place_name: string;
  address?: string;
  vibe_category?: string;
  created_at: string;
}

export default function SavedPlacesScreen() {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedPlaces();
  }, []);

  const fetchSavedPlaces = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Błąd', 'Musisz być zalogowany.');
        return;
      }

      const { data, error } = await supabase
        .from('saved_places')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Błąd pobierania zapisanych miejsc:', error.message);
      } else {
        setSavedPlaces(data || []);
      }
    } catch (error) {
      console.error('Błąd:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSaved = async (id: string) => {
    const { error } = await supabase
      .from('saved_places')
      .delete()
      .eq('id', id);

    if (error) {
      Alert.alert('Błąd', 'Nie udało się usunąć miejsca.');
    } else {
      setSavedPlaces(prev => prev.filter(item => item.id !== id));
    }
  };

  const vibeEmoji: Record<string, string> = {
    party: '🎉',
    relax: '🌿',
    culture: '🏛️',
    nature: '🌲',
    mysterious: '🌙',
    sunset: '🌅',
    sad: '🌧️',
    lonely: '🕯️',
    general: '📍',
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#050505', '#050505', '#111111', '#2A2A2A']}
        locations={[0, 0.55, 0.82, 1]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#F5F3EE" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#050505', '#050505', '#111111', '#2A2A2A']}
      locations={[0, 0.55, 0.82, 1]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>❤️ Zapisane miejsca</Text>
        <Text style={styles.subtitle}>Twoje ulubione lokalizacje</Text>

        {savedPlaces.length > 0 ? (
          <FlatList
            data={savedPlaces}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.place}>{item.place_name}</Text>
                  {item.address && <Text style={styles.address}>{item.address}</Text>}
                  {item.vibe_category && (
                    <Text style={styles.vibe}>
                      {vibeEmoji[item.vibe_category] || '📍'} {item.vibe_category}
                    </Text>
                  )}
                </View>
                <Pressable onPress={() => handleDeleteSaved(item.id)} style={styles.deleteButton}>
                  <Text style={{ fontSize: 20 }}>🗑️</Text>
                </Pressable>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Brak zapisanych miejsc</Text>
            <Text style={styles.emptySubtext}>Wyszukaj i zapisz miejsca, które Ci się spodobają</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F5F3EE',
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 15,
    color: '#9A9A9F',
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#101010',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#232323',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  place: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F5F3EE',
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: '#9A9A9F',
    fontWeight: '500',
    marginBottom: 6,
  },
  vibe: {
    fontSize: 13,
    color: '#B8B8BD',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F5F3EE',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9A9A9F',
    textAlign: 'center',
  },
});