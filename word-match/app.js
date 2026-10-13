const ROUNDS = [
  [
    { id: "keyboard", word: "keyboard", definition: "a device that enters information into a computer" },
    { id: "mouse", word: "mouse", definition: "a device that is used to control a pointer or cursor" },
    { id: "scanner", word: "scanner", definition: "a device that reads images and sends them to a computer" },
    { id: "microphone", word: "microphone", definition: "a device that gathers sounds" },
    { id: "monitor", word: "monitor", definition: "a device that displays images" },
  ],
  [
    { id: "motherboard", word: "motherboard", definition: "the main circuit board that connects all the parts of a computer" },
    { id: "cpu", word: "CPU", definition: "the brain of the computer that carries out instructions and calculations" },
    { id: "ram", word: "RAM", definition: "temporary memory that holds the data the computer is using right now" },
    { id: "hdd", word: "hard disk drive", definition: "a device inside the computer that stores files permanently on spinning disks" },
    { id: "psu", word: "power supply", definition: "a unit that converts electricity from the wall into power the computer can use" },
  ],
  [
    { id: "gpu", word: "graphics card", definition: "a board that processes images and sends them to the monitor" },
    { id: "soundcard", word: "sound card", definition: "a board that lets the computer play and record audio" },
    { id: "nic", word: "network card", definition: "a board that connects the computer to a network" },
    { id: "fan", word: "cooling fan", definition: "a part that blows air to stop the computer from overheating" },
    { id: "heatsink", word: "heat sink", definition: "a metal part that draws heat away from the processor" },
  ],
  [
    { id: "ssd", word: "SSD", definition: "a fast storage drive with no moving parts" },
    { id: "optical", word: "optical drive", definition: "a drive that reads and writes CDs and DVDs" },
    { id: "cmos", word: "CMOS battery", definition: "a small battery that keeps the clock and settings when the computer is off" },
    { id: "slot", word: "expansion slot", definition: "a socket on the motherboard where extra cards are added" },
    { id: "case", word: "computer case", definition: "the metal or plastic box that holds and protects the internal parts" },
  ],
  [
    { id: "webcam", word: "webcam", definition: "a small camera that sends live video to a computer" },
    { id: "joystick", word: "joystick", definition: "a lever that is used to control movement in games" },
    { id: "touchscreen", word: "touchscreen", definition: "a screen that reacts when you touch it with a finger" },
    { id: "barcode", word: "barcode reader", definition: "a device that reads the striped labels on products" },
    { id: "tablet", word: "graphics tablet", definition: "a flat pad that lets you draw with a special pen" },
  ],
  [
    { id: "printer", word: "printer", definition: "a device that puts text and pictures on paper" },
    { id: "speakers", word: "speakers", definition: "devices that play sound out loud" },
    { id: "headphones", word: "headphones", definition: "a pair of small speakers worn over the ears for private listening" },
    { id: "projector", word: "projector", definition: "a device that shows the computer screen on a big wall or screen" },
    { id: "plotter", word: "plotter", definition: "a machine that draws large plans and maps with pens" },
  ],
  [
    { id: "flash", word: "flash drive", definition: "a small portable stick that stores files and plugs into a USB port" },
    { id: "exthdd", word: "external hard drive", definition: "a larger portable drive used for backups and big files" },
    { id: "memcard", word: "memory card", definition: "a tiny card used to store photos in cameras and phones" },
    { id: "modem", word: "modem", definition: "a device that connects your network to the internet provider" },
    { id: "router", word: "router", definition: "a device that shares one internet connection with many devices" },
  ],
  [
    { id: "usb", word: "USB port", definition: "a socket used to plug in devices such as mice and flash drives" },
    { id: "hdmi", word: "HDMI cable", definition: "a cable that carries both video and sound to a screen" },
    { id: "ethernet", word: "Ethernet cable", definition: "a cable that connects a computer to a wired network" },
    { id: "bluetooth", word: "Bluetooth", definition: "a wireless technology that connects devices over short distances" },
    { id: "surge", word: "surge protector", definition: "a power strip that protects equipment from sudden spikes in electricity" },
  ],
  [
    { id: "touchpad", word: "touchpad", definition: "a flat surface on a laptop that moves the cursor when you slide a finger" },
    { id: "stylus", word: "stylus", definition: "a pen-shaped tool used to write or tap on a touchscreen" },
    { id: "gamepad", word: "game controller", definition: "a handheld device with buttons and sticks for playing games" },
    { id: "cardreader", word: "card reader", definition: "a device that reads the data on memory cards" },
    { id: "ups", word: "UPS", definition: "a battery backup that keeps the computer running during a power cut" },
  ],
];

