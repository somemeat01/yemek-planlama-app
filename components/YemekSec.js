import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Kategori from "./kategori";

import anaYemekler from "../data/anaYemekler";
import corbalar from "../data/corbalar";
import tatlilar from "../data/tatlilar";
import salatalar from "../data/salatalar";
import icecekler from "../data/icecekler";

const KATEGORILER = ["Ana Yemek", "Çorba", "Tatlı", "Salata", "İçecek"];
const VERILER = {
  "Ana Yemek": anaYemekler,
  "Çorba": corbalar,
  "Tatlı": tatlilar,
  "Salata": salatalar,
  "İçecek": icecekler,
};

export default function YemekSec({ navigation }) {
  const [seciliKategori, setSeciliKategori] = useState("Ana Yemek");

  const liste = useMemo(() => {
    return VERILER[seciliKategori] || [];
  }, [seciliKategori]);

  return (
    <View style={styles.container}>
      {/* 🔹 Başlık + kategori bloğu */}
      <View style={styles.header}>
        <Text style={styles.title}>Yemek Seç</Text>
        <Kategori
          secili={seciliKategori}
          setSecili={setSeciliKategori}
          kategoriler={KATEGORILER}
        />
      </View>

      {/* 🔹 Başlıktan sonra net bir boşluk */}
      <View style={{ height: 16 }} />

      {/* 🔹 Yemek Listesi */}
      <FlatList
        data={liste}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("YemekDetay", { yemek: item })}
          >
            <Image source={item.resim} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.yemekIsmi}>{item.isim}</Text>
              <Text style={styles.malzeme}>
                {item.malzemeler.length} malzeme
              </Text>
            </View>
            <Text style={styles.ok}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: "#999" }}>Bu kategoride yemek yok.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 0, // başlık + kategori bir arada dursun
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#000",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  yemekIsmi: { fontSize: 17, fontWeight: "bold", color: "#333" },
  malzeme: { fontSize: 14, color: "#777", marginTop: 2 },
  ok: { fontSize: 28, color: "#888", paddingLeft: 4 },
  empty: { alignItems: "center", marginTop: 40 },
});
