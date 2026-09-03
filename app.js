import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, get, onValue, ref, runTransaction, set } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const dateTasks = [
  "Water park walk in the dust",
  "Indroda fort",
  "E-bike and bike lessons",
  "Goa + chicken vindaloo + return roses",
  "Rate every food place near Reliance Circle like a professional food critic on Google Maps",
  "Walking, sitting, dancing in the rain",
  "Look at each other’s balcony",
  "Try to improve eyesight by looking at each other’s office desk EVERYDAY",
  "Suffer together",
  "Pond place near office",
  "Meow together",
  "Have good biryani in Gurgaon and !Gurgaon",
  "Tirameowsu and dark chocolate cake",
  "All black on a broom, burgundy nails, ready to do some ritual on you and then boom—sacrificing your blood on the altar",
  "Sing capybara song and be awkward together",
  "Pillow monster pillow fight (but be careful of the nails)",
  "Distracting you while playing Counter-Strike 😈"
].map((text, index) => ({ text, done: index === 9 }));

const bikeRideTasks = [
  ["Thol Sanctuary", 1],
  ["Roda Temples, Himmatnagar", 1.5],
  ["Zanzari Waterfall", 1.5],
  ["Sun Temple", 2],
  ["Idar Fort, Himmatnagar", 2],
  ["Nalsarovar Sanctuary", 2],
  ["Rani ki Vav", 2.5],
  ["Polo Forest", 2.5],
  ["Dasada", 2.5],
  ["Taranga Hill", 2.5],
  ["Ambaji", 3],
  ["Udaipur", 4],
  ["Statue of Unity", 5],
  ["Kumbhalgarh", 6],
  ["Road to Heaven", 7]
].map(([location, durationHours]) => ({
  location,
  durationHours,
  text: `${durationHours} ${durationHours === 1 ? "hr" : "hrs"} — ${location}`,
  done: false
}));

const rideSections = [
  { label: "0–2 hrs", min: 0, max: 2, includeMin: true },
  { label: "2–4 hrs", min: 2, max: 4 },
  { label: "4–8 hrs", min: 4, max: 8 },
  { label: "8+ hrs", min: 8, max: Infinity }
];

const listConfigs = {
  dates: {
    routePart: "dates",
    dbKey: "date-night",
    documentTitle: "Date Things We Shall Do ✦",
    description: "A shared little list of adventures, food, rain, and wonderfully odd plans.",
    eyebrow: "the very important date list",
    titleHtml: "Things we<br /><em>shall do</em>",
    subtitle: "Tiny adventures, strange plans, and everything in between.",
    loginCopy: "Sign in to open the date list.",
    emptyState: "New chapter? Add the first plan below ✦",
    addPlaceholder: "Add another little plan…",
    progressNoun: "little plans",
    starterTasks: dateTasks,
    themeClass: "theme-dates",
    isRideList: false
  },
  bikeRides: {
    routePart: "bike-rides",
    dbKey: "bike-rides",
    documentTitle: "Ahmedabad Bike Rides ✦",
    description: "A shared bike ride list grouped by travel time from Ahmedabad.",
    eyebrow: "vroom vroom",
    titleHtml: "Bike rides<br /><em>from Ahmedabad</em>",
    subtitle: "Sorted by how far the road wants to pull you.",
    loginCopy: "Sign in to open the bike ride list.",
    emptyState: "Add the first ride and summon the helmets ✦",
    addPlaceholder: "Location name",
    progressNoun: "rides",
    starterTasks: bikeRideTasks,
    themeClass: "theme-bike-rides",
    isRideList: true
  }
};

const usernameAliases = {
  admin: "admin@things.local"
};

