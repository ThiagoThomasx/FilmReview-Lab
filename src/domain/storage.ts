const isStorageAvailable = (): boolean => {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return false;
    }
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (!isStorageAvailable()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const saveToStorage = <T>(key: string, value: T): boolean => {
  if (!isStorageAvailable()) return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeFromStorage = (key: string): boolean => {
  if (!isStorageAvailable()) return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const clearStorage = (): boolean => {
  if (!isStorageAvailable()) return false;
  try {
    localStorage.clear();
    return true;
  } catch {
    return false;
  }
};
