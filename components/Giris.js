import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Giris({ navigation }) {
  return (
    <View style={styles.container}>
      {/* İkon (yemek tepsisi) */}
      <Image
        source={require("../assets/food.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Yemekte{"\n"}Ne Var?</Text>

      <Text style={styles.subtitle}>
        Alışverişini söyle,{"\n"}yemeğini biz seçelim.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("NeAldiniz")} // navigasyonla geçiş
      >
        <Text style={styles.buttonText}>Başlayın</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff9f5",
    padding: 20,
  },
  logo: {
    width: 180,
    height: 120,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#535A61",
    textAlign: "center",
    lineHeight: 28, // yazılar arası mesafe
    marginBottom: 60, // butonla aradaki boşluk
  },
  button: {
    backgroundColor: "#E4572E",
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
