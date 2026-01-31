const term = document.getElementById("terminal");

function log(txt, delay = 400) {
  return new Promise(res => {
    setTimeout(() => {
      term.textContent += "\n" + txt;
      term.scrollTop = term.scrollHeight;
      res();
    }, delay);
  });
}

async function scan() {
  term.textContent = "";
  await log("[+] Connecting to OSINT nodes...");
  await log("[+] Establishing secure tunnel...");
  await log("[+] Validating target...");
  await log("[+] Querying external intelligence...");
  await log("[✓] Analysis completed.");
  await log("[+] Ready for export.");
}
