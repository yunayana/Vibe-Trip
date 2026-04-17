import { StyleSheet, Text, View, FlatList } from 'react-native';

const savedPlaces = [
  {
    id: '1',
    place: 'Barcelona, Hiszpania',
    vibe: '🎉 Party',
  },
  {
    id: '2',
    place: 'Zakopane, Polska',
    vibe: '🌲 Nature',
  },
  {
    id: '3',
    place: 'Amsterdam, Holandia',
    vibe: '🏙️ City',
  },
];

export default function SavedPlacesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zapisane miejsca</Text>
      <Text style={styles.subtitle}>
        Tutaj użytkownik zobaczy swoje ulubione lokalizacje
      </Text>

      <FlatList
        data={savedPlaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.place}>{item.place}</Text>
            <Text style={styles.vibe}>{item.vibe}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
    fontWeight: '700',
    color: '#1E2A38',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#5B6470',
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E1E5EC',
  },
  place: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1E2A38',
    marginBottom: 4,
  },
  vibe: {
    fontSize: 14,
    color: '#5B6470',
  },
});