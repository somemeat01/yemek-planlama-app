import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import Voice from "@react-native-voice/voice";
import { ref, push } from "firebase/database";
import { db } from "../firebase"; // 🔹 Firebase bağlantın

export default function Home({ navigation }) {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");

  // 🎙️ Mikrofon izni kontrolü
  const requestMicPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Mikrofon İzni",
            message:
              "Sesle ürün ekleme yapabilmek için mikrofon izni vermen gerekiyor.",
            buttonPositive: "Tamam",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn("İzin kontrolü hatası:", err);
        return false;
      }
    }
    return true;
  };

  // 🔊 Uygulama açıldığında izinleri kontrol et
  useEffect(() => {
    const checkPermission = async () => {
      if (Platform.OS === "android") {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        if (!hasPermission) {
          await requestMicPermission();
        }
      }
    };
    checkPermission();

    // Voice event’leri
    Voice.onSpeechResults = (event) => {
      if (event.value && event.value.length > 0) {
        const text = event.value[0];
        setRecognizedText(text);
        analyzeText(text);
      }
    };

    Voice.onSpeechError = (e) => {
      console.error("🎤 Ses hatası:", e);
      setIsListening(false);
    };

    // Cleanup
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // 🎧 Dinlemeyi başlat
  const startListening = async () => {
    try {
      const permission = await requestMicPermission();
      if (!permission) {
        Alert.alert("Uyarı", "Mikrofon izni verilmeden ses kaydı yapılamaz.");
        return;
      }

      if (!Voice || typeof Voice.start !== "function") {
        Alert.alert(
          "Ses Tanıma Bulunamadı",
          "Cihazda ses tanıma servisi mevcut değil. Lütfen Google Speech Services yükleyin."
        );
        return;
      }

      // Olası açık oturumu kapat
      await Voice.stop();
      await Voice.destroy();

      setRecognizedText("");
      setIsListening(true);

      await Voice.start("tr-TR");
      console.log("🎙️ Ses dinleme başlatıldı...");
    } catch (e) {
      console.error("Dinleme başlatılamadı:", e);
      Alert.alert("Hata", "Ses dinleme başlatılamadı. Lütfen tekrar dene.");
      setIsListening(false);
    }
  };

  // 🔇 Dinlemeyi durdur
  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
      console.log("🔇 Dinleme durduruldu.");
    } catch (e) {
      console.error("Dinleme durdurulamadı:", e);
    }
  };

  // 🧠 Basit analiz (örnek: “2 kilo domates”)
  const analyzeText = (text) => {
    const regex = /(\d+)\s*(kg|kilo|litre|adet)?\s*(\w+)/i;
    const match = text.match(regex);
    if (match) {
      const miktar = parseInt(match[1]);
      const birim = match[2] || "adet";
      const urun = match[3];
      addToStock(urun, miktar, birim);
    } else {
      Alert.alert("Anlaşılmadı", "Tekrar söyler misin?");
    }
  };

  // 💾 Firebase’e stok ekleme
  const addToStock = async (urun, miktar, birim) => {
    try {
      const stokRef = ref(db, "stoklar/");
      await push(stokRef, {
        urun,
        miktar,
        birim,
        tarih: new Date().toISOString(),
      });
      Alert.alert("✅ Eklendi", `${miktar} ${birim} ${urun} eklendi.`);
    } catch (err) {
      console.error("Firebase ekleme hatası:", err);
      Alert.alert("Hata", "Veri kaydedilemedi.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Üst kısım */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Yemekte Ne Var?</Text>
      </View>

      <Text style={styles.subtitle}>Bugün sofranda ne olacak?</Text>

      {/* 🎤 Sesle Ekle */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isListening ? "#c0392b" : "#E67E22" },
        ]}
        onPress={isListening ? stopListening : startListening}
      >
        <Text style={styles.buttonText}>
          {isListening ? "🎧 Dinleniyor..." : "🎤 Sesle Ekle"}
        </Text>
      </TouchableOpacity>

      {/* 🍴 Bugün Ne Pişireyim */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#27AE60" }]}
        onPress={() => navigation.navigate("YemekSec")}
      >
        <Text style={styles.buttonText}>🍴 Bugün Ne Pişireyim?</Text>
      </TouchableOpacity>

      {/* Tanınan Metin */}
      {recognizedText ? (
        <Text style={styles.resultText}>🗣️ {recognizedText}</Text>
      ) : null}
    </View>
  );
}

// 🎨 Tasarım
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
  resultText: {
    fontSize: 16,
    marginTop: 20,
    color: "#555",
    textAlign: "center",
  },
});
