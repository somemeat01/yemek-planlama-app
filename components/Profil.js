import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

export default function Profil() {
  const navigation = useNavigation();
  const [user, setUser] = useState(auth.currentUser);
  const [profile, setProfile] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [todayMeals, setTodayMeals] = useState([]);

  // 🔹 Kullanıcıyı sürekli kontrol et
  useEffect(() => {
    const interval = setInterval(() => {
      if (auth.currentUser && !user) {
        setUser(auth.currentUser);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  // 🔹 Kullanıcı ve profil verisi yüklendiğinde bugünün yemeklerini çek
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const profileSnap = await get(ref(db, `users/${user.uid}/profile`));
        if (profileSnap.exists()) setProfile(profileSnap.val());

        const gunler = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
        const bugun = gunler[new Date().getDay()];
        const gunKey = bugun.charAt(0).toUpperCase() + bugun.slice(1);

        const planSnap = await get(ref(db, `users/${user.uid}/haftalikPlan/${gunKey}`));
        if (planSnap.exists()) {
          const yemekler = Object.values(planSnap.val());
          setTodayMeals(yemekler);
        } else {
          setTodayMeals([]);
        }
      } catch (e) {
        console.log("Profil veya plan alınamadı:", e);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password)
      return Alert.alert("Eksik bilgi", "E-posta ve şifre girin.");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
      Alert.alert("Giriş Başarılı", "Hoş geldiniz!");
    } catch (e) {
      Alert.alert("Hata", e.message);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!email || !password)
      return Alert.alert("Eksik bilgi", "E-posta ve şifre girin.");
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await set(ref(db, `users/${result.user.uid}/profile`), {
        email,
        createdAt: new Date().toISOString(),
      });
      setUser(result.user);
      Alert.alert("Kayıt Başarılı", "Hoş geldiniz!");
    } catch (e) {
      Alert.alert("Hata", e.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile({});
      setTodayMeals([]);
      navigation.reset({
        index: 0,
        routes: [{ name: "Profil" }],
      });
      Alert.alert("Çıkış yapıldı", "Görüşmek üzere!");
    } catch (e) {
      Alert.alert("Hata", e.message);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );

  if (!user) {
    return (
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
          }}
          style={styles.lockIcon}
        />
        <Text style={styles.title}>Giriş Yap veya Kayıt Ol</Text>
        <TextInput
          placeholder="E-posta"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Şifre"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.buttonRow}>
          <Pressable style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.btnText}>Giriş Yap</Text>
          </Pressable>
          <Pressable style={styles.registerBtn} onPress={handleRegister}>
            <Text style={styles.btnText}>Kayıt Ol</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: profile.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profile.name || user.email}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {todayMeals.length > 0 && (
          <View style={styles.todayBox}>
            <Text style={styles.todayTitle}>🍽 Bugünün Yemekleri</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {todayMeals.map((meal, i) => (
                <Pressable
                  key={i}
                  style={styles.mealCard}
                  onPress={() => navigation.navigate("YemekDetay", { yemek: meal })}
                >
                  <Image
                    source={{
                      uri: meal.image || "https://cdn-icons-png.flaticon.com/512/857/857681.png",
                    }}
                    style={styles.mealImage}
                  />
                  <Text style={styles.mealName}>{meal.isim}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>⏻ Çıkış Yap</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", paddingTop: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20, color: "#1c1c1e" },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-around", width: "80%", marginTop: 16 },
  loginBtn: { backgroundColor: "#007AFF", paddingVertical: 12, borderRadius: 12, width: "45%", alignItems: "center" },
  registerBtn: { backgroundColor: "#34C759", paddingVertical: 12, borderRadius: 12, width: "45%", alignItems: "center" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  lockIcon: { width: 100, height: 100, marginBottom: 20 },
  profileHeader: { alignItems: "center", marginBottom: 30 },
  avatar: { width: 90, height: 90, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "700", color: "#1c1c1e" },
  email: { fontSize: 15, color: "#8e8e93", marginTop: 4 },
  todayBox: { marginTop: 20, alignItems: "flex-start", width: "90%" },
  todayTitle: { fontSize: 22, fontWeight: "800", color: "#1c1c1e", marginBottom: 10 },
  mealCard: { backgroundColor: "#fefefe", borderRadius: 20, width: 160, alignItems: "center", padding: 15, marginRight: 14, borderWidth: 1, borderColor: "#e5e5ea" },
  mealImage: { width: 100, height: 100, borderRadius: 14, marginBottom: 10 },
  mealName: { fontSize: 17, fontWeight: "700", color: "#1c1c1e", textAlign: "center" },
  logoutBtn: { marginTop: 40, backgroundColor: "#ff3b30", paddingVertical: 14, borderRadius: 14, width: "70%", alignItems: "center" },
  logoutText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
