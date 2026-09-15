const levels = [
  {
    title: "Mirror the Rail",
    instruction: "Reverse the row so the clothes appear from right to left.",
    tip: "Only flex-direction is needed in this stage.",
    items: [["👕", "Shirt", ""], ["👖", "Jeans", "tall"], ["🧥", "Jacket", ""], ["👗", "Dress", "tall"]],
    active: ["flexDirection"],
    solution: { flexDirection: "row-reverse", justifyContent: "flex-start", alignItems: "stretch", flexWrap: "nowrap" }
  },
  {
    title: "Right Side, Please",
    instruction: "Keep the clothes in a row and move the whole group to the right side of the closet.",
    tip: "Think about how justify-content moves items along the main axis.",
    items: [["👚", "Top", ""], ["👖", "Pants", "tall"], ["🧣", "Scarf", "short"], ["👜", "Bag", ""]],
    active: ["justifyContent"],
    solution: { flexDirection: "row", justifyContent: "flex-end", alignItems: "stretch", flexWrap: "nowrap" }
  },
  {
    title: "Center the Hangers",
    instruction: "Arrange the clothes from top to bottom and center them horizontally inside the closet.",
    tip: "This stage needs a combination of flex-direction and align-items.",
    items: [["👕", "Tee", ""], ["🧥", "Coat", ""], ["👗", "Dress", ""]],
    active: ["flexDirection", "alignItems"],
    solution: { flexDirection: "column", justifyContent: "flex-start", alignItems: "center", flexWrap: "nowrap" }
  },
  {
    title: "Bottom Shelf",
    instruction: "Keep the clothes in a row, place equal space between them, and move them to the bottom of the closet.",
    tip: "Use justify-content for spacing and align-items for vertical position.",
    items: [["👟", "Shoes", "short"], ["👜", "Bag", ""], ["🧢", "Cap", "short"], ["👠", "Heels", ""]],
    active: ["justifyContent", "alignItems"],
    solution: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "nowrap" }
  },
  {
    title: "Reverse Stack",
    instruction: "Stack the clothes from bottom to top, center the stack vertically, and place it on the right side of the closet.",
    tip: "Three Flexbox properties work together here.",
    items: [["🧥", "Coat", ""], ["👕", "Shirt", ""], ["👖", "Jeans", ""]],
    active: ["flexDirection", "justifyContent", "alignItems"],
    solution: { flexDirection: "column-reverse", justifyContent: "center", alignItems: "flex-end", flexWrap: "nowrap" }
  },
  {
    title: "Closet Overflow!",
    instruction: "There are too many items for one row. Wrap them onto multiple rows, add space around the items, and center items within each row.",
    tip: "This stage introduces flex-wrap and combines it with two more Flexbox properties.",
    items: [
      ["👕", "Tee", ""], ["👖", "Jeans", "tall"], ["🧥", "Coat", ""],
      ["👗", "Dress", "tall"], ["🧢", "Cap", "short"], ["👟", "Shoes", ""],
      ["👜", "Bag", "short"], ["🧣", "Scarf", "tall"], ["👚", "Top", ""]
    ],
    active: ["flexWrap", "justifyContent", "alignItems"],
    solution: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap" }
  }
];

const board = document.getElementById("game-board");
const stageTitle = document.getElementById("stage-title");
const stageInstruction = document.getElementById("stage-instruction");
const stageTip = document.getElementById("stage-tip");
const stageLabel = document.getElementById("stage-label");
const attemptsLabel = document.getElementById("attempts-label");
const feedback = document.getElementById("feedback");
const stageDots = document.getElementById("stage-dots");

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

function loadSavedProgress() {
  const savedData = localStorage.getItem("closet_flex_progress");
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      completedLevels = new Set(parsed.completed || []);
      totalAttempts = parsed.totalAttempts || 0;
    } catch (e) {
      console.warn("Could not read saved progress", e);
    }
  }
}

function saveCurrentProgress() {
  localStorage.setItem("closet_flex_progress", JSON.stringify({
    completed: Array.from(completedLevels),
    totalAttempts: totalAttempts
  }));
}