const catImages = [
  "assets/cats/cat-01.jpeg",
  "assets/cats/cat-02.jpg",
  "assets/cats/cat-03.png",
  "assets/cats/cat-04.jpg",
  "assets/cats/cat-05.png",
  "assets/cats/cat-06.jpg",
  "assets/cats/cat-07.jpg",
  "assets/cats/cat-08.jpg",
  "assets/cats/cat-09.jpg",
  "assets/cats/cat-10.jpg",
  "assets/cats/cat-11.jpg",
  "assets/cats/cat-12.jpg",
  "assets/cats/cat-13.jpg",
  "assets/cats/cat-14.jpg",
  "assets/cats/cat-15.jpg",
  "assets/cats/cat-16.jpg",
  "assets/cats/cat-17.jpg",
  "assets/cats/cat-18.jpg",
  "assets/cats/cat-19.jpg",
  "assets/cats/cat-20.jpg",
  "assets/cats/cat-21.jpg",
  "assets/cats/cat-22.jpg",
  "assets/cats/cat-23.jpg",
  "assets/cats/cat-24.jpg",
  "assets/cats/cat-25.jpg",
  "assets/cats/cat-26.jpg",
  "assets/cats/cat-27.jpg",
  "assets/cats/cat-28.jpg",
  "assets/cats/cat-29.jpg",
  "assets/cats/cat-30.jpg",
  "assets/cats/cat-31.jpg",
  "assets/cats/cat-32.jpg",
  "assets/cats/cat-33.jpg",
  "assets/cats/cat-34.jpg",
  "assets/cats/cat-35.jpg",
  "assets/cats/cat-36.jpg",
  "assets/cats/cat-37.jpg",
  "assets/cats/cat-38.jpg",
  "assets/cats/cat-39.jpg",
  "assets/cats/cat-40.jpg",
  "assets/cats/cat-41.jpg",
  "assets/cats/cat-42.jpg",
  "assets/cats/cat-43.jpg",
  "assets/cats/cat-44.jpg",
  "assets/cats/cat-45.jpg",
  "assets/cats/cat-46.jpg",
  "assets/cats/cat-47.jpg",
  "assets/cats/cat-48.jpg",
  "assets/cats/cat-49.jpg",
  "assets/cats/cat-50.jpg",
  "assets/cats/cat-51.jpg",
  "assets/cats/cat-52.jpg",
  "assets/cats/cat-53.jpg",
  "assets/cats/cat-54.jpg",
  "assets/cats/cat-55.jpg",
  "assets/cats/cat-56.jpg",
  "assets/cats/cat-57.jpg",
  "assets/cats/cat-58.jpg",
  "assets/cats/cat-59.jpg",
  "assets/cats/cat-60.jpg",
  "assets/cats/cat-61.jpg",
  "assets/cats/cat-62.jpg",
  "assets/cats/cat-63.jpg",
  "assets/cats/cat-64.jpg",
  "assets/cats/cat-65.jpg",
  "assets/cats/cat-66.jpg",
  "assets/cats/cat-67.jpg",
  "assets/cats/cat-68.jpg",
  "assets/cats/cat-69.jpg",
  "assets/cats/cat-70.jpg",
  "assets/cats/cat-71.jpg",
  "assets/cats/cat-72.jpg"
];

const list = document.querySelector("#todo-list");
const appPanel = document.querySelector("#app-panel");
const loginPanel = document.querySelector("#login-panel");
const loginForm = document.querySelector("#login-form");
const loginNote = document.querySelector("#login-note");
const accountEmail = document.querySelector("#account-email");
const signOutButton = document.querySelector("#sign-out");
const form = document.querySelector("#add-form");
const input = document.querySelector("#new-task");
const addLabel = document.querySelector('label[for="new-task"]');
const note = document.querySelector("#connection-note");
const emptyState = document.querySelector("#empty-state");
const progressCopy = document.querySelector("#progress-copy");
const progressPercent = document.querySelector("#progress-percent");
const progressBar = document.querySelector("#progress-bar");
const submitButton = form.querySelector("button");
const pageTitle = document.querySelector("#page-title");
const pageDescription = document.querySelector('meta[name="description"]');
const eyebrow = document.querySelector(".eyebrow");
const subtitle = document.querySelector(".subtitle");
const loginCopy = document.querySelector(".login-copy");
const footer = document.querySelector("footer");
const durationInput = document.createElement("input");
durationInput.id = "ride-duration";
durationInput.name = "ride-duration";
durationInput.type = "number";
durationInput.min = "0";
durationInput.max = "24";
durationInput.step = "0.5";
durationInput.placeholder = "Approx hrs";
durationInput.autocomplete = "off";
durationInput.inputMode = "decimal";

let currentState = { tasks: [] };
let auth;
let todosRef;
let unsubscribeTodos;
let activeList = getActiveList();
let isManualLoginInProgress = false;

