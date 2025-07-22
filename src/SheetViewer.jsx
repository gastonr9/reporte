import React, { useEffect } from "react";
import axios from "axios";

const ActualizarX21 = () => {
  const iframeSrcBase =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlbYlX3y3ym8VeKgl9INPxLa_jEcbmud4d6aQJ9zOEFPU6Mrd3lZcObc-ojsRi8uSPmVxKjH8Nliru/pubhtml?gid=1720136139&single=true&widget=true&headers=false";

  const webAppUrl =
    "https://script.google.com/macros/s/AKfycby1kZ8ITZVwhsaHuw6hw1u0todLzX4gFAQY762P50refAjJx5lVPUk9nq-Chua6yBOl/exec";

  // 🟦 Actualiza X21 a false usando Axios
  const actualizarX21 = async () => {
    try {
      const res = await axios.post(
        webAppUrl,
        new URLSearchParams({ valor: false })
      );
      console.log("✅ X21 actualizado a false:", res.data);
    } catch (error) {
      console.error("❌ Error al actualizar X21:", error);
    }
  };

  // 🔁 Verifica si la celda tiene true y actúa
  const chequearCambio = async () => {
    try {
      const res = await axios.get(webAppUrl);
      const valor = res.data.toString().trim().toLowerCase();

      if (valor === "true") {
        console.log("🚨 Valor 'true' detectado. Ejecutando acciones...");

        // Recargar el iframe sin cache
        const iframe = document.getElementById("sheetFrame");
        iframe.src = `${iframeSrcBase}&t=${Date.now()}`;

        await actualizarX21();
        window.location.reload(true);
      }
    } catch (error) {
      console.error("❌ Error al verificar el estado:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(chequearCambio, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <iframe
        id="sheetFrame"
        src={`${iframeSrcBase}&t=${Date.now()}`}
        style={{ border: "none", width: "100%", height: "100vh" }}
        title="Google Sheet"
      ></iframe>
    </div>
  );
};

export default ActualizarX21;
