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
} from "react-native";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";

export default function Profil() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Oturum dinleyici
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        try {
          const snap = await get(ref(db, `users/${u.uid}/profile`));
          if (snap.exists()) setProfile(snap.val());
        } catch (e) {
          console.log("Profil alınamadı:", e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Kayıt ol
  const handleRegister = async () => {
    if (!email || !password) return Alert.alert("Eksik bilgi", "E-posta ve şifre girin.");
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await set(ref(db, `users/${result.user.uid}/profile`), {
        email,
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Kayıt Başarılı", "Hoş geldiniz!");
      setEmail("");
      setPassword("");
    } catch (e) {
      Alert.alert("Hata", e.message);
    }
  };

  // 🔹 Giriş yap
  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Eksik bilgi", "E-posta ve şifre girin.");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Giriş Başarılı", "Hoş geldiniz!");
      setEmail("");
      setPassword("");
    } catch (e) {
      Alert.alert("Hata", e.message);
    }
  };

  // 🔹 Çıkış yap
  const handleLogout = async () => {
    try {
      await signOut(auth);
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

  // 🔹 Giriş yapılmamışsa giriş ekranı
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

  // 🔹 Giriş yapılmışsa profil ekranı
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri:
              profile.photoURL ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{profile.name || user.email}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.menu}>
        <Pressable style={styles.menuItem}>
          <Text style={styles.menuText}>📅 Haftalık Plan</Text>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <Text style={styles.menuText}>📦 Stok</Text>
        </Pressable>
        <Pressable style={[styles.menuItem, styles.active]}>
          <Text style={styles.menuText}>❤️ Favori Tarifler</Text>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <Text style={styles.menuText}>⚙️ Ayarlar</Text>
        </Pressable>
      </View>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>⏻ Çıkış Yap</Text>
      </Pressable>
    </View>
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
  loginBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 12,
    width: "45%",
    alignItems: "center",
  },
  registerBtn: {
    backgroundColor: "#34C759",
    paddingVertical: 12,
    borderRadius: 12,
    width: "45%",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  lockIcon: { width: 100, height: 100, marginBottom: 20 },
  profileHeader: { alignItems: "center", marginBottom: 30 },
  avatar: { width: 90, height: 90, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "700", color: "#1c1c1e" },
  email: { fontSize: 15, color: "#8e8e93", marginTop: 4 },
  menu: { width: "85%" },
  menuItem: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  active: { borderColor: "#007AFF", backgroundColor: "#eef6ff" },
  menuText: { fontSize: 17, color: "#1c1c1e", fontWeight: "500" },
  logoutBtn: {
    marginTop: 40,
    backgroundColor: "#ff3b30",
    paddingVertical: 14,
    borderRadius: 14,
    width: "70%",
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