function renderItems(items) {
  board.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    const [emoji, name, sizeClass] = items[i];
    const item = document.createElement("div");
    item.className = ("clothing-item " + sizeClass).trim();

    const icon = document.createElement("span");
    icon.className = "emoji";
    icon.textContent = emoji;

    const label = document.createElement("span");
    label.className = "item-name";
    label.textContent = name;

    item.appendChild(icon);
    item.appendChild(label);
    board.appendChild(item);
  }
}

function setControlState(level) {
  for (const [key, select] of Object.entries(controls)) {
    const isActive = level.active.includes(key);
    select.disabled = !isActive;
    notes[key].textContent = isActive ? "Select target value" : "Not needed in this stage";
  }
}

function applyValues() {
  board.style.flexDirection = directionSelect.value;
  board.style.justifyContent = justifySelect.value;
  board.style.alignItems = alignSelect.value;
  board.style.flexWrap = wrapSelect.value;
}

function updateProgress() {
  stageLabel.textContent = `Stage ${currentLevel + 1} of ${levels.length}`;
  attemptsLabel.textContent = `Attempts: ${currentAttempts}`;
  stageDots.innerHTML = "";

  for (let index = 0; index < levels.length; index++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "stage-dot";
    dot.textContent = index + 1;

    if (index === currentLevel) {
      dot.classList.add("current");
    }

    if (completedLevels.has(index)) {
      dot.classList.add("completed", "available");
      dot.addEventListener("click", function() {
        loadLevel(index);
      });
    } else if (index < currentLevel) {
      dot.classList.add("available");
      dot.addEventListener("click", function() {
        loadLevel(index);
      });
    } else {
      dot.disabled = index !== currentLevel;
    }

    stageDots.appendChild(dot);
  }
}

function resetStage() {
  const level = levels[currentLevel];
  currentAttempts = 0;

  directionSelect.value = "row";
  justifySelect.value = "flex-start";
  alignSelect.value = "stretch";
  wrapSelect.value = "nowrap";

  setControlState(level);
  applyValues();

  feedback.className = "feedback";
  feedback.textContent = "";
  nextBtn.classList.add("hidden");
  updateProgress();
}

function loadLevel(index) {
  currentLevel = index;
  currentAttempts = 0;
  const level = levels[currentLevel];

  stageTitle.textContent = level.title;
  stageInstruction.textContent = level.instruction;
  stageTip.textContent = level.tip;

  renderItems(level.items);
  resetStage();
}

function isCorrect() {
  const s = levels[currentLevel].solution;
  return (
    directionSelect.value === s.flexDirection &&
    justifySelect.value === s.justifyContent &&
    alignSelect.value === s.alignItems &&
    wrapSelect.value === s.flexWrap
  );
}

function checkAnswer() {
  currentAttempts++;
  totalAttempts++;
  updateProgress();

  if (isCorrect()) {
    completedLevels.add(currentLevel);
    saveCurrentProgress();
    feedback.className = "feedback success";
    feedback.textContent = "Great job! The closet is organized properly.";
    updateProgress();

    nextBtn.textContent = currentLevel === levels.length - 1 ? "Finish Game →" : "Next Stage →";
    nextBtn.classList.remove("hidden");
  } else {
    feedback.className = "feedback error";
    feedback.textContent = "Not quite right. Take another look at the hint.";
    nextBtn.classList.add("hidden");
  }
}

function nextStage() {
  if (!completedLevels.has(currentLevel)) return;

  if (currentLevel === levels.length - 1) {
    app.classList.add("hidden");
    completionScreen.classList.remove("hidden");
    finalAttempts.textContent = `Total answer checks: ${totalAttempts}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    loadLevel(currentLevel + 1);
  }
}

function restartGame() {
  currentLevel = 0;
  currentAttempts = 0;
  totalAttempts = 0;
  completedLevels.clear();
  localStorage.removeItem("closet_flex_progress");

  completionScreen.classList.add("hidden");
  app.classList.remove("hidden");
  loadLevel(0);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

for (const select of Object.values(controls)) {
  select.addEventListener("change", applyValues);
}

checkBtn.addEventListener("click", checkAnswer);
resetBtn.addEventListener("click", resetStage);
nextBtn.addEventListener("click", nextStage);
restartBtn.addEventListener("click", restartGame);
loadSavedProgress();
loadLevel(0);
