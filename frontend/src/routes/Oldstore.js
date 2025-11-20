// frontend/src/routes/store.js
import { writable, get } from 'svelte/store'
import { browser } from '$app/environment';

// Function to create persistants stores
function persistStore(key, initial_value, storage_type = 'local') {
    let data = initial_value;
    const store = writable(initial_value);

    if (storage_type === 'svelteStore') {
        // Simplement retourner un store en mémoire pour Svelte store
        return store;
    } else if (storage_type === 'session') {
        // Gestion avec sessionStorage
        const storage = sessionStorage;

        if (typeof window !== 'undefined') {
            const stored_value = storage.getItem(key);
            data = stored_value ? JSON.parse(stored_value) : initial_value;
        }

        const session_store = writable(data);

        if (typeof window !== 'undefined') {
            session_store.subscribe(value => {
                storage.setItem(key, JSON.stringify(value));
            });
        }

        return session_store;
    } else if (storage_type === 'indexedDB') {
        // Gestion asynchrone d'IndexedDB
        openIndexedDB().then(async (db) => {
            const stored_value = await getFromIndexedDB(db, key);
            data = stored_value !== null ? stored_value : initial_value;
            store.set(data);

            // Sauvegarder en IndexedDB à chaque changement
            store.subscribe(async (value) => {
                await setInIndexedDB(db, key, value);
            });
        });

        return store;
    } else if (storage_type === 'cookie') {
        // Gestion des cookies
        const stored_value = getCookie(key);
        data = stored_value ? JSON.parse(stored_value) : initial_value;
        store.set(data);

        store.subscribe(value => {
            setCookie(key, JSON.stringify(value));
        });

        return store;
    } else {
        // Gestion par défaut avec localStorage
        const storage = localStorage;

        if (typeof window !== 'undefined') {
            const stored_value = storage.getItem(key);
            data = stored_value ? JSON.parse(stored_value) : initial_value;
        }

        const local_store = writable(data);

        if (typeof window !== 'undefined') {
            local_store.subscribe(value => {
                storage.setItem(key, JSON.stringify(value));
            });
        }

        return local_store;
    }
}

// Functions to manage Cookies

// Recover cookies
function getCookie(key) {
    if (typeof document !== 'undefined') {
        const name = `${key}=`;
        const decoded_cookie = decodeURIComponent(document.cookie);
        const cookie_array = decoded_cookie.split(';');
        for (let i = 0; i < cookie_array.length; i++) {
            let cookie = cookie_array[i].trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return null;
    }
}

// Save and update cookies
function setCookie(key, value, days = 365) {
    if (typeof document !== 'undefined') {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${key}=${encodeURIComponent(value)}; ${expires}; path=/`;
    }
}

// IndexedDB functions

// Open IndexedDB database of browser
export function openIndexedDB() {
    return new Promise((resolve, reject) => {
        if (browser) {
            const request = indexedDB.open("CairnDevicesWebsite", 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('persistedStore')) {
                    db.createObjectStore('persistedStore', { keyPath: 'key' });
                }
            };

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject('Error opening IndexedDB');
            };
        }
    });
}

// Recover datas from Indexed DB
async function getFromIndexedDB(db, key) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['persistedStore'], 'readonly');
        const store = transaction.objectStore('persistedStore');
        const request = store.get(key);

        request.onsuccess = () => {
            resolve(request.result ? request.result.value : null);
        };

        request.onerror = () => {
            reject('Error retrieving data from IndexedDB');
        };
    });
}

// Stock datas in IndexedDB
async function setInIndexedDB(db, key, value) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['persistedStore'], 'readwrite');
        const store = transaction.objectStore('persistedStore');
        const request = store.put({ key, value });

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject('Error storing data in IndexedDB');
        };
    });
}

// browser
export const browser_name = writable(null);
export const screen_height = writable(null);
export const screen_width = writable(null);

// language
export const locale = writable('en');
export const trans = writable(null);

// Other
export const landing_on = writable("");

// API Variables
export const api_url = writable('https://deck.cairngit.eu/v1'); //TODO Pour l'API


