# 🌍 VibeTrip – Generator losowych podróży według vibe

## 📱 Opis projektu

VibeTrip to aplikacja mobilna stworzona w React Native, która pozwala użytkownikowi odkrywać losowe miejsca w Europie na podstawie wybranego „vibe”.

Zamiast samemu szukać miejsc, aplikacja generuje losową lokalizację na mapie i dopasowuje ją do nastroju użytkownika (np. chill, impreza, natura).

Projekt łączy w sobie mapy, losowość, personalizację oraz elementy AI.

---

## 🎯 Funkcjonalności

### 🗺️ Mapa
- Interaktywna mapa Europy
- Wyświetlanie wylosowanych miejsc
- Podgląd lokalizacji na mapie

---

### 🎲 System vibe
Użytkownik wybiera nastrój podróży:

- 🌴 Chill
- 🎉 Party
- 🌲 Nature
- 🏙️ City
- 🧭 Mystery

---

### 📍 Generator miejsc
- Losowanie miejsca na podstawie wybranego vibe
- Automatyczne przypisanie lokalizacji na mapie
- Podświetlenie wybranego punktu

---

### 📊 Informacje o miejscu
- Nazwa miejsca / miasta
- Krótki opis
- Powód dopasowania do vibe

---

### ❤️ Ulubione
- Zapisywanie ulubionych miejsc
- Historia wylosowanych lokalizacji
- Możliwość ponownego przeglądania

---

## 🤖 Funkcje AI (opcjonalne)

Aplikacja może wykorzystywać AI do generowania opisów miejsc i wyjaśniania, dlaczego dane miejsce pasuje do wybranego vibe.

Przykład:
> „Barcelona idealnie pasuje do vibe party dzięki swojej nocnej kulturze, plażom i energicznej atmosferze.”

Technologia:
- OpenAI API

---

## 🛠️ Technologie

- React Native
- Zustand (zarządzanie stanem)
- Supabase (backend i baza danych)
- React Navigation
- OpenStreetMap / Google Maps API (mapy)

---

## 🧱 Struktura bazy danych (Supabase)

### users
- id
- email

### favorites
- id
- user_id
- place_name
- latitude
- longitude
- vibe
- created_at

---

## 🚀 Cel projektu

Celem aplikacji VibeTrip jest stworzenie nowoczesnej i interaktywnej aplikacji, która łączy:

- odkrywanie nowych miejsc ✈️  
- element losowości 🎲  
- personalizację 🎯  
- elementy AI 🤖  
- nowoczesny UX mobilny 📱  

---

## 💡 Możliwe rozszerzenia

- Pogoda dla wylosowanego miejsca 🌦️  
- Planowanie podróży  
- Udostępnianie miejsc znajomym  
- Codzienna losowa podróż  
- Rankingi najciekawszych miejsc  

---

## 👨‍💻 Autor

Projekt edukacyjny stworzony w ramach nauki React Native i integracji API.