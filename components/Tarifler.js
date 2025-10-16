import React, { useEffect } from "react";

export default function Tarifler({ navigation }) {
  // Ekrana girer girmez YemekSec'e yönlendirsin
  useEffect(() => {
    navigation.replace("YemekSec");
  }, [navigation]);

  return null; // burada ekstra UI yok çünkü direkt yönlendiriyor
}