const wordsEl = document.getElementById("words");
const defsEl = document.getElementById("defs");
const feedbackEl = document.getElementById("feedback");
const roundEl = document.getElementById("round");
const matchedEl = document.getElementById("matched");
const accuracyEl = document.getElementById("accuracy");
const winEl = document.getElementById("win");
const winEyebrow = document.getElementById("win-eyebrow");
const winTitle = document.getElementById("win-title");
const winCopy = document.getElementById("win-copy");
const nextBtn = document.getElementById("next");
const againBtn = document.getElementById("again");

let roundIndex = 0;
let pairs = [];
let matched = 0;
let attempts = 0;
let hits = 0;
let drag = null;
let selected = null;

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function setFeedback(text, kind) {
  feedbackEl.textContent = text;
  feedbackEl.className = `feedback ${kind || ""}`;
}

function updateHud() {
  roundEl.textContent = `${roundIndex + 1} / ${ROUNDS.length}`;
  matchedEl.textContent = `${matched} / ${pairs.length}`;
  const pct = attempts === 0 ? 100 : Math.round((hits / attempts) * 100);
  accuracyEl.textContent = `${pct}%`;
}

function render() {
  pairs = ROUNDS[roundIndex].map((item) => ({ ...item }));
  matched = 0;
  wordsEl.innerHTML = "";
  defsEl.innerHTML = "";
  setFeedback("");
  winEl.classList.add("hidden");
  winEl.setAttribute("aria-hidden", "true");

  selected = null;

  shuffle(pairs).forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "word";
    btn.draggable = true;
    btn.dataset.id = item.id;
    btn.textContent = item.word;
    btn.addEventListener("pointerdown", onPointerDown);
    btn.addEventListener("click", onWordClick);
    btn.addEventListener("dragstart", onDragStart);
    btn.addEventListener("dragend", onDragEnd);
    wordsEl.appendChild(btn);
  });

  shuffle(pairs).forEach((item) => {
    const card = document.createElement("article");
    card.className = "def";
    card.dataset.id = item.id;
    card.innerHTML = `<div class="slot"><span class="hint">Drop a word here</span></div><p>${item.definition}</p>`;
    card.addEventListener("click", onDefClick);
    card.addEventListener("dragover", onDragOver);
    card.addEventListener("dragleave", onDragLeave);
    card.addEventListener("drop", onDrop);
    defsEl.appendChild(card);
  });

  updateHud();
}

function cardFromPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  return el?.closest(".def") || null;
}

function onPointerDown(event) {
  const word = event.currentTarget;
  if (event.pointerType === "mouse") return;
  if (word.classList.contains("placed") || drag) return;

  word.setPointerCapture(event.pointerId);
  const rect = word.getBoundingClientRect();
  const ghost = word.cloneNode(true);
  ghost.classList.add("ghost");
  ghost.style.width = `${rect.width}px`;
  ghost.style.left = `${rect.left}px`;
  ghost.style.top = `${rect.top}px`;
  document.body.appendChild(ghost);
  word.classList.add("dragging");

  drag = {
    word,
    ghost,
    origin: { x: rect.left, y: rect.top },
    offset: { x: event.clientX - rect.left, y: event.clientY - rect.top },
    startX: event.clientX,
    startY: event.clientY,
    over: null,
  };

  word.addEventListener("pointermove", onPointerMove);
  word.addEventListener("pointerup", onPointerUp);
  word.addEventListener("pointercancel", onPointerUp);
}

function onPointerMove(event) {
  if (!drag) return;
  const x = event.clientX - drag.offset.x;
  const y = event.clientY - drag.offset.y;
  drag.ghost.style.left = `${x}px`;
  drag.ghost.style.top = `${y}px`;

  drag.ghost.style.visibility = "hidden";
  const over = cardFromPoint(event.clientX, event.clientY);
  drag.ghost.style.visibility = "visible";

  if (drag.over && drag.over !== over) drag.over.classList.remove("over");
  if (over && !over.classList.contains("correct")) over.classList.add("over");
  drag.over = over && !over.classList.contains("correct") ? over : null;
}

function onPointerUp(event) {
  if (!drag) return;
  const { word, ghost, origin } = drag;
  word.removeEventListener("pointermove", onPointerMove);
  word.removeEventListener("pointerup", onPointerUp);
  word.removeEventListener("pointercancel", onPointerUp);

  ghost.style.visibility = "hidden";
  const drop = cardFromPoint(event.clientX, event.clientY);
  ghost.style.visibility = "visible";
  if (drag.over) drag.over.classList.remove("over");

  const moved = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
  drag = null;

  if (moved < 8) {
    flyHome(ghost, origin, () => {
      ghost.remove();
      word.classList.remove("dragging");
    });
    selectWord(word);
    return;
  }

  if (!drop || drop.classList.contains("correct")) {
    flyHome(ghost, origin, () => {
      ghost.remove();
      word.classList.remove("dragging");
    });
    return;
  }

  resolveMatch(word, drop, { ghost, origin });
}

