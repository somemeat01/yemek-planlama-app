import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Kategori({ secili, setSecili, kategoriler }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {kategoriler.map((kat) => {
        const aktif = secili === kat;
        return (
          <TouchableOpacity
            key={kat}
            onPress={() => setSecili(kat)}
            style={[styles.pill, aktif && styles.pillAktif]}
          >
            <Text style={[styles.pillText, aktif && styles.pillTextAktif]}>
              {kat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingTop: 2, // başlığa çok yakın dursun
    paddingBottom: 0,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  pill: {
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    height: 32,
    justifyContent: "center",
  },
  pillAktif: {
    backgroundColor: "#FF7A00",
  },
  pillText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },
  pillTextAktif: {
    color: "#fff",
  },
});
