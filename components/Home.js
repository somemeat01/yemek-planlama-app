import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Üst kısım - Logo ve Başlık */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")} // ✅ kendi logo.png dosyanı buraya koy
          style={styles.logo}
        />
        <Text style={styles.title}>Yemekte Ne Var?</Text>
      </View>

      {/* Alt başlık */}
      <Text style={styles.subtitle}>Bugün sofranda ne olacak?</Text>

      {/* Sesle ekle butonu */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#E67E22" }]}
        onPress={() => navigation.navigate("NeAldiniz")}
      >
        <Text style={styles.buttonText}>🎤 Sesle Ekle</Text>
      </TouchableOpacity>

      {/* Bugün ne pişireyim butonu */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#27AE60" }]}
        onPress={() => navigation.navigate("YemekSec")}
      >
        <Text style={styles.buttonText}>🍴 Bugün Ne Pişireyim?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
