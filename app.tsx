// React és React Native importok
import React, { useEffect, useState } from "react";

// UI komponensek React Native-ból
import { FlatList, Text, View } from "react-native";

// Supabase kliens import
import { supabase } from "./utils/supabase";

// TypeScript interfész a Post típushoz
interface Post {
  id: number;
  title: string;
  body: string;
}

// Fő alkalmazás komponens
export default function App() {
  // Posztok állapota
  const [posts, setPosts] = useState<Post[]>([]);

  // Posztok betöltése amikor az app elindul
  useEffect(() => {
    const loadPosts = async () => {
      // Lekérdezés a Supabase adatbázisból
      const { data, error } = await supabase.from("posts").select("*");

      // Hibakezelés
      if (error) {
        console.error("Supabase hiba:", error);
        return;
      }

      // Állapot frissítése
      if (data) {
        setPosts(data as Post[]);
      }
    };

    loadPosts();
  }, []);

  // UI render
  return (
    <View className="flex-1 p-5 bg-white">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item }) => (
          <View className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <Text className="font-bold mb-1 text-base">{item.title}</Text>

            <Text className="text-gray-700">{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}
