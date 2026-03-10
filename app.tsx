// React és React Native importok
import React, { useEffect, useState } from "react"; // useState: state kezeléshez, useEffect: oldalhatásokhoz
import { FlatList, StyleSheet, Text, View } from "react-native"; // alap komponensek és stílus kezelés

// TypeScript interfész a Post típushoz
interface Post {
  id: number; // egyedi azonosító
  title: string; // post címe
  body: string; // post tartalma
}

// Alapértelmezett exportált komponens
export default function App() {
  // posts state létrehozása, kezdetben üres tömb
  const [posts, setPosts] = useState<Post[]>([]);
  /*
  // useEffect fut az első render után (componentDidMount) //lehet e máshogy irni és miért van két .then ág ?
  useEffect(() => {
    // Fetch kérés a JSONPlaceholder API-ra
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json()) // a választ JSON formátumba alakítjuk
      .then((data: Post[]) => setPosts(data)) // a kapott tömböt elmentjük a state-be (data = az API-ból jövő posts tömb setPosts(data) = elmented React state-be )
      .catch((err) => console.error(err)); // ha hiba történik, kiírjuk a konzolra
  }, []); // üres dependency array → csak egyszer fut le a komponens életciklusa alatt
  */

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data: Post[] = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadPosts();
  }, []);

  // A komponens renderelése
  return (
    <View style={styles.container}>
      {" "}
      {/* Külső konténer */}
      <FlatList
        data={posts} // a megjelenítendő adatok tömbje
        keyExtractor={(item) => item.id.toString()} // egyedi kulcs minden elemhez
        renderItem={(
          { item }, // minden elem renderelése
        ) => (
          <View style={styles.post}>
            <Text style={styles.title}>{item.title}</Text> {/* Post címe */}
            <Text>{item.body}</Text> {/* Post tartalma */}
          </View>
        )}
      />
    </View>
  );
}

// Stílusok definiálása StyleSheet segítségével
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  post: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  title: { fontWeight: "bold", marginBottom: 5 },
});
