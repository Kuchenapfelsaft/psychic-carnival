let score = 0;
let upgradeCost = 10;
let autoPointsPerSecond = 0;
let clickValue = 1;
let timer = 60;

const scoreDisplay = document.getElementById("score");
const clickButton = document.getElementById("clickButton");
const upgradeButton = document.getElementById("buyUpgrade");
const autoPointsDisplay = document.getElementById("autoPoints");
const timerDisplay = document.getElementById("timer");

clickButton.addEventListener("click", () => {
  score += clickValue;
  scoreDisplay.textContent = score;
  adjustDifficulty();
});

upgradeButton.addEventListener("click", () => {
  if (score >= upgradeCost) {
    score -= upgradeCost;
    clickValue += 1;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    updateUpgradeCost();
  }
});

function adjustDifficulty() {
  if (score > 10 && score <= 30) {
    clickButton.style.fontSize = "18px";
    clickButton.style.padding = "12px 24px";
  } else if (score > 30 && score <= 50) {
    clickButton.style.fontSize = "16px";
    clickButton.style.padding = "10px 20px";
  } else if (score > 50) {
    clickButton.style.fontSize = "14px";
    clickButton.style.padding = "8px 16px";
  }
}

function updateUpgradeCost() {
  document.getElementById("upgradeCost").textContent = upgradeCost;
}

function startAutoPoints() {
  setInterval(() => {
    score += autoPointsPerSecond;
    scoreDisplay.textContent = score;
    autoPointsDisplay.textContent = "Automatische Punkte: " + autoPointsPerSecond;
  }, 1000);
}

function startTimer() {
  const timerInterval = setInterval(() => {
    if (timer > 0) {
      timer--;
      timerDisplay.textContent = "Zeit: " + timer + "s";
    } else {
      clearInterval(timerInterval);
      alert("Spiel beendet! Dein Punktestand: " + score);
    }
  }, 1000);
}

startAutoPoints();
startTimer();
