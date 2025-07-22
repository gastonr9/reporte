import React, { useEffect } from "react";

const ActualizarX21 = () => {
  const iframeSrcBase =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlbYlX3y3ym8VeKgl9INPxLa_jEcbmud4d6aQJ9zOEFPU6Mrd3lZcObc-ojsRi8uSPmVxKjH8Nliru/pubhtml?gid=1720136139&single=true&widget=true&headers=false";

  const webAppUrl =
    "https://script.google.com/macros/s/AKfycby1kZ8ITZVwhsaHuw6hw1u0todLzX4gFAQY762P50refAjJx5lVPUk9nq-Chua6yBOl/exec";

  // 🟦 Actualiza X21 a false
  const actualizarX21 = async () => {
    const valor = false;
    const params = new URLSearchParams({ valor });

    try {
      const res = await fetch(webAppUrl, {
        method: "POST",
        body: params,
      });
      const texto = await res.text();
      console.log("✅ X21 actualizado a false:", texto);
    } catch (error) {
      console.error("❌ Error al actualizar X21:", error);
    }
  };

  // 🔁 Verifica el valor y actúa
  const chequearCambio = async () => {
    try {
      const res = await fetch(webAppUrl);
      const texto = await res.text();
      const valor = texto.trim().toLowerCase();

      if (valor === "true") {
        console.log("🚨 Valor 'true' detectado. Ejecutando acciones...");

        // Recarga el iframe con parámetro anti-cache
        const iframe = document.getElementById("sheetFrame");
        iframe.src = `${iframeSrcBase}&t=${Date.now()}`;

        await actualizarX21();
        window.location.reload(true); // recarga la página
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
        style={{ border: "none" }}
        title="Google Sheet"
      ></iframe>
    </div>
  );
};

export default ActualizarX21;
