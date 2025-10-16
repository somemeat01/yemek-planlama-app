import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { auth, db, ref, push } from "../firebase"; // ⬅ push ekledik

export default function YemekDetay({ route }) {
  const { yemek } = route.params;
  const user = auth.currentUser;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Pazartesi");

  const gunler = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar",
  ];

  // Kullanıcının elinde olan malzemeler (örnek)
  const mevcutMalzemeler = ["Soğan", "Salça"];
  const eksikler = yemek.malzemeler.filter(
    (malzeme) => !mevcutMalzemeler.includes(malzeme)
  );

  // 🔹 Çoklu yemek ekleme destekli versiyon
  const handleAddToPlan = async () => {
    if (!user) {
      Alert.alert(
        "Giriş Gerekli",
        "Haftalık plana yemek eklemek için giriş yapmalısınız."
      );
      return;
    }

    try {
      // 🔹 push -> benzersiz key oluşturur, eski veriyi silmez
      const planRef = ref(db, `users/${user.uid}/haftalikPlan/${selectedDay}`);
      await push(planRef, {
        isim: yemek.isim,
        malzemeler: yemek.malzemeler,
        tarih: new Date().toISOString(),
      });

      setModalVisible(false);
      Alert.alert("Eklendi ✅", `${selectedDay} gününe "${yemek.isim}" eklendi.`);
    } catch (err) {
      console.error(err);
      Alert.alert("Hata", "Yemek haftalık plana eklenemedi.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{yemek.isim}</Text>

      <Image source={yemek.resim} style={styles.image} />

      <Text style={styles.subtitle}>Malzemeler</Text>
      {yemek.malzemeler.map((malzeme, idx) => (
        <Text
          key={idx}
          style={[
            styles.malzeme,
            eksikler.includes(malzeme) && styles.eksiMalzeme,
          ]}
        >
          {eksikler.includes(malzeme) ? "⚠️ " : "• "} {malzeme}
        </Text>
      ))}

      {yemek.video && (
        <TouchableOpacity onPress={() => Linking.openURL(yemek.video)}>
          <Text style={styles.videoLink}>🎥 Tarif videosu</Text>
        </TouchableOpacity>
      )}

      {eksikler.length > 0 && (
        <View style={styles.uyariBox}>
          <Text style={styles.uyariText}>
            Eksiklikler: {eksikler.join(", ")}
          </Text>
        </View>
      )}

      {/* 🔹 Haftalık plana ekleme butonu */}
      <TouchableOpacity
        style={styles.planBtn}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.planBtnText}>📅 Haftalık Plana Ekle</Text>
      </TouchableOpacity>

      {/* 🔽 Gün Seçici Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Gün Seç</Text>

            <Picker
              selectedValue={selectedDay}
              onValueChange={(itemValue) => setSelectedDay(itemValue)}
              style={styles.picker}
            >
              {gunler.map((gun) => (
                <Picker.Item key={gun} label={gun} value={gun} />
              ))}
            </Picker>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.btn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>İptal</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.confirmBtn]}
                onPress={handleAddToPlan}
              >
                <Text style={styles.btnText}>Ekle</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 20, fontWeight: "600", marginTop: 20 },
  malzeme: { fontSize: 18, marginVertical: 4, color: "#333" },
  eksiMalzeme: { color: "red", fontWeight: "bold" },
  image: { width: "100%", height: 200, borderRadius: 10, marginTop: 10 },
  videoLink: { color: "#2563EB", marginTop: 15, fontSize: 16 },
  uyariBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
  },
  uyariText: { color: "#856404", fontSize: 16 },
  planBtn: {
    marginTop: 30,
    backgroundColor: "#ff7a00",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  planBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  picker: {
    height: 150,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  cancelBtn: {
    backgroundColor: "#ccc",
  },
  confirmBtn: {
    backgroundColor: "#ff7a00",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
