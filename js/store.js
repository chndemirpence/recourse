// store.js — persistence for errands, vault, wins (IndexedDB + localStorage fallback)

const SETTINGS_KEY = "recourse.settings.v1";
export const DEFAULT_SETTINGS = {
  provider: "offline",           // offline | openai
  apiBase: "https://api.openai.com/v1",
  apiKey: "",
  model: "gpt-4o-mini",
  autonomy: "confirm",           // ask | confirm | auto
  currency: "$",
  name: "",
  email: "",
  onboarded: false,
  privacy: { localFirst: true },
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const p = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...p, privacy: { ...DEFAULT_SETTINGS.privacy, ...(p.privacy || {}) } };
  } catch { return { ...DEFAULT_SETTINGS }; }
}
export function saveSettings(s) { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); return true; } catch { return false; } }

/* ---------------- IndexedDB (stores: errands, vault, wins) ---------------- */
const DB = "recourse.db";
const STORES = ["errands", "vault", "wins"];
let dbPromise = null;
const mem = { errands: null, vault: null, wins: null };
const hasIDB = () => typeof indexedDB !== "undefined";

function openDB() {
  if (!hasIDB()) return Promise.reject(new Error("no-idb"));
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => { const db = req.result; for (const s of STORES) if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: "id" }); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}
function memKey(store) { return `recourse.${store}.fallback.v1`; }
function memLoad(store) { if (mem[store]) return mem[store]; try { mem[store] = JSON.parse(localStorage.getItem(memKey(store)) || "[]"); } catch { mem[store] = []; } return mem[store]; }
function memSave(store) { try { localStorage.setItem(memKey(store), JSON.stringify(mem[store] || [])); } catch { /* ignore */ } }

async function put(store, obj) {
  try { const db = await openDB(); await tx(db, store, "readwrite", (os) => os.put(obj)); }
  catch { const arr = memLoad(store); const i = arr.findIndex((x) => x.id === obj.id); if (i >= 0) arr[i] = obj; else arr.unshift(obj); memSave(store); }
  return obj;
}
async function del(store, id) {
  try { const db = await openDB(); await tx(db, store, "readwrite", (os) => os.delete(id)); }
  catch { mem[store] = memLoad(store).filter((x) => x.id !== id); memSave(store); }
}
async function all(store) {
  try {
    const db = await openDB();
    const items = await new Promise((res, rej) => { const os = db.transaction(store, "readonly").objectStore(store); const r = os.getAll(); r.onsuccess = () => res(r.result || []); r.onerror = () => rej(r.error); });
    return items.sort((a, b) => b.ts - a.ts);
  } catch { return [...memLoad(store)].sort((a, b) => b.ts - a.ts); }
}
function tx(db, store, mode, run) {
  return new Promise((resolve, reject) => { const t = db.transaction(store, mode); run(t.objectStore(store)); t.oncomplete = () => resolve(); t.onerror = () => reject(t.error); t.onabort = () => reject(t.error); });
}
const uid = (p) => (crypto?.randomUUID?.() || `${p}_${Date.now()}_${Math.random().toString(36).slice(2)}`);

/* ---------------- Errands ---------------- */
export function newErrand(partial = {}) {
  return {
    id: uid("e"), ts: Date.now(), title: "", templateId: "", target: "", goal: "",
    status: "intake", channel: "", artifact: "", plan: [], log: [],
    estValue: 0, actualValue: null, unit: "money", needsApproval: false, createdFrom: "freeform",
    ...partial,
  };
}
export const addErrand = (e) => put("errands", newErrand(e));
export const saveErrand = (e) => put("errands", e);
export const deleteErrand = (id) => del("errands", id);
export const allErrands = () => all("errands");
export async function getErrand(id) { return (await all("errands")).find((e) => e.id === id) || null; }

export function searchErrands(list, q) {
  const s = (q || "").trim().toLowerCase();
  if (!s) return list;
  return list.filter((e) => [e.title, e.target, e.goal].join(" ").toLowerCase().includes(s));
}

/* ---------------- Vault ---------------- */
export function newVaultItem(p = {}) { return { id: uid("v"), ts: Date.now(), kind: "fact", label: "", value: "", note: "", ...p }; }
export const addVaultItem = (v) => put("vault", newVaultItem(v));
export const deleteVaultItem = (id) => del("vault", id);
export const allVaultItems = () => all("vault");

/* ---------------- Wins ---------------- */
export function newWin(p = {}) { return { id: uid("w"), ts: Date.now(), errandId: "", kind: "money", amount: 0, unit: "money", title: "", ...p }; }
export const addWin = (w) => put("wins", newWin(w));
export const allWins = () => all("wins");

export async function winTotals() {
  const wins = await all("wins");
  let money = 0, hours = 0, tasks = 0;
  for (const w of wins) {
    if (w.unit === "money") money += Number(w.amount) || 0;
    else if (w.unit === "time") hours += Number(w.amount) || 0;
    tasks += 1;
  }
  return { money, hours, tasks, count: wins.length };
}

export async function clearAll() {
  for (const s of STORES) { try { const db = await openDB(); await tx(db, s, "readwrite", (os) => os.clear()); } catch { mem[s] = []; memSave(s); } }
}
