const term = document.getElementById("terminal");
const typeSound = document.getElementById("typeSound");
const beepSound = document.getElementById("beepSound");

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function playType() {
  typeSound.currentTime = 0;
  typeSound.volume = 0.2;
  typeSound.play();
}

function log(txt) {
  playType();
  term.textContent += txt + "\n";
  term.scrollTop = term.scrollHeight;
}

function detectarVoip(num) {
  return num.includes("800") || num.includes("900");
}

function detectarPais(num) {
  if (num.startsWith("+34")) return "ES";
  if (num.startsWith("+33")) return "FR";
  if (num.startsWith("+49")) return "DE";
  if (num.startsWith("+1")) return "US";
  return "UNKNOWN";
}

function randomASN() {
  return "AS" + Math.floor(10000 + Math.random() * 90000);
}

async function scan() {
  const num = document.getElementById("numero").value.trim();
  if (!num) return alert("Introduce un número");

  term.textContent = "";
  document.querySelector(".title").classList.add("glitch");

  log("[+] Initializing OSINT Core...");
  await delay(600);
  log("[+] Establishing secure channel...");
  await delay(700);
  log("[+] Parsing target...");
  await delay(700);

  const pais = detectarPais(num);
  const voip = detectarVoip(num);

  log("[+] Country: " + pais);
  await delay(600);
  log("[+] Carrier: Mobile Network");
  await delay(600);
  log("[+] VOIP: " + (voip ? "YES" : "NO"));
  await delay(600);
  log("[+] ASN: " + randomASN());
  await delay(600);
  log("[+] Risk Score: " + (voip ? "HIGH" : "LOW"));
  await delay(800);

  log("[✓] Scan completed.");
  log("[+] Ready for export.");

  document.querySelector(".title").classList.remove("glitch");
  beepSound.play();

  setTimeout(() => {
    document.getElementById("access").classList.remove("hidden");
    beepSound.play();
  }, 500);

  setTimeout(() => {
    document.getElementById("access").classList.add("hidden");
  }, 2500);
}

function exportarTXT() {
  const blob = new Blob([term.textContent], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "sixclown_scan.txt";
  a.click();
}

function exportarJSON() {
  const lines = term.textContent.split("\n");
  const data = {};
  lines.forEach(l => {
    if (l.includes(":")) {
      const p = l.split(":");
      data[p[0].replace("[+]", "").trim()] = p.slice(1).join(":").trim();
    }
  });
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "sixclown_scan.json";
  a.click();
    }
