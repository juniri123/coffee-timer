import type { BrewLog, Recipe } from "./types";

const DATABASE_NAME = "coffee-timer";
const DATABASE_VERSION = 1;
const RECIPE_STORE = "recipes";
const LOG_STORE = "brewLogs";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(RECIPE_STORE)) {
        database.createObjectStore(RECIPE_STORE, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(LOG_STORE)) {
        const store = database.createObjectStore(LOG_STORE, { keyPath: "id" });
        store.createIndex("completedAt", "completedAt");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function put<T>(storeName: string, value: T): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(value);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

async function getAll<T>(storeName: string): Promise<T[]> {
  const database = await openDatabase();
  const values = await new Promise<T[]>((resolve, reject) => {
    const request = database.transaction(storeName, "readonly").objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return values;
}

export const recipeStore = {
  async seed(recipe: Recipe): Promise<void> {
    const recipes = await getAll<Recipe>(RECIPE_STORE);
    if (!recipes.some((item) => item.id === recipe.id)) {
      await put(RECIPE_STORE, recipe);
    }
  },
  list: () => getAll<Recipe>(RECIPE_STORE),
  save: (recipe: Recipe) => put(RECIPE_STORE, recipe),
};

export const brewLogStore = {
  async list(): Promise<BrewLog[]> {
    const logs = await getAll<BrewLog>(LOG_STORE);
    return logs.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  },
  save: (log: BrewLog) => put(LOG_STORE, log),
};
