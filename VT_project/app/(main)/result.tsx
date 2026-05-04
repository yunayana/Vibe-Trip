import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '../../src/lib/supabase';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);
  const listRef = useRef<FlatList>(null);

  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setPlaces([]);
    setSavedIds(new Set());
    setSelectedIndex(null);

    if (params.places) {
      try {
        const decoded = JSON.parse(params.places as string);
        setPlaces(Array.isArray(decoded) ? decoded : []);
      } catch (e) {
        console.error('❌ Błąd parsowania:', e);
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

      // STRZELAMY DO NOWEJ TABELI saved_places
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
        // Jeśli rzuci błąd unikalności (miejsce już jest w bazie)
        if (error.code === '23505') {
           Alert.alert("Info", "To miejsce było już wcześniej zapisane!");
        } else {
           throw error;
        }
      }

      setSavedIds(prev => new Set(prev).add(index));
      // Opcjonalnie: mały feedback dźwiękowy lub haptic jeśli testujesz na telefonie
    } catch (e: any) {
      console.error("Błąd zapisu:", e.message);
      Alert.alert("Błąd", "Nie udało się zapisać. Sprawdź połączenie.");
    } finally {
      setSavingIndex(null);
    }
  };

  const VIBE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
    party: 'wine',
    relax: 'leaf',
    culture: 'library',
    nature: 'leaf',
    mysterious: 'moon',
    sunset: 'sunny',
    sad: 'water',
    lonely: 'water',
  };

  const vibe = (params.vibe as string) || 'vibe';

  const mapPlaces = useMemo(() => {
    return places.filter(
      (item) =>
        typeof item?.lat === 'number' &&
        typeof item?.lon === 'number' &&
        !Number.isNaN(item.lat) &&
        !Number.isNaN(item.lon)
    );
  }, [places]);

  const initialRegion = useMemo(() => {
    if (mapPlaces.length > 0) {
      return {
        latitude: mapPlaces[0].lat,
        longitude: mapPlaces[0].lon,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      };
    }

    return {
      latitude: 52.2297,
      longitude: 21.0122,
      latitudeDelta: 0.12,
      longitudeDelta: 0.12,
    };
  }, [mapPlaces]);

  const focusPlace = (item: any, index: number) => {
    setSelectedIndex(index);

    if (item?.lat && item?.lon) {
      mapRef.current?.animateToRegion(
        {
          latitude: item.lat,
          longitude: item.lon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        350
      );
    }

    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  return (
    <LinearGradient
      colors={['#050505', '#090909', '#101114', '#161821']}
      locations={[0, 0.35, 0.72, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backIcon}>← Wróć</Text>
            </Pressable>
              </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Ionicons
                name={VIBE_ICONS[vibe] || 'location'}
                size={24}
                color="#F5F3EE"
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>
                  {params.location || 'Twoje miejsca'}
                </Text>

                <Text style={styles.headerSubtitle}>
                  {isLoading
                    ? 'Ładowanie...'
                    : `${places.length} propozycji · vibe: ${vibe}`}
                </Text>
              </View>
            </View>

          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#F5F3EE" />
            </View>
          ) : (
            <View style={styles.content}>
              {mapPlaces.length > 0 && (
                <View style={styles.mapWrapper}>
                  <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={initialRegion}
                  >
                    {mapPlaces.map((item, index) => {
                      const isSelected = selectedIndex === index;

                      return (
                        <Marker
                          key={`marker-${index}`}
                          coordinate={{
                            latitude: item.lat,
                            longitude: item.lon,
                          }}
                          title={item.name}
                          description={
                            item.address || String(params.location || '')
                          }
                          onPress={() => focusPlace(item, index)}
                        >
                          <View
                            style={[
                              styles.markerPin,
                              isSelected && styles.markerPinSelected,
                            ]}
                          >
                            <Text style={styles.markerPinText}>📍</Text>
                          </View>
                        </Marker>
                      );
                    })}
                  </MapView>
                </View>
              )}

              <FlatList
                ref={listRef}
                data={places}
                keyExtractor={(_, index) =>
                  `place-${index}-${params.refreshKey}`
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  const isSaved = savedIds.has(index);
                  const isSaving = savingIndex === index;
                  const isSelected = selectedIndex === index;

                  return (
                    <Pressable
                      onPress={() => focusPlace(item, index)}
                      style={[
                        styles.card,
                        isSelected && styles.cardSelected,
                      ]}
                    >
                      <View style={styles.cardHeader}>
                        <Text style={styles.placeName}>{item.name}</Text>

                        <View style={styles.badge}>
                          <Ionicons
                            name={VIBE_ICONS[vibe] || 'location'}
                            size={14}
                            color="#F5F3EE"
                            style={{ marginRight: 4 }}
                          />
                          <Text style={styles.badgeText}>
                            {vibe}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.placeAddress}>
                        📍 {item.address || params.location}
                      </Text>

                      <Pressable
                        style={[
                          styles.saveButton,
                          isSaved && styles.saveButtonSaved,
                        ]}
                        onPress={() => handleSave(item, index)}
                        disabled={isSaving || isSaved}
                      >
                        {isSaving ? (
                          <ActivityIndicator size="small" color="#111214" />
                        ) : (
                          <Text
                            style={[
                              styles.saveButtonText,
                              isSaved && styles.saveButtonTextSaved,
                            ]}
                          >
                            {isSaved ? '❤️ Zapisano' : '🤍 Zapisz miejsce'}
                          </Text>
                        )}
                      </Pressable>
                    </Pressable>
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
            </View>
          )}
        </View>
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  header: {
    marginBottom: 14,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  backIcon: {
    fontSize: 14,
    color: '#B9BCC8',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F5F3EE',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8C8F99',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  mapWrapper: {
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#23242A',
  },
  map: {
    flex: 1,
  },
  markerPin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#101114',
    borderWidth: 1,
    borderColor: '#89F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPinSelected: {
    backgroundColor: '#89F0FF',
  },
  markerPinText: {
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#101114',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#23242A',
  },
  cardSelected: {
    borderColor: '#89F0FF',
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
    color: '#F5F3EE',
    flex: 1,
    marginRight: 12,
  },
  badge: {
    backgroundColor: '#181C25',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2E3443',
  },
  badgeText: {
    color: '#89F0FF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  placeAddress: {
    fontSize: 14,
    color: '#A3A5AE',
    marginBottom: 14,
    lineHeight: 21,
  },
  saveButton: {
    backgroundColor: '#c9c7c4',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonSaved: {
    backgroundColor: '#1D2330',
    borderWidth: 1,
    borderColor: '#2E3443',
  },
  saveButtonText: {
    color: '#111214',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  saveButtonTextSaved: {
    color: '#89F0FF',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F5F3EE',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: '#8C8F99',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },
});