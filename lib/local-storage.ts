/**
 * Utility functions for working with localStorage
 */

/**
 * Save data to localStorage
 * @param key The key to store data under
 * @param value The data to store
 */
export function setItem<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

/**
 * Get data from localStorage
 * @param key The key to retrieve
 * @param defaultValue Optional default value if key doesn't exist
 * @returns The stored value or defaultValue if key doesn't exist
 */
export function getItem<T>(
  key: string,
  defaultValue?: T
): T | null | undefined {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue ?? null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue ?? null;
  }
}

/**
 * Remove an item from localStorage
 * @param key The key to remove
 */
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

/**
 * Clear all data from localStorage
 */
export function clearAll(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

/**
 * Check if a key exists in localStorage
 * @param key The key to check
 * @returns true if the key exists, false otherwise
 */
export function hasItem(key: string): boolean {
  return localStorage.getItem(key) !== null;
}
