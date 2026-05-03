import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { supabase } from '../src/lib/supabase';

interface SavedPlace {
  id: string;
  place_name: string;
  address?: string;
  vibe_category?: string;
  created_at: string;
  latitude?: number | null;
  longitude?: number | null;
  status?: 'want_to_visit' | 'visited' | 'favorite' | null;
}

interface SearchSession {
  id: string;
  location: string;
  vibe: string;
  created_at: string;
}

export default function SavedPlacesScreen() {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [history, setHistory] = useState<SearchSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [sortMode, setSortMode] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'saved' | 'history'>('saved');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Błąd', 'Musisz być zalogowany.');
        return;
      }

      await Promise.all([fetchSavedPlaces(user.id), fetchHistory(user.id)]);
    } catch (error) {
      console.error('Błąd:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedPlaces = async (userId: string) => {
    const { data, error } = await supabase
      .from('saved_places')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Błąd pobierania zapisanych miejsc:', error.message);
    } else {
      setSavedPlaces(data || []);
    }
  };

  const fetchHistory = async (userId: string) => {
    try {
      setHistoryLoading(true);

      const { data, error } = await supabase
        .from('search_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Błąd historii:', error.message);
      } else {
        setHistory(data || []);
      }
    } catch (error) {
      console.error('Błąd pobierania historii:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const sortedPlaces = useMemo(() => {
    const arr = [...savedPlaces];

    if (sortMode === 'name') {
      return arr.sort((a, b) => a.place_name.localeCompare(b.place_name));
    }

    if (sortMode === 'oldest') {
      return arr.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    return arr.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [savedPlaces, sortMode]);

  const handleDeleteSaved = async (id: string) => {
    const { error } = await supabase.from('saved_places').delete().eq('id', id);

    if (error) {
      Alert.alert('Błąd', 'Nie udało się usunąć miejsca.');
    } else {
      setSavedPlaces((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const openPlaceDetails = (item: SavedPlace) => {
    router.push({
      pathname: '/(main)/place-details',
      params: {
        name: item.place_name || '',
        address: item.address || '',
        lat: String(item.latitude ?? ''),
        lon: String(item.longitude ?? ''),
        vibe: item.vibe_category || 'general',
      },
    });
  };

  const openExternalMap = async (item: SavedPlace) => {
    try {
      let url = '';

      if (item.latitude != null && item.longitude != null) {
        url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
      } else if (item.address) {
        url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          item.address
        )}`;
      } else {
        Alert.alert('Brak danych', 'To miejsce nie ma adresu ani współrzędnych.');
        return;
      }

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Błąd', 'Nie udało się otworzyć mapy.');
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się otworzyć mapy.');
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

  const statusLabel: Record<string, string> = {
    want_to_visit: 'Want to visit',
    visited: 'Visited',
    favorite: 'Favorite',
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
        <Text style={styles.title}>Zapisane miejsca</Text>
        <Text style={styles.subtitle}>Twoje ulubione lokalizacje i historia</Text>

        <View style={styles.tabRow}>
          <Pressable
            style={[
              styles.tabButton,
              viewMode === 'saved' && styles.tabButtonActive,
            ]}
            onPress={() => setViewMode('saved')}
          >
            <Text
              style={[
                styles.tabText,
                viewMode === 'saved' && styles.tabTextActive,
              ]}
            >
              Zapisane ({savedPlaces.length})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tabButton,
              viewMode === 'history' && styles.tabButtonActive,
            ]}
            onPress={() => setViewMode('history')}
          >
            <Text
              style={[
                styles.tabText,
                viewMode === 'history' && styles.tabTextActive,
              ]}
            >
              Historia ({history.length})
            </Text>
          </Pressable>
        </View>

        {viewMode === 'saved' && (
          <View style={styles.filtersRow}>
            <Pressable
              style={[
                styles.filterChip,
                sortMode === 'newest' && styles.filterChipActive,
              ]}
              onPress={() => setSortMode('newest')}
            >
              <Text
                style={[
                  styles.filterText,
                  sortMode === 'newest' && styles.filterTextActive,
                ]}
              >
                Najnowsze
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterChip,
                sortMode === 'oldest' && styles.filterChipActive,
              ]}
              onPress={() => setSortMode('oldest')}
            >
              <Text
                style={[
                  styles.filterText,
                  sortMode === 'oldest' && styles.filterTextActive,
                ]}
              >
                Najstarsze
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterChip,
                sortMode === 'name' && styles.filterChipActive,
              ]}
              onPress={() => setSortMode('name')}
            >
              <Text
                style={[
                  styles.filterText,
                  sortMode === 'name' && styles.filterTextActive,
                ]}
              >
                A-Z
              </Text>
            </Pressable>
          </View>
        )}

        {viewMode === 'saved' ? (
          sortedPlaces.length > 0 ? (
            <FlatList
              data={sortedPlaces}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <Pressable style={styles.card} onPress={() => openPlaceDetails(item)}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardContent}>
                      <Text style={styles.place}>{item.place_name}</Text>

                      {item.address ? (
                        <Text style={styles.address}>{item.address}</Text>
                      ) : null}

                      {item.vibe_category ? (
                        <Text style={styles.vibe}>
                          {vibeEmoji[item.vibe_category] || '📍'} {item.vibe_category}
                        </Text>
                      ) : null}
                    </View>

                    <Pressable
                      onPress={() => handleDeleteSaved(item.id)}
                      style={styles.iconButton}
                    >
                      <Text style={styles.iconText}>✕</Text>
                    </Pressable>
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={styles.dateText}>
                      {new Date(item.created_at).toLocaleDateString('pl-PL')}
                    </Text>

                    {item.status ? (
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                          {statusLabel[item.status] || item.status}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.statusBadgeMuted}>
                        <Text style={styles.statusTextMuted}>want_to_visit</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.actionsRow}>
                    <Pressable
                      style={styles.secondaryButton}
                      onPress={() => openExternalMap(item)}
                    >
                      <Text style={styles.secondaryButtonText}>Mapa</Text>
                    </Pressable>

                    <Pressable
                      style={styles.primaryButton}
                      onPress={() => openPlaceDetails(item)}
                    >
                      <Text style={styles.primaryButtonText}>Szczegóły</Text>
                    </Pressable>
                  </View>
                </Pressable>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Brak zapisanych miejsc</Text>
              <Text style={styles.emptySubtext}>
                Wyszukaj i zapisz miejsca, które Ci się spodobają
              </Text>
            </View>
          )
        ) : (
          <>
            {historyLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#F5F3EE" />
              </View>
            ) : history.length > 0 ? (
              <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <View style={styles.historyCard}>
                    <View style={styles.historyContent}>
                      <Text style={styles.historyLocation}>{item.location}</Text>
                      <Text style={styles.historyVibe}>{item.vibe}</Text>
                    </View>
                    <Text style={styles.historyDate}>
                      {new Date(item.created_at).toLocaleDateString('pl-PL')}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Brak historii wyszukiwań</Text>
                <Text style={styles.emptySubtext}>
                  Wyszukaj miejsca, aby zobaczyć historię
                </Text>
              </View>
            )}
          </>
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
    fontFamily: 'ProfileHeading',
  },
  subtitle: {
    fontSize: 15,
    color: '#9A9A9F',
    marginBottom: 24,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#101010',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#232323',
    paddingHorizontal: 2,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
  },
  tabButtonActive: {
    backgroundColor: '#1D1D1D',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8C8C92',
  },
  tabTextActive: {
    color: '#F5F3EE',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  filterChipActive: {
    backgroundColor: '#1D1D1D',
    borderColor: '#6C6C6C',
  },
  filterText: {
    color: '#B8B8BD',
    fontSize: 13,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#F5F3EE',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#101010',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#232323',
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
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
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#343434',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  iconText: {
    color: '#F5F3EE',
    fontSize: 16,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dateText: {
    fontSize: 12,
    color: '#8C8C92',
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#1D1D1D',
    borderWidth: 1,
    borderColor: '#4A4A4E',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  statusBadgeMuted: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  statusText: {
    color: '#F5F3EE',
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextMuted: {
    color: '#9A9A9F',
    fontSize: 11,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#3F3F3F',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#F5F3EE',
    fontSize: 14,
    fontWeight: '800',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2F2F32',
    borderWidth: 1,
    borderColor: '#4A4A4E',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#F5F3EE',
    fontSize: 14,
    fontWeight: '800',
  },
  historyCard: {
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
  historyContent: {
    flex: 1,
  },
  historyLocation: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F5F3EE',
    marginBottom: 4,
  },
  historyVibe: {
    fontSize: 13,
    color: '#9A9A9F',
    fontWeight: '500',
  },
  historyDate: {
    fontSize: 12,
    color: '#6F6F73',
    fontWeight: '500',
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