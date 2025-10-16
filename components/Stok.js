import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db, ref, set, onValue } from "../firebase";

export default function Stok() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [qty, setQty] = useState("");
  const [emoji, setEmoji] = useState("");

  const user = auth.currentUser;

  // 🔹 Realtime listener
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const stokRef = ref(db, `users/${user.uid}/stock`);
    const unsubscribe = onValue(stokRef, (snapshot) => {
      const data = snapshot.val() || {};
      const arr = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setItems(arr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleIncrement = (item) => {
    const stokRef = ref(db, `users/${user.uid}/stock/${item.id}`);
    set(stokRef, {
      ...item,
      quantity: (item.quantity || 0) + (item.step || 1),
    });
  };

  const handleDecrement = (item) => {
    const next = (item.quantity || 0) - (item.step || 1);
    const stokRef = ref(db, `users/${user.uid}/stock/${item.id}`);

    if (next <= 0) {
      Alert.alert(
        "Ürünü sil?",
        `"${item.name}" stoğu sıfırlandı. Listeden kaldırmak ister misin?`,
        [
          { text: "Hayır" },
          {
            text: "Sil",
            style: "destructive",
            onPress: () => set(stokRef, null),
          },
          {
            text: "0 yap",
            onPress: () => set(stokRef, { ...item, quantity: 0 }),
          },
        ]
      );
    } else {
      set(stokRef, { ...item, quantity: next });
    }
  };

  const handleAdd = () => {
    if (!name.trim()) return Alert.alert("Eksik", "İsim boş olamaz.");
    if (!user) return Alert.alert("Hata", "Lütfen önce giriş yapın.");
    const id = name.trim().toLowerCase();
    const stokRef = ref(db, `users/${user.uid}/stock/${id}`);

    set(stokRef, {
      name: name.trim(),
      quantity: Number(qty) || 0,
      unit: unit.trim(),
      emoji: emoji.trim() || guessEmoji(name),
      step: guessStep(unit),
    })
      .then(() => {
        setName("");
        setUnit("");
        setQty("");
        setEmoji("");
        setOpen(false);
      })
      .catch(() => Alert.alert("Hata", "Ürün eklenemedi."));
  };

  const guessEmoji = (n) => {
    const s = n.toLowerCase();
  
    // 🥬 Sebze ve Yeşillikler
    if (s.includes("domates")) return "🍅";
    if (s.includes("salatalık") || s.includes("hıyar")) return "🥒";
    if (s.includes("biber")) return "🌶️";
    if (s.includes("patlıcan")) return "🍆";
    if (s.includes("marul") || s.includes("roka") || s.includes("ıspanak") || s.includes("lahana")) return "🥬";
    if (s.includes("soğan")) return "🧅";
    if (s.includes("sarımsak")) return "🧄";
    if (s.includes("patates")) return "🥔";
    if (s.includes("havuc") || s.includes("havuç")) return "🥕";
    if (s.includes("bezelye")) return "🫛";
    if (s.includes("mısır")) return "🌽";
    if (s.includes("kabak")) return "🎃";
    if (s.includes("brokoli")) return "🥦";
    if (s.includes("karnabahar")) return "🥦";
    if (s.includes("maydanoz") || s.includes("dereotu") || s.includes("nane")) return "🌿";
  
    // 🍎 Meyveler
    if (s.includes("elma")) return "🍎";
    if (s.includes("armut")) return "🍐";
    if (s.includes("muz")) return "🍌";
    if (s.includes("portakal")) return "🍊";
    if (s.includes("mandalina")) return "🍊";
    if (s.includes("çilek")) return "🍓";
    if (s.includes("kiraz")) return "🍒";
    if (s.includes("karpuz")) return "🍉";
    if (s.includes("üzüm")) return "🍇";
    if (s.includes("kavun")) return "🍈";
    if (s.includes("limon")) return "🍋";
    if (s.includes("avokado")) return "🥑";
    if (s.includes("nar")) return "🍎";
    if (s.includes("incir")) return "🫐";
    if (s.includes("ananas")) return "🍍";
    if (s.includes("vişne")) return "🍒";
    if (s.includes("kayısı")) return "🍑";
    if (s.includes("erik")) return "🍑";
  
    // 🥩 Et, Tavuk, Balık
    if (s.includes("kıyma")) return "🥩";
    if (s.includes("et") && !s.includes("sucuk")) return "🥩";
    if (s.includes("tavuk")) return "🍗";
    if (s.includes("balık")) return "🐟";
    if (s.includes("sucuk") || s.includes("pastırma")) return "🌭";
    if (s.includes("köfte")) return "🍖";
    if (s.includes("yumurta")) return "🥚";
  
    // 🧀 Süt ve Kahvaltılık
    if (s.includes("süt")) return "🥛";
    if (s.includes("yoğurt") || s.includes("ayran")) return "🥛";
    if (s.includes("peynir")) return "🧀";
    if (s.includes("tereyağ") || s.includes("margarin") || s.includes("yağ")) return "🧈";
    if (s.includes("zeytin")) return "🫒";
    if (s.includes("bal")) return "🍯";
    if (s.includes("reçel")) return "🍓";
  
    // 🍞 Unlu Mamuller
    if (s.includes("ekmek")) return "🍞";
    if (s.includes("un")) return "🌾";
    if (s.includes("makarna")) return "🍝";
    if (s.includes("pirinç")) return "🍚";
    if (s.includes("bulgur")) return "🥣";
    if (s.includes("yulaf")) return "🥣";
    if (s.includes("sim")) return "🥯";
    if (s.includes("poğaça") || s.includes("börek")) return "🥐";
    if (s.includes("pizza")) return "🍕";
    if (s.includes("hamburger") || s.includes("sandviç")) return "🍔";
    if (s.includes("lahmacun")) return "🥙";
  
    // 🧂 Baharat & Soslar
    if (s.includes("tuz")) return "🧂";
    if (s.includes("şeker")) return "🍬";
    if (s.includes("karabiber") || s.includes("pul biber")) return "🌶️";
    if (s.includes("ketçap")) return "🍅";
    if (s.includes("mayonez")) return "🥫";
    if (s.includes("salça")) return "🍅";
    if (s.includes("sirke")) return "🧴";
    if (s.includes("sos")) return "🥫";
  
    // 🍫 Tatlı, Atıştırmalık, İçecek
    if (s.includes("çikolata")) return "🍫";
    if (s.includes("bisküvi")) return "🍪";
    if (s.includes("şekerleme") || s.includes("lokum")) return "🍬";
    if (s.includes("çay")) return "🍵";
    if (s.includes("kahve")) return "☕";
    if (s.includes("kola")) return "🥤";
    if (s.includes("meyve suyu")) return "🧃";
    if (s.includes("su")) return "💧";
  
    // 🧽 Temizlik / Diğer
    if (s.includes("deterjan") || s.includes("sabun")) return "🧼";
    if (s.includes("çamaşır suyu")) return "🧴";
    if (s.includes("bez")) return "🧻";
    if (s.includes("kağıt")) return "🧻";
    if (s.includes("şampuan")) return "🧴";
  
    // 🌾 Bakliyat ve Kuruyemiş
    if (s.includes("mercimek")) return "🫘";
    if (s.includes("nohut")) return "🫘";
    if (s.includes("fasulye")) return "🫘";
    if (s.includes("fındık") || s.includes("fıstık") || s.includes("ceviz") || s.includes("badem")) return "🥜";
    if (s.includes("çekirdek")) return "🌻";
  
    // 🧊 Dondurulmuş ürün
    if (s.includes("dondurma")) return "🍦";
    if (s.includes("dondurulmuş")) return "🧊";
    if (s.includes("buz")) return "🧊";
  
    // 🍽️ Varsayılan
    return "🧺";
  };
  
  const guessStep = (u) => {
    const t = u.toLowerCase();
    if (t.includes("kg") || t.includes("litre")) return 0.5;
    return 1;
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.emoji}>{item.emoji || "🧺"}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sub}>
          {(item.quantity || 0) + " " + (item.unit || "")}
        </Text>
      </View>
      <Pressable style={styles.iconBtn} onPress={() => handleDecrement(item)}>
        <Ionicons name="remove" size={20} />
      </Pressable>
      <Pressable style={styles.iconBtn} onPress={() => handleIncrement(item)}>
        <Ionicons name="add" size={20} />
      </Pressable>
    </View>
  );

  // 🔸 Eğer kullanıcı giriş yapmamışsa
  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.warning}>
          Stok bilgilerini görüntülemek için giriş yapmanız gerekiyor.
        </Text>
        <Text style={{ fontSize: 16, color: "#666", marginTop: 10 }}>
          Profil sekmesinden kayıt olabilir veya giriş yapabilirsiniz.
        </Text>
      </View>
    );
  }

  // 🔸 Yükleniyor ekranı
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff7a00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stok</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Henüz ürün eklenmedi</Text>
        }
      />

      <Pressable style={styles.addBar} onPress={() => setOpen(true)}>
        <Text style={styles.addBarText}>+ Ekle</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Yeni Ürün</Text>

            <TextInput
              placeholder="İsim (ör. domates)"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Miktar"
              style={styles.input}
              value={qty}
              onChangeText={setQty}
              keyboardType="decimal-pad"
            />
            <TextInput
              placeholder="Birim (ör. kg, litre, paket)"
              style={styles.input}
              value={unit}
              onChangeText={setUnit}
            />
            <TextInput
              placeholder="Emoji (opsiyonel)"
              style={styles.input}
              value={emoji}
              onChangeText={setEmoji}
            />

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setOpen(false)}
                style={[styles.btn, styles.cancel]}
              >
                <Text>Vazgeç</Text>
              </Pressable>
              <Pressable
                onPress={handleAdd}
                style={[styles.btn, styles.confirm]}
              >
                <Text style={{ color: "#fff" }}>Ekle</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
  },
  warning: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E67E22",
    textAlign: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    height: 80,
  },
  emoji: { fontSize: 40, marginRight: 12 },
  name: { fontSize: 20, fontWeight: "700" },
  sub: { fontSize: 15, color: "#888" },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f6f6f6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  addBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 30,
    backgroundColor: "#ff7a00",
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  addBarText: { color: "#fff", fontSize: 22, fontWeight: "700" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 6,
  },
  cancel: { backgroundColor: "#eee" },
  confirm: { backgroundColor: "#ff7a00" },
  empty: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
    color: "#888",
  },
});
