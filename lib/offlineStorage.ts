/**
 * Smitri_NER - Client-Side Offline Storage (IndexedDB)
 * Phase 1: Near-Term Enhancements & Offline Resilience
 * 
 * Provides robust offline-first caching for:
 * 1. Offline Game Sessions & Cognitive Scores
 * 2. Offline Medication & Water Reminders
 * 3. Pending Sync Queue (auto-syncs with server upon network recovery)
 */

const DB_NAME = 'smitri_offline_db';
const DB_VERSION = 1;

export interface OfflineGameResult {
  localId?: number;
  id?: string;
  userId: string;
  gameId: string;
  gameTitle: string;
  score: number;
  accuracy: number;
  responseTimeSec: number;
  expectedTimeSec?: number;
  mistakes: number;
  difficultyLevel: number;
  recommendedDifficulty?: number;
  feedbackText?: string;
  timestamp: string;
  synced: boolean;
}

export interface OfflineReminder {
  id: string;
  userId: string;
  title: string;
  time: string;
  category: 'MEDICINE' | 'WATER' | 'EXERCISE' | 'DOCTOR' | 'CUSTOM';
  isCompleted: boolean;
  notes?: string;
  dosage?: string;
  priority?: 'HIGH' | 'ROUTINE';
  synced: boolean;
  updatedAt: string;
}

export interface SyncQueueItem {
  id?: number;
  type: 'GAME_RESULT' | 'REMINDER_STATUS' | 'PROFILE_UPDATE';
  endpoint: string;
  payload: any;
  createdAt: string;
}

/**
 * Open or initialize the browser IndexedDB instance
 */
export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported or running in SSR context'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Game Results store
      if (!db.objectStoreNames.contains('gameResults')) {
        const gameStore = db.createObjectStore('gameResults', { keyPath: 'localId', autoIncrement: true });
        gameStore.createIndex('synced', 'synced', { unique: false });
        gameStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 2. Reminders store
      if (!db.objectStoreNames.contains('reminders')) {
        const reminderStore = db.createObjectStore('reminders', { keyPath: 'id' });
        reminderStore.createIndex('synced', 'synced', { unique: false });
      }

      // 3. Pending sync queue
      if (!db.objectStoreNames.contains('syncQueue')) {
        const queueStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        queueStore.createIndex('type', 'type', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a completed game session locally when offline or as local cache
 */
export async function saveGameResultOffline(result: Omit<OfflineGameResult, 'synced'>): Promise<number> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['gameResults', 'syncQueue'], 'readwrite');
    const gameStore = tx.objectStore('gameResults');
    const queueStore = tx.objectStore('syncQueue');

    const item: OfflineGameResult = {
      ...result,
      synced: false,
    };

    const addRequest = gameStore.add(item);

    addRequest.onsuccess = (e) => {
      const localId = (e.target as IDBRequest).result as number;

      // Add to pending sync queue
      const queueItem: SyncQueueItem = {
        type: 'GAME_RESULT',
        endpoint: '/api/game-result',
        payload: {
          ...result,
          currentDifficulty: result.difficultyLevel,
        },
        createdAt: new Date().toISOString(),
      };
      queueStore.add(queueItem);

      resolve(localId);
    };

    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get all cached offline game results
 */
export async function getOfflineGameResults(): Promise<OfflineGameResult[]> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('gameResults', 'readonly');
      const store = tx.objectStore('gameResults');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn('Could not read offline game results:', error);
    return [];
  }
}

/**
 * Cache or update a reminder locally in IndexedDB
 */
export async function saveReminderOffline(reminder: OfflineReminder): Promise<void> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['reminders', 'syncQueue'], 'readwrite');
    const reminderStore = tx.objectStore('reminders');
    const queueStore = tx.objectStore('syncQueue');

    reminderStore.put(reminder);

    const queueItem: SyncQueueItem = {
      type: 'REMINDER_STATUS',
      endpoint: '/api/reminders',
      payload: {
        id: reminder.id,
        isCompleted: reminder.isCompleted,
      },
      createdAt: new Date().toISOString(),
    };
    queueStore.add(queueItem);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get all reminders saved in offline storage
 */
export async function getOfflineReminders(): Promise<OfflineReminder[]> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('reminders', 'readonly');
      const store = tx.objectStore('reminders');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn('Could not read offline reminders:', error);
    return [];
  }
}

/**
 * Automatically synchronize queued offline records with server once online
 */
export async function syncOfflineDataWithServer(): Promise<{ syncedCount: number; errors: any[] }> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { syncedCount: 0, errors: ['Device currently offline'] };
  }

  try {
    const db = await openOfflineDB();
    const items: SyncQueueItem[] = await new Promise((resolve, reject) => {
      const tx = db.transaction('syncQueue', 'readonly');
      const store = tx.objectStore('syncQueue');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (items.length === 0) {
      return { syncedCount: 0, errors: [] };
    }

    let syncedCount = 0;
    const errors: any[] = [];

    for (const item of items) {
      try {
        const response = await fetch(item.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        });

        if (response.ok) {
          // Remove item from sync queue
          await new Promise<void>((resolve, reject) => {
            const delTx = db.transaction('syncQueue', 'readwrite');
            const delStore = delTx.objectStore('syncQueue');
            if (item.id !== undefined) {
              delStore.delete(item.id);
            }
            delTx.oncomplete = () => resolve();
            delTx.onerror = () => reject(delTx.error);
          });
          syncedCount++;
        } else {
          errors.push(`Failed endpoint ${item.endpoint}: status ${response.status}`);
        }
      } catch (err) {
        errors.push(err);
      }
    }

    return { syncedCount, errors };
  } catch (error) {
    return { syncedCount: 0, errors: [error] };
  }
}
