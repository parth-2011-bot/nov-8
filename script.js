/* =========================================================
   WEBSITE 08 — CRAYON SHIN-CHAN: THE BIRTHDAY MISSION
   Edit the SITE_CONTENT object below to personalise the site.
   Countdown and interaction logic are kept separate.
   ========================================================= */

const SITE_CONTENT = {
  title: "Crayon Shin-chan: The Birthday Mission",
  intro: {
    heading: "WELCOME TO KASUKABE!",
    subtitle: "A completely normal day in a completely normal neighbourhood (you can tap shinchan and shiro btw).",
    dialogue: "HEY HEY HEYYYY!! WHO LET YOU IN HERE?!",
    shiroDialogue: "Shiro: ...woof.",
    shinchanLines: [
      "WHAT ARE YOU LOOKING AT?!",
      "I WAS DOING SOMETHING IMPORTANT.",
      "SHHH. THIS IS A SECRET MISSION.",
      "I HAVE ABSOLUTELY NO IDEA WHAT'S GOING ON."
    ],
    shiroLines: [
      "Shiro has inspected the area. He requests snacks.",
      "Shiro says this mission smells suspicious.",
      "Shiro: woof. Translation: proceed carefully."
    ],
    startButton: "START THE MISSION!!"
  },
  countdown: {
    heading: "OPERATION: BIRTHDAY PARTY CHAIYE",
    subtitle: "TIME LEFT UNTIL YOUR BIRTHDAY",
    dialogue: "THE COUNTDOWN IS UNDER CONTROL. PROBABLY.",
    calendarMessage: "CALENDAR STATUS: NOVEMBER 20 HAS BEEN CIRCLED 47 TIMES. IT IS FINE.",
    shiroMessage: "Shiro has been assigned countdown supervision tho He fell asleep.",
    secretBoxLabel: "SUSPICIOUS BOX"
  },
  mission: {
    heading: "TOP-SECRET MISSION FILE",
    subtitle: "KASUKABE DEFENCE FORCE — SPECIAL ASSIGNMENT",
    subject: "BAUNII",
    status: "EXTREMELY IMPORTANT (APPARENTLY)",
    objective: "UNCLASSIFIED",
    authorisation: "CLASSIFIED FOR NO REASON",
    dialogue: "THIS FILE IS VERY IMPORTANT. I CAN TELL BECAUSE IT HAS A STAMP.",
    personalMessage: "Well so ykk today i realised doing art with code is hard , ANYWAYS your mission is to HAVE FUN.",
    openButton: "OPEN THE MISSION FILE",
    closeButton: "CLOSE THE FILE"
  },
  secrets: {
    everyday: "Congratulations. You have discovered a highly classified box. Its contents are: absolutely no useful information, and the knowledge that you are now an official Kasukabe investigator.",
    birthday: "YOOO WELL ITS YOUR BIRTHDAYYYYYYY , OMG HAPPY BIRTHDAY TO YOU, HAVE FUN , ENJOY YOUR DAY , WHY ARE YOU HERE?"
  },
  birthday: {
    heading: "YOUR BIRTHDAY HAS OFFICIALLY ARRIVED!!",
    lineOne: "THE KASUKABE DEFENCE FORCE HAS DECLARED TODAY A VERY IMPORTANT DAY.",
    lineTwo: "ALL NORMAL ACTIVITIES ARE SUSPENDED UNTIL FURTHER NOTICE.",
    lineThree: "CELEBRATION STATUS: MAXIMUM CHAOS.",
    giftButton: "🎁 OPEN THE SECRET BIRTHDAY MSG"
  },
  interactions: {
    secretTitle: "A SECRET?!",
    birthdaySecretTitle: "A SPECIAL DELIVERY!",
    comicWords: ["POW!", "HEY!", "WHOOP!", "GASP!", "TA-DA!"]
  }
};

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const screens = ["welcome", "countdown", "mission"];
let activeScreen = "welcome";
let birthdayMode = false;
let timerInterval = null;
let audioEnabled = false;

const $ = (id) => document.getElementById(id);

function setText(id, value) {
  const el = $(id);
  if (el && typeof value === "string") el.textContent = value;
}

