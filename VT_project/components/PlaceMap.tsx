import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type PlacesMapProps = {
  mapRef: React.RefObject<MapView | null>;
  mapPlaces: any[];
  selectedIndex: number | null;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  location?: string | string[];
  onSelectPlace: (item: any, index: number) => void;
};

export default function PlacesMap({
  mapRef,
  mapPlaces,
  selectedIndex,
  initialRegion,
  location,
  onSelectPlace,
}: PlacesMapProps) {
  if (!mapPlaces.length) return null;

  return (
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
              description={item.address || String(location || '')}
              onPress={() => onSelectPlace(item, index)}
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
  );
}

const styles = StyleSheet.create({
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
});