function deviceLoginKey(user) {
  return `things-we-shall-do:list-login:${activeList.dbKey}:${user.uid}`;
}

function hasDeviceLoginForList(user) {
  try {
    return window.localStorage.getItem(deviceLoginKey(user)) === "true";
  } catch (error) {
    return false;
  }
}

function rememberDeviceLoginForList(user) {
  try {
    window.localStorage.setItem(deviceLoginKey(user), "true");
  } catch (error) {
    // If storage is unavailable, Firebase auth still works for this browser session.
  }
}

function forgetDeviceLoginForList(user) {
  try {
    window.localStorage.removeItem(deviceLoginKey(user));
  } catch (error) {
    // Nothing to clean up if storage is unavailable.
  }
}

function getActiveList() {
  const routeParts = window.location.pathname
    .split("/")
    .filter(Boolean)
    .filter((part) => part !== "index.html");

  if (routeParts.includes(listConfigs.bikeRides.routePart)) return listConfigs.bikeRides;
  return listConfigs.dates;
}

function applyListCopy() {
  document.body.classList.remove("theme-dates", "theme-bike-rides");
  document.body.classList.add(activeList.themeClass);
  document.title = activeList.documentTitle;
  if (pageDescription) pageDescription.setAttribute("content", activeList.description);
  eyebrow.textContent = activeList.eyebrow;
  pageTitle.innerHTML = activeList.titleHtml;
  subtitle.textContent = activeList.subtitle;
  loginCopy.textContent = activeList.loginCopy;
  emptyState.textContent = activeList.emptyState;
  input.placeholder = activeList.addPlaceholder;
  addLabel.textContent = activeList.isRideList ? "Add a new bike ride" : "Add a new thing to do";
  if (activeList.isRideList) {
    input.name = "ride-location";
    input.maxLength = 120;
    input.required = true;
    durationInput.required = true;
    if (!durationInput.isConnected) input.after(durationInput);
  } else {
    input.name = "new-task";
    input.maxLength = 180;
    durationInput.remove();
  }
  footer.textContent = "made for two people who are very good at making lists";
}

function stickerCountForViewport() {
  if (window.matchMedia("(max-width: 500px)").matches) return 12;
  if (window.matchMedia("(max-width: 820px)").matches) return 16;
  return 24;
}

function createCatSet(rowIndex, count) {
  const set = document.createElement("div");
  set.className = "cat-set";

  for (let index = 0; index < count; index += 1) {
    const image = document.createElement("img");
    image.className = "cat-sticker";
    image.src = catImages[(rowIndex * 9 + index) % catImages.length];
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;
    set.append(image);
  }

  return set;
}

function buildCatBackground() {
  const count = stickerCountForViewport();
  document.querySelectorAll(".cat-row").forEach((row, rowIndex) => {
    const firstSet = createCatSet(rowIndex, count);
    const secondSet = firstSet.cloneNode(true);
    row.replaceChildren(firstSet, secondSet);
  });
}

function setNote(message, isError = false) {
  note.textContent = message;
  note.classList.toggle("error", isError);
}

function setLoginNote(message, isError = false) {
  loginNote.textContent = message;
  loginNote.classList.toggle("error", isError);
}

function validConfig(config) {
  return config && config.apiKey && config.databaseURL && config.projectId;
}

function loginEmailFor(identifier) {
  const normalized = identifier.trim().toLowerCase();
  if (usernameAliases[normalized]) return usernameAliases[normalized];
  if (normalized.includes("@")) return normalized;
  return `${normalized}@things.local`;
}

function freshList() {
  return {
    tasks: activeList.starterTasks.map((task, index) => ({
      id: `${activeList.dbKey}-${index + 1}`,
      text: task.text,
      ...(task.location ? { location: task.location } : {}),
      ...(Number.isFinite(task.durationHours) ? { durationHours: task.durationHours } : {}),
      done: Boolean(task.done),
      createdAt: index
    })),
    updatedAt: Date.now()
  };
}

function normalizeTasks(tasks) {
  if (Array.isArray(tasks)) {
    return tasks.filter((task) => task && (typeof task.text === "string" || typeof task.location === "string"));
  }

  if (tasks && typeof tasks === "object") {
    return Object.entries(tasks)
      .sort(([left], [right]) => Number(left) - Number(right))
      .map(([, task]) => task)
      .filter((task) => task && (typeof task.text === "string" || typeof task.location === "string"));
  }

  return [];
}