function configureContent() {
  document.title = SITE_CONTENT.title;
  setText("welcome-heading", SITE_CONTENT.intro.heading);
  setText("intro-subtitle", SITE_CONTENT.intro.subtitle);
  setText("intro-bubble", SITE_CONTENT.intro.dialogue);
  setText("shiro-line", SITE_CONTENT.intro.shiroDialogue);
  setText("start-button", SITE_CONTENT.intro.startButton + " →");
  setText("countdown-heading", SITE_CONTENT.countdown.heading);
  setText("countdown-subtitle", SITE_CONTENT.countdown.subtitle);
  setText("countdown-bubble", SITE_CONTENT.countdown.dialogue);
  setText("mission-heading", SITE_CONTENT.mission.heading);
  setText("mission-subtitle", SITE_CONTENT.mission.subtitle);
  setText("mission-subject", SITE_CONTENT.mission.subject);
  setText("mission-status", SITE_CONTENT.mission.status);
  setText("mission-objective", SITE_CONTENT.mission.objective);
  setText("mission-authorisation", SITE_CONTENT.mission.authorisation);
  setText("mission-bubble", SITE_CONTENT.mission.dialogue);
  setText("personal-message", SITE_CONTENT.mission.personalMessage);
  setText("everyday-secret-message", SITE_CONTENT.secrets.everyday);
  setText("birthday-secret-message", SITE_CONTENT.secrets.birthday);
  setText("everyday-secret-title", SITE_CONTENT.interactions.secretTitle);
  setText("birthday-secret-title", SITE_CONTENT.interactions.birthdaySecretTitle);
  setText("birthday-heading", SITE_CONTENT.birthday.heading);
  setText("birthday-line-one", SITE_CONTENT.birthday.lineOne);
  setText("birthday-line-two", SITE_CONTENT.birthday.lineTwo);
  setText("birthday-line-three", SITE_CONTENT.birthday.lineThree);
  setText("birthday-secret-trigger", SITE_CONTENT.birthday.giftButton);
  setText("open-file-button", SITE_CONTENT.mission.openButton + " →");
  setText("close-file-button", SITE_CONTENT.mission.closeButton);
  $("everyday-secret-trigger").querySelector("small").textContent = SITE_CONTENT.countdown.secretBoxLabel;
}

/* IST helpers: shift the instant by UTC+05:30, then read UTC fields. */
function getISTParts(date = new Date()) {
  const shifted = new Date(date.getTime() + IST_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds()
  };
}

function getISTMidnightUtc(year, monthIndex, day) {
  return Date.UTC(year, monthIndex, day, 0, 0, 0, 0) - IST_OFFSET_MS;
}

function getBirthdayState(now = new Date()) {
  const p = getISTParts(now);
  const birthdayStart = getISTMidnightUtc(p.year, 10, 20);
  const birthdayEnd = birthdayStart + 24 * 60 * 60 * 1000;
  const nowMs = now.getTime();
  const active = nowMs >= birthdayStart && nowMs < birthdayEnd;
  const target = nowMs < birthdayStart ? birthdayStart : getISTMidnightUtc(p.year + 1, 10, 20);
  return { active, target, parts: p };
}

function updateClock() {
  const now = new Date();
  const state = getBirthdayState(now);
  const nextMode = state.active;
  if (nextMode !== birthdayMode) {
    birthdayMode = nextMode;
    applyBirthdayMode();
  }

  const p = state.parts;
  setText("ist-date", `IST ${String(p.day).padStart(2,"0")}/${String(p.month).padStart(2,"0")}/${p.year}`);

  if (!birthdayMode) {
    const remaining = Math.max(0, state.target - now.getTime());
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    setText("days", String(days).padStart(3, "0"));
    setText("hours", String(hours).padStart(2, "0"));
    setText("minutes", String(minutes).padStart(2, "0"));
    setText("seconds", String(seconds).padStart(2, "0"));
  }
}

function applyBirthdayMode() {
  $("birthday-banner").hidden = !birthdayMode;
  $("countdown-layout").hidden = birthdayMode;
  $("countdown-bubble").hidden = birthdayMode;
  $("everyday-secret-trigger").hidden = birthdayMode;
  $("everyday-secret").hidden = true;
  $("birthday-secret").hidden = true;
  document.body.classList.toggle("birthday-active", birthdayMode);

  if (birthdayMode) {
    const happy = "assets/images/shinchan_happy.png";
    const main = "assets/images/shinchan.png";
    const img = $("shinchan-countdown");
    img.src = happy;
    img.dataset.fallback = main;
  } else {
    $("shinchan-countdown").src = "assets/images/shinchan_idle.png";
  }
}

