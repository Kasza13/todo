// React és React Native importok
import React, { useEffect, useState } from "react";
// FlatList komponens a lista megjelenítésére, Text és View UI komponensek
import { FlatList, Text, View } from "react-native";

// TypeScript interfész a Post típus definiálásához
interface Post {
  id: number; // Egyedi azonosító
  title: string; // Poszt címe
  body: string; // Poszt tartalma
}

// Alapértelmezett exportált funkcionális komponens
export default function App() {
  // Állapot a betöltött posztok tárolására, alapértelmezett üres tömb
  const [posts, setPosts] = useState<Post[]>([]);

  // useEffect a posztok betöltésére a komponens mountolásakor
  useEffect(() => {
    // Aszinkron függvény a posztok betöltésére
    const loadPosts = async () => {
      try {
        // HTTP GET kérés a JSONPlaceholder API-hoz
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        // Válasz JSON konvertálása Post típusú tömbbé
        const data: Post[] = await res.json();
        // Állapot frissítése a betöltött posztokkal
        setPosts(data);
      } catch (err) {
        // Hibakezelés: hiba kiírása a konzolra
        console.error(err);
      }
    };

    // Függvény meghívása
    loadPosts();
  }, []); // Üres dependency tömb = csak egyszer fut le, komponens mountkor

  // JSX visszaadása
  return (
    // Fő wrapper View, flex 1, padding 5, fehér háttér
    <View className="flex-1 p-5 bg-white">
      {/* FlatList a posztok listázásához */}
      <FlatList
        data={posts} // Lista adatok
        keyExtractor={(item) => item.id.toString()} // Egyedi kulcs minden elemhez
        ItemSeparatorComponent={() => <View className="h-4" />} // Elem közötti távolság
        renderItem={(
          { item }, // Listaelem renderelése
        ) => (
          <View className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            {/* Poszt címe */}
            <Text className="font-bold mb-1 text-base">{item.title}</Text>
            {/* Poszt tartalma */}
            <Text className="text-gray-700">{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}
