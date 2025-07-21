import React, { useEffect, useState } from "react";
import axios from "axios";

const SheetViewer = () => {
  const [iframeSrc, setIframeSrc] = useState("");
  const [valorAnterior, setValorAnterior] = useState(null);

  const WEBAPP_URL =
    "https://script.google.com/macros/s/AKfycby1kZ8ITZVwhsaHuw6hw1u0todLzX4gFAQY762P50refAjJx5lVPUk9nq-Chua6yBOl/exec";
  const SHEET_IFRAME =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlbYlX3y3ym8VeKgl9INPxLa_jEcbmud4d6aQJ9zOEFPU6Mrd3lZcObc-ojsRi8uSPmVxKjH8Nliru/pubhtml?gid=1720136139&single=true&widget=true&headers=false";

  const refrescarIframe = () => {
    setIframeSrc(`${SHEET_IFRAME}&t=${Date.now()}`); // evita caché
  };

  const chequearEstado = async () => {
    try {
      const { data } = await axios.get(WEBAPP_URL);
      const valor = data.trim().toLowerCase();

      if (valor === "true" && valorAnterior !== "true") {
        console.log("🔄 Actualización detectada...");
        refrescarIframe();
        await axios.post(WEBAPP_URL, new URLSearchParams({ valor: false }));
        setValorAnterior("true");
      } else {
        setValorAnterior(valor);
      }
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  useEffect(() => {
    refrescarIframe(); // cargar iframe inicial
    const interval = setInterval(chequearEstado, 30000); // cada 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>📊 Vista en Tiempo Real</h2>
      <iframe
        src={iframeSrc}
        title="Google Sheet"
        width="100%"
        height="600"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
};

export default SheetViewer;