function selectWord(word) {
  if (word.classList.contains("placed")) return;
  document.querySelectorAll(".word.selected").forEach((el) => el.classList.remove("selected"));
  selected = word;
  word.classList.add("selected");
}

function onWordClick(event) {
  event.stopPropagation();
  const word = event.currentTarget;
  if (word.classList.contains("placed")) return;
  selectWord(word);
}

function onDefClick(event) {
  const drop = event.currentTarget;
  if (!selected || drop.classList.contains("correct")) return;
  const word = selected;
  selected = null;
  word.classList.remove("selected");
  resolveMatch(word, drop);
}

function onDragStart(event) {
  const word = event.currentTarget;
  if (word.classList.contains("placed")) {
    event.preventDefault();
    return;
  }
  selected = word;
  word.classList.add("dragging");
  event.dataTransfer.setData("text/plain", word.dataset.id);
  event.dataTransfer.effectAllowed = "move";
}

function onDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
  document.querySelectorAll(".def.over").forEach((card) => card.classList.remove("over"));
}

function onDragOver(event) {
  const drop = event.currentTarget;
  if (drop.classList.contains("correct")) return;
  event.preventDefault();
  drop.classList.add("over");
}

function onDragLeave(event) {
  event.currentTarget.classList.remove("over");
}

function onDrop(event) {
  event.preventDefault();
  const drop = event.currentTarget;
  drop.classList.remove("over");
  const id = event.dataTransfer.getData("text/plain");
  const word = wordsEl.querySelector(`.word[data-id="${id}"]:not(.placed)`);
  if (!word) return;
  selected = null;
  word.classList.remove("selected", "dragging");
  resolveMatch(word, drop);
}

function resolveMatch(word, drop, flying) {
  attempts += 1;
  const correct = drop.dataset.id === word.dataset.id;

  if (correct) {
    hits += 1;
    matched += 1;
    if (flying) {
      flying.ghost.remove();
      word.classList.remove("dragging");
    }
    word.classList.remove("selected");
    placeWord(word, drop);
    setFeedback("Correct", "ok");
    updateHud();
    if (matched === pairs.length) finishRound();
    return;
  }

  drop.classList.add("incorrect");
  const badge = document.createElement("span");
  badge.className = "badge no";
  badge.textContent = "Incorrect";
  drop.appendChild(badge);
  setFeedback("Incorrect", "no");
  updateHud();

  window.setTimeout(() => {
    drop.classList.remove("incorrect");
    badge.remove();
  }, 650);

  if (flying) {
    flyHome(flying.ghost, flying.origin, () => {
      flying.ghost.remove();
      word.classList.remove("dragging");
    });
    return;
  }

  bounceHome(word);
}

function bounceHome(word) {
  word.classList.add("bounce");
  window.setTimeout(() => word.classList.remove("bounce"), 420);
}

function placeWord(word, drop) {
  const hint = drop.querySelector(".hint");
  if (hint) hint.remove();
  word.classList.add("placed");
  drop.classList.add("correct");
  drop.querySelector(".slot").appendChild(word);
  const badge = document.createElement("span");
  badge.className = "badge ok";
  badge.textContent = "Correct";
  drop.appendChild(badge);
}

function flyHome(ghost, origin, done) {
  ghost.classList.add("returning");
  ghost.style.left = `${origin.x}px`;
  ghost.style.top = `${origin.y}px`;
  ghost.style.transform = "scale(1) rotate(0deg)";
  window.setTimeout(done, 420);
}

function finishRound() {
  const last = roundIndex === ROUNDS.length - 1;
  const pct = Math.round((hits / attempts) * 100);
  winEyebrow.textContent = last ? "All rounds complete" : "Round complete";
  winTitle.textContent = last ? "You finished the set." : "Every pair is matched.";
  winCopy.textContent = `Accuracy this session: ${pct}%. ${
    last ? "Play again to reshuffle the words." : "Keep going — the next list is ready."
  }`;
  nextBtn.hidden = last;
  againBtn.textContent = last ? "Play again" : "Replay this round";
  winEl.classList.remove("hidden");
  winEl.setAttribute("aria-hidden", "false");
}

document.getElementById("shuffle").addEventListener("click", () => {
  if (matched === pairs.length) return;
  shuffle([...wordsEl.querySelectorAll(".word:not(.placed)")]).forEach((el) => wordsEl.appendChild(el));
  shuffle([...defsEl.children].filter((card) => !card.classList.contains("correct"))).forEach((card) => {
    defsEl.appendChild(card);
  });
});

document.getElementById("restart").addEventListener("click", () => {
  attempts = 0;
  hits = 0;
  render();
});

nextBtn.addEventListener("click", () => {
  if (roundIndex < ROUNDS.length - 1) roundIndex += 1;
  render();
});

againBtn.addEventListener("click", () => {
  if (roundIndex === ROUNDS.length - 1) {
    roundIndex = 0;
    attempts = 0;
    hits = 0;
  }
  render();
});

render();
