const levels = [
  {
    title: "Mirror the Rail",
    difficulty: "Easy",
    instruction: "Reverse the row so the clothes appear from right to left.",
    tip: "Only flex-direction is needed in this stage.",
    items: [["👕", "Shirt", ""], ["👖", "Jeans", "tall"], ["🧥", "Jacket", ""], ["👗", "Dress", "tall"]],
    active: ["flexDirection"],
    solution: { flexDirection: "row-reverse", justifyContent: "flex-start", alignItems: "stretch", flexWrap: "nowrap" }
  },
  {
    title: "Right Side, Please",
    difficulty: "Easy",
    instruction: "Keep the clothes in a row and move the whole group to the right side of the closet.",
    tip: "Think about how justify-content moves items along the main axis.",
    items: [["👚", "Top", ""], ["👖", "Pants", "tall"], ["🧣", "Scarf", "short"], ["👜", "Bag", ""]],
    active: ["justifyContent"],
    solution: { flexDirection: "row", justifyContent: "flex-end", alignItems: "stretch", flexWrap: "nowrap" }
  },
  {
    title: "Center the Hangers",
    difficulty: "Medium",
    instruction: "Arrange the clothes from top to bottom and center them horizontally inside the closet.",
    tip: "This stage needs a combination of flex-direction and align-items.",
    items: [["👕", "Tee", ""], ["🧥", "Coat", ""], ["👗", "Dress", ""]],
    active: ["flexDirection", "alignItems"],
    solution: { flexDirection: "column", justifyContent: "flex-start", alignItems: "center", flexWrap: "nowrap" }
  },
  {
    title: "Bottom Shelf Spacing",
    difficulty: "Medium",
    instruction: "Keep the clothes in a row, place equal space between them, and move them to the bottom of the closet.",
    tip: "Use justify-content for spacing and align-items for vertical position.",
    items: [["👟", "Shoes", "short"], ["👜", "Bag", ""], ["🧢", "Cap", "short"], ["👠", "Heels", ""]],
    active: ["justifyContent", "alignItems"],
    solution: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "nowrap" }
  },
  {
    title: "Reverse Column Stack",
    difficulty: "Medium",
    instruction: "Stack the clothes from bottom to top, center the stack vertically, and place it on the right side of the closet.",
    tip: "Three Flexbox properties work together here.",
    items: [["🧥", "Coat", ""], ["👕", "Shirt", ""], ["👖", "Jeans", ""]],
    active: ["flexDirection", "justifyContent", "alignItems"],
    solution: { flexDirection: "column-reverse", justifyContent: "center", alignItems: "flex-end", flexWrap: "nowrap" }
  },
  {
    title: "Closet Overflow!",
    difficulty: "Hard",
    instruction: "There are too many items for one row. Wrap them onto multiple rows, add space around the items, and center items within each row.",
    tip: "This stage introduces flex-wrap and combines it with two more Flexbox properties.",
    items: [
      ["👕", "Tee", ""], ["👖", "Jeans", "tall"], ["🧥", "Coat", ""],
      ["👗", "Dress", "tall"], ["🧢", "Cap", "short"], ["👟", "Shoes", ""],
      ["👜", "Bag", "short"], ["🧣", "Scarf", "tall"], ["👚", "Top", ""]
    ],
    active: ["flexWrap", "justifyContent", "alignItems"],
    solution: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap" }
  },
  {
    title: "Evenly Distributed Column",
    difficulty: "Advanced",
    instruction: "Arrange items vertically from top to bottom, distribute them with equal space around all edges, and push them to the far left.",
    tip: "Look into space-evenly along the column axis and check your cross-axis alignment.",
    items: [["🕶️", "Glasses", "short"], ["👒", "Sunhat", ""], ["🧦", "Socks", "short"]],
    active: ["flexDirection", "justifyContent", "alignItems"],
    solution: { flexDirection: "column", justifyContent: "space-evenly", alignItems: "flex-start", flexWrap: "nowrap" }
  },
  {
    title: "The Grand Boutique",
    difficulty: "Expert",
    instruction: "Final test: wrap items across lines, arrange them with space-between on the main axis, and stretch them along the cross axis.",
    tip: "Combine flex-wrap with space-between and stretch.",
    items: [
      ["👔", "Tie", "short"], ["👞", "Oxford", ""], ["🥾", "Boots", "tall"],
      ["🎽", "Jersey", ""], ["🧤", "Gloves", "short"], ["🩳", "Shorts", ""]
    ],
    active: ["flexWrap", "justifyContent", "alignItems"],
    solution: { flexDirection: "row", justifyContent: "space-between", alignItems: "stretch", flexWrap: "wrap" }
  }
];

