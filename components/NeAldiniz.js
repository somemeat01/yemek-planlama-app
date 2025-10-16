import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function NeAldiniz({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Başlık */}
      <Text style={styles.title}>Ne aldınız?</Text>

      {/* Ortadaki görsel */}
      <Image
        source={require("../assets/sesli.png")} // kendi görselin
        style={styles.image}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("MainTabs")} // ✅ Doğrusu bu
      >
        <Text style={styles.buttonText}>Konuşmaya Başla</Text>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
