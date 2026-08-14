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

const starterTasks = [
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
];

const usernameAliases = {
  admin: "admin@things.local"
};

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

let currentState = { tasks: [] };
let auth;
let todosRef;
let unsubscribeTodos;

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
    tasks: starterTasks.map((text, index) => ({
      id: `starter-${index + 1}`,
      text,
      done: index === 9,
      createdAt: index
    })),
    updatedAt: Date.now()
  };
}

function render(state) {
  currentState = state && Array.isArray(state.tasks) ? state : { tasks: [] };
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
  progressCopy.textContent = `${complete} of ${tasks.length} little plans done`;
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
      if (!state || !Array.isArray(state.tasks)) return state;
      return {
        ...state,
        tasks: state.tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task),
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
    await runTransaction(todosRef, (state) => ({
      ...(state && Array.isArray(state.tasks) ? state : { tasks: [] }),
      tasks: [...(state?.tasks || []), newTask],
      updatedAt: Date.now()
    }));
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
    todosRef = ref(getDatabase(app), "sharedTodos/date-night");

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
          setNote("Live and shared - changes appear for approved people.");
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

start();
