import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type PlaceCardProps = {
  item: any;
  index: number;
  vibe: string;
  vibeEmoji: Record<string, string>;
  location?: string | string[];
  isSaved: boolean;
  isSaving: boolean;
  isSelected: boolean;
  onPress: () => void;
  onSave: () => void;
};

export default function PlaceCard({
  item,
  vibe,
  vibeEmoji,
  location,
  isSaved,
  isSaving,
  isSelected,
  onPress,
  onSave,
}: PlaceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.placeName}>{item.name}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {vibeEmoji[vibe] || '📍'} {vibe}
          </Text>
        </View>
      </View>

      <Text style={styles.placeAddress}>
        📍 {item.address || location}
      </Text>

      <Pressable
        style={[styles.saveButton, isSaved && styles.saveButtonSaved]}
        onPress={onSave}
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
}

const styles = StyleSheet.create({
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
});