const marathonStart = new Date("2026-05-01T11:00:00");
const countdownNode = document.getElementById("countdown");

const floatingField = document.createElement("div");
floatingField.className = "floating-field";

for (let i = 0; i < 15; i += 1) {
  const shard = document.createElement("span");
  shard.className = "float-shard";
  const size = 6 + Math.random() * 18;
  const hue = 30 + Math.random() * 180;
  shard.style.width = `${size}px`;
  shard.style.height = `${size}px`;
  shard.style.left = `${Math.random() * 100}%`;
  shard.style.top = `${Math.random() * 100}%`;
  shard.style.background = `hsla(${hue}, 75%, 70%, 0.45)`;
  shard.style.setProperty("--speed", `${7 + Math.random() * 11}s`);
  shard.style.setProperty("--rise", `${12 + Math.random() * 45}px`);
  shard.style.setProperty("--slide", `${-20 + Math.random() * 40}px`);
  shard.style.animationDelay = `${Math.random() * 8}s`;
  floatingField.append(shard);
}

document.body.append(floatingField);

const emojiField = document.createElement("div");
emojiField.className = "emoji-field";
const emojiSet = ["💍", "🧙", "🧝", "⚔️", "🏹", "🔥", "🛡️", "🗡️", "🌋", "🦅"];

for (let i = 0; i < 12; i += 1) {
  const emoji = document.createElement("span");
  emoji.className = "float-emoji";
  emoji.textContent = emojiSet[Math.floor(Math.random() * emojiSet.length)];
  emoji.style.left = `${Math.random() * 100}%`;
  emoji.style.top = `${Math.random() * 100}%`;
  emoji.style.fontSize = `${0.8 + Math.random() * 1}rem`;
  emoji.style.setProperty("--speed", `${5 + Math.random() * 8}s`);
  emoji.style.setProperty("--rise", `${10 + Math.random() * 35}px`);
  emoji.style.setProperty("--slide", `${-24 + Math.random() * 48}px`);
  emoji.style.animationDelay = `${Math.random() * 9}s`;
  emojiField.append(emoji);
}

document.body.append(emojiField);

const ringButton = document.getElementById("ring-button");
const ringMessage = document.getElementById("ring-message");
let ringClicks = 0;

const anthem = new Audio("Theyre_Taking_The_Hobbits_To_Isengard.mp3");
anthem.loop = true;
anthem.preload = "auto";

const MUSIC_VOLUME_KEY = "lotr_music_volume";
const MUSIC_TIME_KEY = "lotr_music_time";
const MUSIC_PLAYING_KEY = "lotr_music_playing";

const savedVolume = Number(localStorage.getItem(MUSIC_VOLUME_KEY));
anthem.volume = Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1 ? savedVolume : 0.4;

const savedTime = Number(localStorage.getItem(MUSIC_TIME_KEY));
if (Number.isFinite(savedTime) && savedTime > 0) {
  anthem.currentTime = savedTime;
}

const audioDock = document.createElement("aside");
audioDock.className = "audio-dock";
audioDock.innerHTML = "<strong>Isengard Anthem</strong><button id=\"audio-toggle\" type=\"button\">Play</button><input id=\"audio-volume\" type=\"range\" min=\"0\" max=\"1\" step=\"0.05\" value=\"0.4\" aria-label=\"Music volume\">";
audioDock.classList.add("is-hidden");
const anthemSlot = document.getElementById("anthem-slot");
if (anthemSlot) {
  anthemSlot.append(audioDock);
}

const audioToggle = document.getElementById("audio-toggle");
const audioVolume = document.getElementById("audio-volume");

if (audioToggle && audioVolume) {
  audioVolume.value = String(anthem.volume);

  const showAudioDock = () => {
    audioDock.classList.remove("is-hidden");
  };

  const startAnthem = async () => {
    try {
      await anthem.play();
      anthem.muted = false;
      audioToggle.textContent = "Pause";
      showAudioDock();
      return true;
    } catch (error) {
      return false;
    }
  };

  const syncState = () => {
    localStorage.setItem(MUSIC_VOLUME_KEY, String(anthem.volume));
    localStorage.setItem(MUSIC_TIME_KEY, String(anthem.currentTime));
    localStorage.setItem(MUSIC_PLAYING_KEY, anthem.paused ? "0" : "1");
  };

  audioToggle.addEventListener("click", async () => {
    if (!anthem.paused && anthem.muted) {
      anthem.muted = false;
      audioToggle.textContent = "Pause";
      syncState();
      return;
    }

    if (anthem.paused) {
      if (await startAnthem()) {
        syncState();
      } else {
        audioToggle.textContent = "Tap again";
      }
    } else {
      anthem.pause();
      audioToggle.textContent = "Play";
      syncState();
    }
  });

  audioVolume.addEventListener("input", () => {
    anthem.volume = Number(audioVolume.value);
    syncState();
  });

  anthem.addEventListener("timeupdate", syncState);
  window.addEventListener("beforeunload", syncState);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      syncState();
    }
  });

  ringButton?.addEventListener("click", async () => {
    if (ringClicks === 9 && anthem.paused) {
      if (await startAnthem()) {
        syncState();
      }
    }
  });
}

