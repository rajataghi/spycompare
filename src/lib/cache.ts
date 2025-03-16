type CachedData<T> = {
    data: T;
    timestamp: number;
  };
  
  const cache = new Map<string, CachedData<any>>();
  
  export const getFromCache = <T>(key: string): T | null => {
    const cached = cache.get(key);
    if (!cached) {
      console.log('No cached data found for ', key);
      return null;
    }
  
    // Validate cache expiration (e.g., invalidate monthly)
    const now = new Date();
    const cachedDate = new Date(cached.timestamp);
    if (
      now.getFullYear() === cachedDate.getFullYear() &&
      now.getMonth() === cachedDate.getMonth()
    ) {
      console.log('Using cached data for ', key);
      return cached.data;
    }
  
    // Expired, remove from cache
    cache.delete(key);
    console.log('Cache expired for ', key);
    return null;
  };
  
  export const setInCache = <T>(key: string, data: T): void => {
    cache.set(key, { data, timestamp: Date.now() });
  };
  