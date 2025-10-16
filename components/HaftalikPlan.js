import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { auth, db, ref, onValue } from "../firebase";

export default function HaftalikPlan() {
  const [plan, setPlan] = useState({});
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const planRef = ref(db, `users/${user.uid}/haftalikPlan`);
    const unsubscribe = onValue(planRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPlan(data);
    });

    return () => unsubscribe();
  }, [user]);

  const gunler = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar",
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📅 Haftalık Plan</Text>

      {gunler.map((gun) => {
        const gunVerisi = plan[gun];
        const yemekListesi = gunVerisi
          ? Object.values(gunVerisi).map((item) => item.isim)
          : [];

        return (
          <View key={gun} style={styles.card}>
            <Text style={styles.day}>{gun}</Text>

            {yemekListesi.length > 0 ? (
              yemekListesi.map((yemek, idx) => (
                <Text key={idx} style={styles.meal}>
                  🍽 {yemek}
                </Text>
              ))
            ) : (
              <Text style={styles.empty}>Henüz seçilmedi</Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  day: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  meal: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  empty: {
    color: "#888",
    fontStyle: "italic",
  },
});
