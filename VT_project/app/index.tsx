import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import WelcomeScreen from "../screens/WelcomeScreen";

import { supabase } from "../src/lib/supabase";
import { analyzeVibe } from "../src/services/vibeService";
import { searchPlaces } from "../src/services/placeService";

// LOG NA ZEWNĄTRZ - potwierdza, że plik w ogóle się wczytał
console.log("🔥 Plik index.tsx załadowany!");

export default function HomeScreen() {
  
  useEffect(() => {
    console.log("📱 Komponent zamontowany. Uruchamiam testy...");
    runTests();
  }, []);

  const runTests = async () => {
    console.log("🚀 --- START TESTÓW VIBETRIP ---");

    try {
      // 1. TWOJE SKOPIOWANE ID UŻYTKOWNIKA
      const testUserId = "54975d8e-ab8d-40c7-b72a-00ad193607d1";

      // 2. ANALIZA VIBE (Lokalna funkcja)
      const vibe = "party";
      const tags = analyzeVibe(vibe);
      console.log("1️⃣ Wybrany vibe:", vibe, "Tagi:", tags);

      // 3. SZUKANIE MIEJSCA (Lokalna funkcja)
      const place = searchPlaces(vibe);
      console.log("2️⃣ Znalezione miejsce:", place?.name);

      if (!place) {
        console.log("⚠️ Błąd: Nie znaleziono miejsca w placeService!");
        return;
      }

      // 4. INSERT DO BAZY SUPABASE
      console.log("3️⃣ Próba zapisu do Supabase...");
      
      const { data, error } = await supabase
        .from("history")
        .insert([
          {
            user_id: testUserId,
            place_name: place.name,
            latitude: place.lat,
            longitude: place.lng,
            vibe: vibe,
            description: place.description || "Brak opisu"
          }
        ])
        .select();

      if (error) {
        console.log("❌ BŁĄD BAZY DANYCH:", error.message);
        console.log("Szczegóły:", JSON.stringify(error));
      } else {
        console.log("✅ SUKCES! Dane są w tabeli history!");
        console.log("Zapisany rekord:", data);
      }

    } catch (err: any) {
      console.log("❌ BŁĄD KRYTYCZNY:", err.message);
    }
    console.log("🏁 --- TESTY ZAKOŃCZONE ---");
  };

  return (
    <View style={styles.container}>
      {/* WelcomeScreen to Twoja główna zawartość */}
      <WelcomeScreen />

      {/* Mały pasek statusu na dole ekranu, żebyś widziała, że kod żyje */}
      <View style={styles.debugOverlay}>
        <Text style={styles.debugText}>
          🟢 Test bazy uruchomiony. Wynik sprawdź w konsoli (lub w Supabase).
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  debugOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  debugText: {
    color: '#00FF00', // Zielony tekst "hackera" ;)
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});