function showScreen(name) {
  if (!screens.includes(name)) return;
  activeScreen = name;
  screens.forEach((screen) => {
    const section = $(`screen-${screen}`);
    const isActive = screen === name;
    section.classList.toggle("active", isActive);
    section.hidden = !isActive;
  });
  document.querySelectorAll(".nav-button").forEach((button) => {
    const isActive = button.dataset.screen === name;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });
  if (name === "countdown") updateClock();
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function comicReaction(message) {
  const pop = $("comic-pop");
  pop.textContent = message || randomItem(SITE_CONTENT.interactions.comicWords);
  pop.classList.add("show");
  window.setTimeout(() => pop.classList.remove("show"), 1150);
}

function reactToShinchan() {
  const img = $("shinchan-welcome");
  if (img.dataset.happy) img.src = img.dataset.happy;
  window.setTimeout(() => { img.src = "assets/images/shinchan_idle.png"; }, 1400);
  const line = randomItem(SITE_CONTENT.intro.shinchanLines);
  $("intro-bubble").textContent = line;
  comicReaction(randomItem(SITE_CONTENT.interactions.comicWords));
  img.classList.remove("reacting");
  void img.offsetWidth;
  img.classList.add("reacting");
}

function reactToShiro() {
  const img = $("shiro-welcome");
  setText("shiro-line", randomItem(SITE_CONTENT.intro.shiroLines));
  comicReaction("WOOF!");
  if (img.dataset.happy) img.src = img.dataset.happy;
  img.classList.add("reacting");
  window.setTimeout(() => { img.classList.remove("reacting"); img.src = "assets/images/shiro.png"; }, 1100);
}

function openSecret(id) {
  $(id).hidden = false;
  if (id === "everyday-secret") comicReaction("YOU FOUND IT!");
  if (id === "birthday-secret") comicReaction("HAPPY BIRTHDAY!");
}

function closeSecret(id) {
  $(id).hidden = true;
}

function wireCharacterImage(imgId, placeholderId, fallbackPath = null) {
  const img = $(imgId);
  const placeholder = $(placeholderId);
  if (!img || !placeholder) return;
  let attemptedFallback = false;
  img.addEventListener("load", () => {
    img.style.display = "block";
    placeholder.style.display = "none";
  });
  img.addEventListener("error", () => {
    if (!attemptedFallback && (img.dataset.fallback || fallbackPath)) {
      attemptedFallback = true;
      img.src = img.dataset.fallback || fallbackPath;
      return;
    }
    img.style.display = "none";
    placeholder.style.display = placeholder.classList.contains("character-placeholder") ? "flex" : "grid";
  });
  if (img.complete && img.naturalWidth > 0) {
    img.style.display = "block";
    placeholder.style.display = "none";
  }
}

function initAssets() {
  wireCharacterImage("shinchan-welcome", "shinchan-placeholder");
  wireCharacterImage("shinchan-countdown", "shinchan-countdown-placeholder", "assets/images/shinchan.png");
  wireCharacterImage("shinchan-mission", "shinchan-mission-placeholder", "assets/images/shinchan.png");
  wireCharacterImage("shiro-welcome", "shiro-placeholder");
  wireCharacterImage("shiro-countdown", "shiro-countdown-placeholder");
  wireCharacterImage("shiro-mission", "shiro-mission-placeholder");

  const neighbourhood = new Image();
  neighbourhood.onload = () => {
    $("screen-welcome").querySelector(".neighbourhood-scene").style.backgroundImage =
      `linear-gradient(#78cff044 0 56%, #a9df7944 56% 73%, #71b95755 73%), url("assets/images/kasukabe_background.png")`;
    $("screen-welcome").querySelector(".neighbourhood-scene").style.backgroundSize = "cover";
    $("screen-welcome").querySelector(".neighbourhood-scene").style.backgroundPosition = "center";
  };
  neighbourhood.src = "assets/images/kasukabe_background.png";

  const house = $("nohara-house");
  house.addEventListener("load", () => { house.style.display = "block"; });
  house.addEventListener("error", () => { house.style.display = "none"; });
}

function initAudio() {
  const audio = $("ambience-audio");
  const button = $("sound-toggle");
  button.addEventListener("click", async () => {
    if (!audioEnabled) {
      try {
        await audio.play();
        audioEnabled = true;
        button.textContent = "♪ SOUND: ON";
        button.setAttribute("aria-pressed", "true");
      } catch (error) {
        button.textContent = "♪ AUDIO NOT FOUND";
      }
    } else {
      audio.pause();
      audioEnabled = false;
      button.textContent = "♪ SOUND: OFF";
      button.setAttribute("aria-pressed", "false");
    }
  });
  audio.addEventListener("error", () => {
    if (audioEnabled) {
      audioEnabled = false;
      button.textContent = "♪ AUDIO NOT FOUND";
      button.setAttribute("aria-pressed", "false");
    }
  });
}

function initNavigation() {
  document.querySelectorAll("[data-screen]").forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      showScreen(control.dataset.screen);
    });
  });
  $("start-button").addEventListener("click", () => showScreen("countdown"));
}

function initInteractions() {
  $("shinchan-click").addEventListener("click", reactToShinchan);
  $("shiro-click").addEventListener("click", reactToShiro);
  $("calendar-click").addEventListener("click", () => {
    setText("countdown-bubble", SITE_CONTENT.countdown.calendarMessage);
    comicReaction("TICK-TOCK!");
  });
  $("everyday-secret-trigger").addEventListener("click", () => {
    if (!birthdayMode) openSecret("everyday-secret");
  });
  $("birthday-secret-trigger").addEventListener("click", () => {
    if (birthdayMode) openSecret("birthday-secret");
  });
  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => closeSecret(button.dataset.close));
  });
  $("open-file-button").addEventListener("click", () => {
    $("personal-note").hidden = false;
    comicReaction("FILE OPENED!");
    $("personal-note").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  $("close-file-button").addEventListener("click", () => {
    $("personal-note").hidden = true;
  });
  $("shiro-click").addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") reactToShiro();
  });
}

function init() {
  configureContent();
  initAssets();
  initAudio();
  initNavigation();
  initInteractions();
  updateClock();
  timerInterval = window.setInterval(updateClock, 1000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateClock();
  });
}

document.addEventListener("DOMContentLoaded", init);