// --- Core DOM Nodes ---
const board = document.getElementById("game-board");
const stageTitle = document.getElementById("stage-title");
const stageInstruction = document.getElementById("stage-instruction");
const stageTip = document.getElementById("stage-tip");
const stageLabel = document.getElementById("stage-label");
const attemptsLabel = document.getElementById("attempts-label");
const feedback = document.getElementById("feedback");
const stageDots = document.getElementById("stage-dots");
const difficultyBadge = document.getElementById("level-difficulty-badge");
const timerDisplay = document.getElementById("timer-display");

const directionSelect = document.getElementById("flex-direction");
const justifySelect = document.getElementById("justify-content");
const alignSelect = document.getElementById("align-items");
const wrapSelect = document.getElementById("flex-wrap");
const checkBtn = document.getElementById("check-btn");
const resetBtn = document.getElementById("reset-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const app = document.querySelector(".app");
const completionScreen = document.getElementById("completion-screen");
const finalAttempts = document.getElementById("final-attempts");
const finalTime = document.getElementById("final-time");
const helpBtn = document.getElementById("help-toggle-btn");
const cheatsheetModal = document.getElementById("cheatsheet-modal");
const closeModalBtn = document.getElementById("close-modal-btn");

const controls = {
  flexDirection: directionSelect,
  justifyContent: justifySelect,
  alignItems: alignSelect,
  flexWrap: wrapSelect
};

const notes = {
  flexDirection: document.getElementById("note-flex-direction"),
  justifyContent: document.getElementById("note-justify-content"),
  alignItems: document.getElementById("note-align-items"),
  flexWrap: document.getElementById("note-flex-wrap")
};

let currentLevel = 0;
let currentAttempts = 0;
let totalAttempts = 0;
let completedLevels = new Set();
let secondsElapsed = 0;
let timerInterval = null;

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsElapsed++;
    const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
    const secs = String(secondsElapsed % 60).padStart(2, "0");
    timerDisplay.textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function loadSavedState() {
  const stored = localStorage.getItem("closet_flex_save_v2");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      completedLevels = new Set(parsed.completed || []);
      totalAttempts = parsed.totalAttempts || 0;
      secondsElapsed = parsed.elapsed || 0;
    } catch (err) {
      console.warn("Storage sync failed:", err);
    }
  }
}

function saveState() {
  localStorage.setItem("closet_flex_save_v2", JSON.stringify({
    completed: Array.from(completedLevels),
    totalAttempts: totalAttempts,
    elapsed: secondsElapsed
  }));
}

function renderWardrobeItems(items) {
  board.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    const [emoji, label, modifier] = items[i];
    const container = document.createElement("div");
    container.className = `clothing-item ${modifier}`.trim();

    const iconSpan = document.createElement("span");
    iconSpan.className = "emoji";
    iconSpan.textContent = emoji;

    const labelSpan = document.createElement("span");
    labelSpan.className = "item-name";
    labelSpan.textContent = label;

    container.appendChild(iconSpan);
    container.appendChild(labelSpan);
    board.appendChild(container);
  }
}

function refreshControlsForLevel(level) {
  for (const [key, selectElem] of Object.entries(controls)) {
    const isRequired = level.active.includes(key);
    selectElem.disabled = !isRequired;
    
    const indicator = document.getElementById(`indicator-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`);
    if (indicator) {
      indicator.className = `status-indicator ${isRequired ? "active" : "inactive"}`;
    }

    notes[key].textContent = isRequired 
      ? "Adjust this rule" 
      : "Locked in this setup";
  }
}

function syncBoardWithControls() {
  board.style.flexDirection = directionSelect.value;
  board.style.justifyContent = justifySelect.value;
  board.style.alignItems = alignSelect.value;
  board.style.flexWrap = wrapSelect.value;
}

function updateProgressIndicator() {
  stageLabel.textContent = `Stage ${currentLevel + 1} of ${levels.length}`;
  attemptsLabel.textContent = `${currentAttempts}`;
  stageDots.innerHTML = "";

  for (let idx = 0; idx < levels.length; idx++) {
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.className = "stage-dot";
    indicator.textContent = idx + 1;

    if (idx === currentLevel) {
      indicator.classList.add("current");
    }

    if (completedLevels.has(idx)) {
      indicator.classList.add("completed", "available");
      indicator.addEventListener("click", () => navigateToStage(idx));
    } else if (idx < currentLevel) {
      indicator.classList.add("available");
      indicator.addEventListener("click", () => navigateToStage(idx));
    } else {
      indicator.disabled = idx !== currentLevel;
    }

    stageDots.appendChild(indicator);
  }
}

