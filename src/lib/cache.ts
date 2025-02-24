type CachedData<T> = {
    data: T;
    timestamp: number;
  };
  
  const cache = new Map<string, CachedData<any>>();
  
  export const getFromCache = <T>(key: string): T | null => {
    const cached = cache.get(key);
    if (!cached) return null;
  
    // Validate cache expiration (e.g., invalidate monthly)
    const now = new Date();
    const cachedDate = new Date(cached.timestamp);
    if (
      now.getFullYear() === cachedDate.getFullYear() &&
      now.getMonth() === cachedDate.getMonth()
    ) {
      return cached.data;
    }
  
    // Expired, remove from cache
    cache.delete(key);
    return null;
  };
  
  export const setInCache = <T>(key: string, data: T): void => {
    cache.set(key, { data, timestamp: Date.now() });
  };
  