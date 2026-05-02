import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import WelcomeScreen from "../screens/WelcomeScreen";
import { supabase } from "../src/lib/supabase";
import { useProfileStore } from "../store/profileStore"; // Importujemy Twój store

export default function Index() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  useEffect(() => {
    // 1. Sprawdzamy sesję i od razu ładujemy dane personalizacji
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        // ETAP 7: Pobieramy dane profilu do globalnego stanu, 
        // aby AI miało do nich dostęp od razu w dashboardzie
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          updateProfile({
            nickname: profile.nickname,
            travelStyle: profile.travel_style,
            budget: profile.budget,
            homeLocation: profile.home_location
          });
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleStart = () => {
    if (session) {
      // Jeśli zalogowany, leci do dashboardu z załadowanym już profilem
      router.replace("/(main)/dashboard");
    } else {
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