function resetActiveStage() {
  const currentStageData = levels[currentLevel];
  currentAttempts = 0;

  directionSelect.value = "row";
  justifySelect.value = "flex-start";
  alignSelect.value = "stretch";
  wrapSelect.value = "nowrap";

  refreshControlsForLevel(currentStageData);
  syncBoardWithControls();

  feedback.className = "feedback";
  feedback.textContent = "";
  nextBtn.classList.add("hidden");
  updateProgressIndicator();
}

function navigateToStage(stageIndex) {
  currentLevel = stageIndex;
  currentAttempts = 0;
  const stage = levels[currentLevel];

  stageTitle.textContent = stage.title;
  stageInstruction.textContent = stage.instruction;
  stageTip.textContent = stage.tip;
  
  if (difficultyBadge) {
    difficultyBadge.textContent = stage.difficulty;
    difficultyBadge.className = `badge badge-${stage.difficulty.toLowerCase()}`;
  }

  renderWardrobeItems(stage.items);
  resetActiveStage();
}

function verifySolution() {
  const sol = levels[currentLevel].solution;
  return (
    directionSelect.value === sol.flexDirection &&
    justifySelect.value === sol.justifyContent &&
    alignSelect.value === sol.alignItems &&
    wrapSelect.value === sol.flexWrap
  );
}

function handleCheckSubmission() {
  currentAttempts++;
  totalAttempts++;
  updateProgressIndicator();

  if (verifySolution()) {
    completedLevels.add(currentLevel);
    saveState();

    feedback.className = "feedback success";
    feedback.textContent = "✨ Superb! All clothes are placed precisely in order.";
    updateProgressIndicator();

    nextBtn.textContent = currentLevel === levels.length - 1 
      ? "Review Final Results →" 
      : "Advance to Next Stage →";
    nextBtn.classList.remove("hidden");
  } else {
    feedback.className = "feedback error";
    feedback.textContent = "Not quite aligned yet. Inspect your flex rules and try again.";
    nextBtn.classList.add("hidden");
  }
}

function advanceToNextLevel() {
  if (!completedLevels.has(currentLevel)) return;

  if (currentLevel === levels.length - 1) {
    stopTimer();
    app.classList.add("hidden");
    completionScreen.classList.remove("hidden");
    finalAttempts.textContent = totalAttempts;
    finalTime.textContent = timerDisplay.textContent;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    navigateToStage(currentLevel + 1);
  }
}

function resetGameEntirely() {
  currentLevel = 0;
  currentAttempts = 0;
  totalAttempts = 0;
  secondsElapsed = 0;
  completedLevels.clear();
  localStorage.removeItem("closet_flex_save_v2");

  completionScreen.classList.add("hidden");
  app.classList.remove("hidden");
  startTimer();
  navigateToStage(0);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openModal() {
  cheatsheetModal.classList.remove("hidden");
  cheatsheetModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  cheatsheetModal.classList.add("hidden");
  cheatsheetModal.setAttribute("aria-hidden", "true");
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !cheatsheetModal.classList.contains("hidden")) {
    closeModal();
    return;
  }

  if (e.target.tagName === "SELECT") return;

  if (e.key === "Enter") {
    if (!nextBtn.classList.contains("hidden")) {
      advanceToNextLevel();
    } else {
      handleCheckSubmission();
    }
  } else if (e.key.toLowerCase() === "r") {
    resetActiveStage();
  } else if (e.key === "ArrowRight" && !nextBtn.classList.contains("hidden")) {
    advanceToNextLevel();
  }
});

for (const select of Object.values(controls)) {
  select.addEventListener("change", syncBoardWithControls);
}

checkBtn.addEventListener("click", handleCheckSubmission);
resetBtn.addEventListener("click", resetActiveStage);
nextBtn.addEventListener("click", advanceToNextLevel);
restartBtn.addEventListener("click", resetGameEntirely);

helpBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cheatsheetModal.addEventListener("click", (e) => {
  if (e.target === cheatsheetModal) closeModal();
});

loadSavedState();
startTimer();
navigateToStage(0);