function parseDurationFromText(text) {
  const match = String(text || "").match(/^\s*(\d+(?:\.\d+)?)\s*h(?:r|rs|our|ours)?\s*[—-]\s*(.+)$/i);
  if (!match) return { location: String(text || ""), durationHours: undefined };
  return { durationHours: Number(match[1]), location: match[2].trim() };
}

function normalizeTask(task) {
  const parsed = parseDurationFromText(task.text);
  const durationHours = Number(task.durationHours ?? parsed.durationHours);
  const location = String(task.location || parsed.location || task.text || "").trim();
  const text = activeList.isRideList && location && Number.isFinite(durationHours)
    ? `${durationHours} ${durationHours === 1 ? "hr" : "hrs"} — ${location}`
    : task.text;

  return {
    ...task,
    text,
    ...(activeList.isRideList ? { location, durationHours } : {})
  };
}

function normalizeState(state) {
  return {
    ...(state && typeof state === "object" ? state : {}),
    tasks: normalizeTasks(state?.tasks).map(normalizeTask)
  };
}

function rideSectionFor(task) {
  const duration = Number(task.durationHours);
  return rideSections.find((section) => {
    const isAboveLowerBound = section.includeMin ? duration >= section.min : duration > section.min;
    return isAboveLowerBound && duration <= section.max;
  }) || rideSections.at(-1);
}

function renderTask(task) {
  const item = document.createElement("li");
  item.className = `todo-item${task.done ? " is-done" : ""}`;
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = Boolean(task.done);
  checkbox.setAttribute("aria-label", `Mark ${task.text} as ${task.done ? "not done" : "done"}`);
  checkbox.addEventListener("change", () => toggleTask(task.id));
  const checkmark = document.createElement("span");
  checkmark.className = "checkmark";
  checkmark.setAttribute("aria-hidden", "true");
  checkmark.textContent = "✓";
  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = activeList.isRideList && task.location ? task.location : task.text;
  label.append(checkbox, checkmark, text);

  if (activeList.isRideList && Number.isFinite(Number(task.durationHours))) {
    const badge = document.createElement("span");
    badge.className = "duration-badge";
    badge.textContent = `${task.durationHours} ${Number(task.durationHours) === 1 ? "hr" : "hrs"}`;
    label.append(badge);
  }

  item.append(label);
  return item;
}

