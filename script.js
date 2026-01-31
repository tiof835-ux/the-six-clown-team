const terminal = document.getElementById("terminal");
let lastScanData = null;

function print(line, delay = 400) {
  return new Promise(res => {
    setTimeout(() => {
      terminal.textContent += line + "\n";
      terminal.scrollTop = terminal.scrollHeight;
      res();
    }, delay);
  });
}

async function iniciarEscaneo(numero) {
  terminal.textContent = "";
  await print("[+] Inicializando módulo OSINT...");
  await print("[+] Conectando a nodos...");
  await print("[✓] Conexión establecida");

  try {
    const res = await fetch(
      "https://TU-BACKEND.onrender.com/scan?numero=" + numero
    );
    const data = await res.json();
    lastScanData = data;

    if (!data.valid) {
      await print("[X] Número inválido");
      return;
    }

    await print("[+] Analizando datos...");
    await print("────────────────────────────");
    await print(`Número     : ${data.numero}`);
    await print(`País       : ${data.pais}`);
    await print(`Región     : ${data.region}`);
    await print(`Operador   : ${data.operador}`);
    await print(`Tipo línea : ${data.tipo_linea}`);
    await print(data.voip ? "⚠ VoIP DETECTADO" : "✓ No VoIP");

    await print("────────────────────────────");
    await print(`[+] ASN : ${data.asn}`);
    await print(`[+] Org : ${data.organizacion}`);
    await print(`[+] Riesgo : ${data.riesgo}/100`);
    await print("[✓] Escaneo completado");

  } catch {
    await print("[X] ERROR DE CONEXIÓN");
  }
}

// EXPORTES (igual que antes)
async function generarHash(texto) {
  const data = new TextEncoder().encode(texto);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function exportarTXT() {
  if (!lastScanData) return alert("No hay datos");

  let contenido = `
THE SIX CLOWN TEAM — OSINT REPORT
Número: ${lastScanData.numero}
País: ${lastScanData.pais}
Región: ${lastScanData.region}
Operador: ${lastScanData.operador}
ASN: ${lastScanData.asn}
Riesgo: ${lastScanData.riesgo}/100
`;

  const hash = await generarHash(contenido);
  contenido += `\nHash: ${hash}\nFirmado por THE SIX CLOWN TEAM`;

  const blob = new Blob([contenido], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "sixclown_report.txt";
  a.click();
}

function exportarJSON() {
  if (!lastScanData) return;
  const blob = new Blob(
    [JSON.stringify(lastScanData, null, 2)],
    { type: "application/json" }
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "sixclown_report.json";
  a.click();
}
