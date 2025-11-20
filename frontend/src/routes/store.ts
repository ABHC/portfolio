// frontend/src/routes/store.ts
import { derived, writable, type Writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { translations, available_locales } from './translations';
import type { Locale, Translation } from './translations';

/* -----------------------------------------
 * Types
 * ----------------------------------------- */
type StorageType = 'local' | 'session' | 'cookie' | 'indexedDB' | 'svelteStore';

interface PersistedStoreOptions<T> {
	key: string;
	initial_value: T;
	storage_type?: StorageType;
}

/* -----------------------------------------
 * Persistent Store Factory
 * ----------------------------------------- */
export function persistStore<T>(
	key: string,
	initial_value: T,
	storage_type: StorageType = 'local'
): Writable<T> {
	let data: T = initial_value;

	// Simple in-memory store (no persistence)
	if (storage_type === 'svelteStore') {
		return writable<T>(initial_value);
	}

	// Session storage
	if (storage_type === 'session') {
		if (typeof window !== 'undefined') {
			const stored_value = sessionStorage.getItem(key);
			data = stored_value ? JSON.parse(stored_value) : initial_value;
		}

		const session_store = writable<T>(data);

		if (typeof window !== 'undefined') {
			session_store.subscribe((value) => {
				sessionStorage.setItem(key, JSON.stringify(value));
			});
		}

		return session_store;
	}

	// IndexedDB
	if (storage_type === 'indexedDB') {
		const store = writable<T>(initial_value);

		openIndexedDB().then(async (db) => {
			if (!db) return;
			const stored_value = await getFromIndexedDB<T>(db, key);
			data = stored_value !== null ? stored_value : initial_value;
			store.set(data);

			store.subscribe(async (value) => {
				await setInIndexedDB(db, key, value);
			});
		});

		return store;
	}

	// Cookie-based storage
	if (storage_type === 'cookie') {
		const stored_value = getCookie(key);
		data = stored_value ? JSON.parse(stored_value) : initial_value;
		const store = writable<T>(data);

		store.subscribe((value) => {
			setCookie(key, JSON.stringify(value));
		});

		return store;
	}

	// Default: Local storage
	if (typeof window !== 'undefined') {
		const stored_value = localStorage.getItem(key);
		data = stored_value ? JSON.parse(stored_value) : initial_value;
	}

	const local_store = writable<T>(data);

	if (typeof window !== 'undefined') {
		local_store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}

	return local_store;
}

/* -----------------------------------------
 * Cookie Management
 * ----------------------------------------- */
function getCookie(key: string): string | null {
	if (typeof document !== 'undefined') {
		const name = `${key}=`;
		const decoded_cookie = decodeURIComponent(document.cookie);
		const cookie_array = decoded_cookie.split(';');

		for (const cookie of cookie_array) {
			const trimmed = cookie.trim();
			if (trimmed.startsWith(name)) {
				return trimmed.substring(name.length);
			}
		}
	}
	return null;
}

function setCookie(key: string, value: string, days: number = 365): void {
	if (typeof document !== 'undefined') {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		const expires = `expires=${date.toUTCString()}`;
		document.cookie = `${key}=${encodeURIComponent(value)}; ${expires}; path=/`;
	}
}

/* -----------------------------------------
 * IndexedDB Functions
 * ----------------------------------------- */
export function openIndexedDB(): Promise<IDBDatabase | undefined> {
	return new Promise((resolve, reject) => {
		if (!browser) {
			resolve(undefined);
			return;
		}

		const request = indexedDB.open('EpinardDB', 1);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
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
	});
}

async function getFromIndexedDB<T>(db: IDBDatabase, key: string): Promise<T | null> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(['persistedStore'], 'readonly');
		const store = transaction.objectStore('persistedStore');
		const request = store.get(key);

		request.onsuccess = () => {
			resolve(request.result ? (request.result.value as T) : null);
		};

		request.onerror = () => {
			reject('Error retrieving data from IndexedDB');
		};
	});
}

async function setInIndexedDB<T>(db: IDBDatabase, key: string, value: T): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(['persistedStore'], 'readwrite');
		const store = transaction.objectStore('persistedStore');
		const request = store.put({ key, value });

		request.onsuccess = () => resolve();
		request.onerror = () => reject('Error storing data in IndexedDB');
	});
}

/* -----------------------------------------
 * Translations Stores
 * ----------------------------------------- */
export const locale: Writable<Locale> = writable('en');
export const trans: Writable<Translation | null> = writable(null);

/* -----------------------------------------
 * Global Stores
 * ----------------------------------------- */
export const browser_name: Writable<string | null> = writable(null);
export const window_height: Writable<number | null> = writable(null);
export const window_width: Writable<number | null> = writable(null);

export const landing_on: Writable<string> = writable('');
export const api_url: Writable<string> = writable('https://deck.cairngit.eu/v1');

/* -----------------------------------------
 * Responsive Stores
 * ----------------------------------------- */

export const responsive = derived(window_width, ($width) => ({
    isMobile: $width !== null && $width < 768,
    isTablet: $width !== null && $width >= 768 && $width < 1024,
    isDesktop: $width !== null && $width >= 1024,
    isBelow: (breakpoint: number) => $width !== null && $width < breakpoint,
    isAbove: (breakpoint: number) => $width !== null && $width >= breakpoint
}));


export const languages_aria_label = derived(
    [locale, trans], 
    ([$locale, $trans]) => {
        if (!$trans?.menu?.available_languages) {
            return 'Language selector';
        }
        
        const availableLanguagesText = $trans.menu.available_languages;
        
        // Utilise availableLocales importé
        const allLanguageNames = available_locales
            .map(locale => translations[locale]?.language_name)
            .filter((name): name is string => Boolean(name));
        
        return `${availableLanguagesText}: ${allLanguageNames.join(', ')}`;
    }
);

/* ------------------ TEST STORES ------------------ */

export const test_local = persistStore('test_local', { message: 'Hello localStorage' }, 'local');
export const test_session = persistStore('test_session', { message: 'Hello sessionStorage' }, 'session');
export const test_indexed = persistStore('test_indexed', { message: 'Hello indexedDB' }, 'indexedDB');
export const test_svelte = persistStore('test_svelte', { message: 'Hello svelteStore' }, 'svelteStore');
