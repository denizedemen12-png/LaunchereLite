const accountInput = document.getElementById("accountName");
const versionSelect = document.getElementById("versionSelect");
const installBtn = document.getElementById("installBtn");
const readyBtn = document.getElementById("readyBtn");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const downloadLabel = document.getElementById("downloadLabel");
const statusText = document.getElementById("statusText");
const statusDot = document.getElementById("statusDot");
const statusLabel = document.getElementById("statusLabel");
const summaryAccount = document.getElementById("summaryAccount");
const summaryVersion = document.getElementById("summaryVersion");
const summaryStatus = document.getElementById("summaryStatus");

const steps = {
  version: document.getElementById("stepVersion"),
  download: document.getElementById("stepDownload"),
  verify: document.getElementById("stepVerify"),
  ready: document.getElementById("stepReady"),
};

let progressTimer = null;

const setStatus = (message, label, color) => {
  statusText.textContent = message;
  statusLabel.textContent = label;
  statusDot.style.background = color;
  summaryStatus.textContent = label;
};

const setStepState = (stepKey, state) => {
  const element = steps[stepKey];
  element.classList.remove("active", "done");
  if (state === "active") {
    element.classList.add("active");
  }
  if (state === "done") {
    element.classList.add("done");
  }
};

const resetSteps = () => {
  Object.keys(steps).forEach((key) => {
    setStepState(key, "");
  });
  setStepState("version", "active");
};

const updateSummary = () => {
  summaryAccount.textContent = accountInput.value.trim() || "-";
  summaryVersion.textContent = versionSelect.value ? `Minecraft ${versionSelect.value}` : "-";
};

const startInstallation = () => {
  if (!accountInput.value.trim()) {
    accountInput.focus();
    setStatus("Devam etmek için hesap adı girin.", "Eksik Bilgi", "#f59e0b");
    return;
  }

  updateSummary();
  resetSteps();
  readyBtn.disabled = true;
  installBtn.disabled = true;
  let progress = 0;
  progressBar.style.width = "0%";
  progressLabel.textContent = "%0";
  downloadLabel.textContent = "Sürüm kontrol ediliyor";
  setStatus("Sürüm kontrol ediliyor...", "Kurulum", "#60a5fa");

  if (progressTimer) {
    clearInterval(progressTimer);
  }

  progressTimer = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress > 100) progress = 100;

    progressBar.style.width = `${progress}%`;
    progressLabel.textContent = `%${progress}`;

    if (progress < 35) {
      downloadLabel.textContent = "Sürüm kontrol ediliyor";
      setStepState("version", "active");
    } else if (progress < 70) {
      setStepState("version", "done");
      setStepState("download", "active");
      downloadLabel.textContent = "Dosyalar indiriliyor";
    } else if (progress < 95) {
      setStepState("download", "done");
      setStepState("verify", "active");
      downloadLabel.textContent = "Dosyalar doğrulanıyor";
    } else {
      setStepState("verify", "done");
      setStepState("ready", "active");
      downloadLabel.textContent = "Son kontroller";
    }

    if (progress === 100) {
      clearInterval(progressTimer);
      setStepState("ready", "done");
      downloadLabel.textContent = "Kurulum tamamlandı";
      setStatus("Her şey hazır! Oyunu başlatabilirsiniz.", "Hazır", "#34d399");
      readyBtn.disabled = false;
      installBtn.disabled = false;
    }
  }, 400);
};

installBtn.addEventListener("click", startInstallation);
readyBtn.addEventListener("click", () => {
  setStatus("Oyun başlatılmaya hazır. İyi eğlenceler!", "Hazır", "#34d399");
});

accountInput.addEventListener("input", updateSummary);
versionSelect.addEventListener("change", updateSummary);

updateSummary();
resetSteps();
