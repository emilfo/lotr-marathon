const marathonStart = new Date("2026-05-01T11:00:00");
const countdownNode = document.getElementById("countdown");

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
    countdownNode.textContent = `Countdown to Friday 11:00: ${days}d ${hours}h ${mins}m`;
  };

  tick();
  setInterval(tick, 1000 * 20);
}

const ringButton = document.getElementById("ring-button");
const ringMessage = document.getElementById("ring-message");
let ringClicks = 0;

if (ringButton && ringMessage) {
  ringButton.addEventListener("click", () => {
    ringClicks += 1;
    if (ringClicks === 3) {
      ringMessage.textContent = "Three clicks for Elven-kings under the sky...";
    } else if (ringClicks === 7) {
      ringMessage.textContent = "Seven for the Dwarf-lords in their halls of stone...";
    } else if (ringClicks === 9) {
      ringMessage.textContent = "Nine for Mortal Men doomed to die... you unlocked an easter egg.";
      document.body.classList.add("eye-of-sauron");
    } else if (ringClicks >= 10) {
      ringMessage.textContent = "One for the Dark Lord on his dark throne. Type mellon to proceed.";
    }
  });
}

const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiIndex = 0;
let typed = "";

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
    window.location.href = "doors-of-durin.html";
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
