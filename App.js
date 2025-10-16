import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Giris from "./components/Giris";
import NeAldiniz from "./components/NeAldiniz";
import YemekSec from "./components/YemekSec";
import Home from "./components/Home";
import YemekDetay from "./components/YemekDetay";

// Alt menü ekranları
import Stok from "./components/Stok"; 
import Tarifler from "./components/Tarifler";
import HaftalikPlan from "./components/HaftalikPlan";
import Profil from "./components/Profil";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 🔹 Alt menü (Tab Navigator)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Ana Sayfa") {
            iconName = "home";
          } else if (route.name === "Stok") {
            iconName = "cube";
          } else if (route.name === "Tarifler") {
            iconName = "book";
          } else if (route.name === "Haftalık Plan") {
            iconName = "star";
          } else if (route.name === "Profil") {
            iconName = "person";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#E67E22",
        tabBarInactiveTintColor: "#333",
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={Home} />
      <Tab.Screen name="Stok" component={Stok} />
      <Tab.Screen name="Tarifler" component={YemekSec} /> 
      <Tab.Screen name="Haftalık Plan" component={HaftalikPlan} />
      <Tab.Screen name="Profil" component={Profil} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* İlk açılış Giriş ekranı */}
        <Stack.Screen name="Giris" component={Giris} />

        {/* Ses alma ekranı */}
        <Stack.Screen name="NeAldiniz" component={NeAldiniz} />

        {/* Detay ekranı */}
        <Stack.Screen name="YemekDetay" component={YemekDetay} />

        {/* 🔹 Alt menüyle gelen kısım */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
