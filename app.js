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
  "1 hr — Thol Sanctuary",
  "1.5 hrs — Roda Temples, Himmatnagar",
  "1.5 hrs — Zanzari Waterfall",
  "2 hrs — Sun Temple",
  "2 hrs — Idar Fort, Himmatnagar",
  "2 hrs — Nalsarovar Sanctuary",
  "2.5 hrs — Rani ki Vav",
  "2.5 hrs — Polo Forest",
  "2.5 hrs — Dasada",
  "2.5 hrs — Taranga Hill",
  "3 hrs — Ambaji",
  "4 hrs — Udaipur",
  "5 hrs — Statue of Unity",
  "6 hrs — Kumbhalgarh",
  "7 hrs — Road to Heaven"
].map((text) => ({ text, done: false }));

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
    starterTasks: dateTasks
  },
  bikeRides: {
    routePart: "bike-rides",
    dbKey: "bike-rides",
    documentTitle: "Ahmedabad Bike Rides ✦",
    description: "A shared bike ride list grouped by travel time from Ahmedabad.",
    eyebrow: "ahmedabad bike ride list",
    titleHtml: "Bike rides<br /><em>from Ahmedabad</em>",
    subtitle: "Sorted by how far the road wants to pull you.",
    loginCopy: "Sign in to open the bike ride list.",
    emptyState: "Add the first ride and summon the helmets ✦",
    addPlaceholder: "Add another ride…",
    progressNoun: "rides",
    starterTasks: bikeRideTasks
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

let currentState = { tasks: [] };
let auth;
let todosRef;
let unsubscribeTodos;
let activeList = getActiveList();

function getActiveList() {
  const routeParts = window.location.pathname
    .split("/")
    .filter(Boolean)
    .filter((part) => part !== "index.html");

  if (routeParts.includes(listConfigs.bikeRides.routePart)) return listConfigs.bikeRides;
  return listConfigs.dates;
}

function applyListCopy() {
  document.title = activeList.documentTitle;
  if (pageDescription) pageDescription.setAttribute("content", activeList.description);
  eyebrow.textContent = activeList.eyebrow;
  pageTitle.innerHTML = activeList.titleHtml;
  subtitle.textContent = activeList.subtitle;
  loginCopy.textContent = activeList.loginCopy;
  emptyState.textContent = activeList.emptyState;
  input.placeholder = activeList.addPlaceholder;
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
      done: Boolean(task.done),
      createdAt: index
    })),
    updatedAt: Date.now()
  };
}

function normalizeTasks(tasks) {
  if (Array.isArray(tasks)) {
    return tasks.filter((task) => task && typeof task.text === "string");
  }

  if (tasks && typeof tasks === "object") {
    return Object.entries(tasks)
      .sort(([left], [right]) => Number(left) - Number(right))
      .map(([, task]) => task)
      .filter((task) => task && typeof task.text === "string");
  }

  return [];
}

function normalizeState(state) {
  return {
    ...(state && typeof state === "object" ? state : {}),
    tasks: normalizeTasks(state?.tasks)
  };
}

function render(state) {
  currentState = normalizeState(state);
  const tasks = currentState.tasks;
  list.replaceChildren();
  emptyState.hidden = tasks.length !== 0;

  for (const task of tasks) {
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
    text.textContent = task.text;
    label.append(checkbox, checkmark, text);
    item.append(label);
    list.append(item);
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
  const text = input.value.trim();
  if (!text || !todosRef) return;
  submitButton.disabled = true;
  try {
    const newTask = { id: crypto.randomUUID(), text, done: false, createdAt: Date.now() };
    await runTransaction(todosRef, (state) => {
      const normalizedState = normalizeState(state);
      return {
        ...normalizedState,
        tasks: [...normalizedState.tasks, newTask],
        updatedAt: Date.now()
      };
    });
    input.value = "";
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
  setLoginNote("Checking the key to the list...");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
  } catch (error) {
    setLoginNote("That email or password did not work.", true);
  } finally {
    button.disabled = false;
  }
});

signOutButton.addEventListener("click", async () => {
  await signOut(auth);
});

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
