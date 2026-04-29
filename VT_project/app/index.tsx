import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import WelcomeScreen from "../screens/WelcomeScreen";
import { supabase } from "../src/lib/supabase";

export default function Index() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    // Sprawdzamy, czy użytkownik jest już zalogowany
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Funkcja odpalana po kliknięciu przycisku na WelcomeScreen
  const handleStart = () => {
    setIsStarted(true);
    if (session) {
      // Jeśli mamy sesję, idziemy do dashboarda
      router.replace("/(main)/dashboard");
    } else {
      // Jeśli NIE mamy sesji, idziemy do logowania
      router.replace("/login");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6A8A" />
      </View>
    );
  }

  // Ziemia 🌍 czeka na kliknięcie
  return <WelcomeScreen onStart={handleStart} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
  },
});