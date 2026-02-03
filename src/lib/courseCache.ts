export type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

type CourseCacheStore = {
  list?: CacheEntry<any>;
  details: Record<string, CacheEntry<any>>;
};

const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes
const LIST_STORAGE_KEY = 'toko_courses_list_cache_v1';
const DETAILS_STORAGE_PREFIX = 'toko_course_details_cache_v1:';

const getGlobalStore = (): CourseCacheStore => {
  const globalAny = globalThis as typeof globalThis & { __tokoCourseCache?: CourseCacheStore };
  if (!globalAny.__tokoCourseCache) {
    globalAny.__tokoCourseCache = { details: {} };
  }
  return globalAny.__tokoCourseCache;
};

const isExpired = (entry?: CacheEntry<any>) => {
  if (!entry) return true;
  return Date.now() > entry.expiresAt;
};

const readStorage = (key: string): CacheEntry<any> | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as CacheEntry<any>;
    return parsed;
  } catch {
    return undefined;
  }
};

const writeStorage = (key: string, entry: CacheEntry<any>) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // ignore storage write failures
  }
};

export const getCachedCoursesList = async <T>(fetcher: () => Promise<T>): Promise<T> => {
  const store = getGlobalStore();

  if (!isExpired(store.list)) {
    return store.list!.data as T;
  }

  const stored = readStorage(LIST_STORAGE_KEY);
  if (stored && !isExpired(stored)) {
    store.list = stored;
    return stored.data as T;
  }

  const data = await fetcher();
  const entry: CacheEntry<T> = {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
  store.list = entry;
  writeStorage(LIST_STORAGE_KEY, entry);
  return data;
};

export const getCachedCourseDetails = async <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  const store = getGlobalStore();
  const memoryEntry = store.details[key];

  if (!isExpired(memoryEntry)) {
    return memoryEntry!.data as T;
  }

  const storageKey = `${DETAILS_STORAGE_PREFIX}${key}`;
  const stored = readStorage(storageKey);
  if (stored && !isExpired(stored)) {
    store.details[key] = stored;
    return stored.data as T;
  }

  const data = await fetcher();
  const entry: CacheEntry<T> = {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
  store.details[key] = entry;
  writeStorage(storageKey, entry);
  return data;
};