if (countdownNode) {
  const tick = () => {
    const now = new Date();
    const delta = marathonStart - now;

    if (delta <= 0) {
      countdownNode.textContent = "The marathon has begun. Keep it secret. Keep it safe.";
      return;
    }

    const days = Math.floor(delta / 86400000);
    const hours = Math.floor((delta % 86400000) / 3600000);
    const mins = Math.floor((delta % 3600000) / 60000);
    const secs = Math.floor((delta % 60000) / 1000);
    const hh = String(hours).padStart(2, "0");
    const mm = String(mins).padStart(2, "0");
    const ss = String(secs).padStart(2, "0");
    countdownNode.innerHTML = `<span class="countdown-label">Countdown to Friday 11:00</span><span class="countdown-time">${days}d ${hh}:${mm}:${ss}</span>`;
  };

  tick();
  setInterval(tick, 1000);
}

if (ringButton && ringMessage) {
  ringButton.addEventListener("click", () => {
    ringButton.classList.remove("awake");
    void ringButton.offsetWidth;
    ringButton.classList.add("awake");
    ringClicks += 1;
    if (ringClicks === 3) {
      ringMessage.textContent = "Three clicks for Elven-kings under the sky...";
    } else if (ringClicks === 7) {
      ringMessage.textContent = "Seven for the Dwarf-lords in their halls of stone...";
    } else if (ringClicks === 9) {
      ringMessage.textContent = "Nine for Mortal Men doomed to die... Mordor mode ignites the whole realm.";
      document.body.classList.add("eye-of-sauron");
      if (anthem.paused && audioToggle) {
        audioToggle.click();
      }
    } else if (ringClicks >= 10) {
      ringMessage.textContent = "One for the Dark Lord on his dark throne. The hidden door is near.";
    }
  });
}

const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiIndex = 0;
let typed = "";
let durinGatewayShown = false;

const showDurinGateway = () => {
  if (durinGatewayShown) {
    return;
  }

  durinGatewayShown = true;
  const gateway = document.createElement("a");
  gateway.href = "doors-of-durin.html";
  gateway.className = "durin-gateway";
  gateway.setAttribute("aria-label", "Enter the Doors of Durin");
  gateway.innerHTML = '<img src="assets/images/doors-of-durin.png" alt="Doors of Durin">';
  document.body.append(gateway);
};

document.addEventListener("keydown", (event) => {
  if (event.key === konami[konamiIndex]) {
    konamiIndex += 1;
    if (konamiIndex === konami.length) {
      document.body.classList.toggle("eye-of-sauron");
      if (ringMessage) {
        ringMessage.textContent = "Konami found: The Eye is watching.";
      }
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }

  if (event.key.length === 1) {
    typed += event.key.toLowerCase();
    typed = typed.slice(-12);
  }

  if (typed.includes("mellon")) {
    showDurinGateway();
    if (ringMessage) {
      ringMessage.textContent = "The doors reveal themselves.";
    }
    typed = "";
  }
});

const titles = document.querySelectorAll(".secret-title");
const fellowshipBadge = document.getElementById("fellowship-badge");
let expected = 1;

titles.forEach((titleButton) => {
  titleButton.addEventListener("click", () => {
    const order = Number(titleButton.dataset.order);
    if (order === expected) {
      expected += 1;
      titleButton.style.color = "#9de4d2";
      if (expected === 7 && fellowshipBadge) {
        fellowshipBadge.classList.add("show");
      }
    } else {
      expected = 1;
      titles.forEach((btn) => {
        btn.style.color = "";
      });
      if (fellowshipBadge) {
        fellowshipBadge.classList.remove("show");
      }
      if (ringMessage) {
        ringMessage.textContent = "Wrong order. The path is closed. Begin again at movie 1.";
      }
    }
  });
});

const quoteBtn = document.getElementById("quote-btn");
const quoteOutput = document.getElementById("quote-output");
const quotes = [
  '"All we have to decide is what to do with the time that is given us."',
  '"There is some good in this world, and it is worth fighting for."',
  '"Even darkness must pass."',
  '"You bow to no one."',
  '"I will not say: do not weep; for not all tears are an evil."'
];

if (quoteBtn && quoteOutput) {
  quoteBtn.addEventListener("click", () => {
    const random = Math.floor(Math.random() * quotes.length);
    quoteOutput.textContent = quotes[random];
  });
}
