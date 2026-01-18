let currentScore = 0;
let rollsLeft = 10;
const STARTING_ROLLS = 10;
let isRolling = false;

const die1El = document.getElementById("die1");
const die2El = document.getElementById("die2");
const sumEl = document.getElementById("sum");
const lastPointsEl = document.getElementById("lastPoints");
const currentScoreEl = document.getElementById("currentScore");
const rollsLeftEl = document.getElementById("rollsLeft");
const rollBtn = document.getElementById("rollBtn");
const newRoundBtn = document.getElementById("newRoundBtn");

const leaderboardListEl = document.getElementById("leaderboardList");

const nameModal = document.getElementById("nameModal");
const modalScoreEl = document.getElementById("modalScore");
const playerNameInput = document.getElementById("playerName");
const submitNameBtn = document.getElementById("submitNameBtn");
const skipNameBtn = document.getElementById("skipNameBtn");

const BOARD_KEY = "diceTop10";

function rollSingleDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function loadLeaderboard() {
  return JSON.parse(localStorage.getItem(BOARD_KEY)) || [];
}

function saveLeaderboard(list) {
  localStorage.setItem(BOARD_KEY, JSON.stringify(list));
}

function updateLeaderboardUI() {
  const list = loadLeaderboard();
  leaderboardListEl.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const li = document.createElement("li");
    if (list[i]) {
      li.innerHTML = `<span>${i + 1}. ${list[i].name}</span><span>${
        list[i].score
      }</span>`;
    } else {
      li.innerHTML = `<span>${i + 1}. ---</span><span>0</span>`;
    }
    leaderboardListEl.appendChild(li);
  }
}

function addToLeaderboard(name, score) {
  const list = loadLeaderboard();
  list.push({ name, score });
  list.sort((a, b) => b.score - a.score);
  saveLeaderboard(list.slice(0, 10));
  updateLeaderboardUI();
}

function updateUI() {
  currentScoreEl.textContent = `Wynik rundy: ${currentScore}`;
  rollsLeftEl.textContent = `Pozostałe rzuty: ${rollsLeft}`;
  updateLeaderboardUI();
}

function rollDice() {
  if (isRolling || rollsLeft <= 0) return;

  isRolling = true;
  rollBtn.disabled = true;

  die1El.classList.add("roll");
  die2El.classList.add("roll");

  const d1 = rollSingleDie();
  const d2 = rollSingleDie();
  const sum = d1 + d2;

  let points = sum * 10;

  if (d1 === d2) {
    points *= 2;
  }

  if (d1 === 1 && d2 === 1) {
    points -= 110;
  }

  setTimeout(() => {
    die1El.classList.remove("roll");
    die2El.classList.remove("roll");

    die1El.textContent = d1;
    die2El.textContent = d2;

    sumEl.textContent = `Suma: ${sum}`;
    lastPointsEl.textContent = `Ostatni rzut: +${points}`;

    rollsLeft--;

    if (sum === 12) {
      rollsLeft++;
      lastPointsEl.textContent += " (dodatkowy rzut!)";
    }

    currentScore += points;
    updateUI();

    if (rollsLeft <= 0) {
      endRound();
    } else {
      rollBtn.disabled = false;
    }

    isRolling = false;
  }, 500);
}

function endRound() {
  rollBtn.disabled = true;
  newRoundBtn.disabled = false;
  modalScoreEl.textContent = currentScore;
  nameModal.classList.remove("hidden");
  playerNameInput.value = "";
  playerNameInput.focus();
}

function newRound() {
  currentScore = 0;
  rollsLeft = STARTING_ROLLS;
  sumEl.textContent = "Suma: —";
  lastPointsEl.textContent = "Ostatni rzut: +0";
  die1El.innerHTML = '<i class="fa-solid fa-dice-one"></i>';
  die2El.innerHTML = '<i class="fa-solid fa-dice-six"></i>';
  rollBtn.disabled = false;
  newRoundBtn.disabled = true;
  updateUI();
}

submitNameBtn.onclick = () => {
  const name = playerNameInput.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .padEnd(3, " ")
    .slice(0, 3);

  if (name.trim() !== "") {
    addToLeaderboard(name, currentScore);
  }

  nameModal.classList.add("hidden");
};

skipNameBtn.onclick = () => {
  nameModal.classList.add("hidden");
};

function resetLeaderboard() {
  if (confirm("Zresetować Top 10?")) {
    localStorage.removeItem(BOARD_KEY);
    updateLeaderboardUI();
  }
}

updateUI();