function render(state) {
  currentState = normalizeState(state);
  const tasks = currentState.tasks;
  list.replaceChildren();
  emptyState.hidden = tasks.length !== 0;

  if (activeList.isRideList) {
    const groupedTasks = new Map(rideSections.map((section) => [section.label, []]));
    for (const task of tasks) groupedTasks.get(rideSectionFor(task).label).push(task);

    for (const section of rideSections) {
      const sectionTasks = groupedTasks.get(section.label)
        .sort((left, right) => {
          const durationDifference = Number(left.durationHours) - Number(right.durationHours);
          if (durationDifference !== 0) return durationDifference;
          return String(left.location || left.text).localeCompare(String(right.location || right.text));
        });
      if (!sectionTasks.length) continue;

      const header = document.createElement("li");
      header.className = "todo-section-heading";
      header.textContent = section.label;
      list.append(header);
      for (const task of sectionTasks) list.append(renderTask(task));
    }
  } else {
    for (const task of tasks) list.append(renderTask(task));
  }

  const complete = tasks.filter((task) => task.done).length;
  const percent = tasks.length ? Math.round((complete / tasks.length) * 100) : 0;
  progressCopy.textContent = `${complete} of ${tasks.length} ${activeList.progressNoun} done`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

function showLogin(message = "") {
  appPanel.hidden = true;
  loginPanel.hidden = false;
  setLoginNote(message);
  accountEmail.textContent = "";
  if (unsubscribeTodos) {
    unsubscribeTodos();
    unsubscribeTodos = undefined;
  }
}

function showApp(user) {
  loginPanel.hidden = true;
  appPanel.hidden = false;
  accountEmail.textContent = user.email === usernameAliases.admin ? "admin" : user.email || "Signed in";
}

async function toggleTask(id) {
  try {
    await runTransaction(todosRef, (state) => {
      const normalizedState = normalizeState(state);
      if (!normalizedState.tasks.length) return state;
      return {
        ...normalizedState,
        tasks: normalizedState.tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task),
        updatedAt: Date.now()
      };
    });
  } catch (error) {
    setNote("Couldn’t save that change. Please try again.", true);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const location = input.value.trim();
  const durationHours = Number(durationInput.value);
  if (!location || !todosRef) return;
  if (activeList.isRideList && !Number.isFinite(durationHours)) {
    setNote("Add the approximate ride duration in hours too.", true);
    return;
  }
  submitButton.disabled = true;
  try {
    const newTask = activeList.isRideList
      ? {
        id: crypto.randomUUID(),
        location,
        durationHours,
        text: `${durationHours} ${durationHours === 1 ? "hr" : "hrs"} — ${location}`,
        done: false,
        createdAt: Date.now()
      }
      : { id: crypto.randomUUID(), text: location, done: false, createdAt: Date.now() };
    await runTransaction(todosRef, (state) => {
      const normalizedState = normalizeState(state);
      return {
        ...normalizedState,
        tasks: [...normalizedState.tasks, newTask],
        updatedAt: Date.now()
      };
    });
    input.value = "";
    durationInput.value = "";
    input.focus();
  } catch (error) {
    setNote("Couldn’t add that just now. Please try again.", true);
  } finally {
    submitButton.disabled = false;
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = loginEmailFor(String(formData.get("identifier") || ""));
  const password = String(formData.get("password") || "");
  const button = loginForm.querySelector("button");
  button.disabled = true;
  isManualLoginInProgress = true;
  setLoginNote("Checking the key to the list...");
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    rememberDeviceLoginForList(credential.user);
    loginForm.reset();
    await openListForUser(credential.user);
  } catch (error) {
    setLoginNote("That email or password did not work.", true);
  } finally {
    isManualLoginInProgress = false;
    button.disabled = false;
  }
});

signOutButton.addEventListener("click", async () => {
  if (auth.currentUser) forgetDeviceLoginForList(auth.currentUser);
  await signOut(auth);
});

async function openListForUser(user) {
  if (unsubscribeTodos) {
    unsubscribeTodos();
    unsubscribeTodos = undefined;
  }

  showApp(user);
  setNote("Loading the shared list...");
  try {
    const firstRead = await get(todosRef);
    if (!firstRead.exists()) await set(todosRef, freshList());
    unsubscribeTodos = onValue(todosRef, (snapshot) => {
      render(snapshot.val());
      setNote("");
    }, () => {
      setNote("This account is signed in, but it is not approved for the list yet.", true);
    });
  } catch (error) {
    setNote("This account is signed in, but it is not approved for the list yet.", true);
  }
}

async function start() {
  const config = window.FIREBASE_CONFIG;
  if (!validConfig(config)) {
    form.querySelectorAll("input, button").forEach((element) => { element.disabled = true; });
    loginForm.querySelectorAll("input, button").forEach((element) => { element.disabled = true; });
    showLogin("Waiting for Firebase to be connected - see the README.");
    render({ tasks: freshList().tasks });
    return;
  }

  try {
    const app = initializeApp(config);
    auth = getAuth(app);
    await setPersistence(auth, browserLocalPersistence);
    todosRef = ref(getDatabase(app), `sharedTodos/${activeList.dbKey}`);

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        showLogin();
        return;
      }

      if (unsubscribeTodos) {
        unsubscribeTodos();
        unsubscribeTodos = undefined;
      }

      if (!hasDeviceLoginForList(user) && !isManualLoginInProgress) {
        showLogin("Please sign in once on this device for this list.");
        return;
      }

      rememberDeviceLoginForList(user);
      await openListForUser(user);
    });
  } catch (error) {
    console.error(error);
    form.querySelectorAll("input, button").forEach((element) => { element.disabled = true; });
    loginForm.querySelectorAll("input, button").forEach((element) => { element.disabled = true; });
    showLogin("Couldn’t connect to Firebase. Check the configuration and Firebase setup.");
    render({ tasks: freshList().tasks });
  }
}

buildCatBackground();
applyListCopy();
start();
