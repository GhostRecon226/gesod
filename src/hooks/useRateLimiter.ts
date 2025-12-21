import { useState, useCallback, useRef, useEffect } from "react";

interface RateLimiterConfig {
  maxRequests: number; // Max requests per window
  windowMs: number; // Time window in milliseconds
  maxUniqueItems?: number; // Max unique items (e.g., VINs) per session
  storageKey: string; // Key for sessionStorage
}

interface RateLimiterState {
  timestamps: number[];
  uniqueItems: string[];
}

interface RateLimiterResult {
  isAllowed: boolean;
  isRateLimited: boolean;
  checkAndRecord: (item?: string) => boolean;
  remainingRequests: number;
  resetTime: number | null;
}

const getStorageState = (key: string): RateLimiterState => {
  try {
    const stored = sessionStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore storage errors
  }
  return { timestamps: [], uniqueItems: [] };
};

const setStorageState = (key: string, state: RateLimiterState) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
};

export function useRateLimiter(config: RateLimiterConfig): RateLimiterResult {
  const { maxRequests, windowMs, maxUniqueItems = 50, storageKey } = config;
  
  const [state, setState] = useState<RateLimiterState>(() => 
    getStorageState(storageKey)
  );
  const stateRef = useRef(state);
  
  // Keep ref in sync with state
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const cleanOldTimestamps = useCallback((timestamps: number[]): number[] => {
    const now = Date.now();
    return timestamps.filter((ts) => now - ts < windowMs);
  }, [windowMs]);

  const checkAndRecord = useCallback((item?: string): boolean => {
    const now = Date.now();
    const currentState = stateRef.current;
    
    // Clean old timestamps
    const validTimestamps = cleanOldTimestamps(currentState.timestamps);
    
    // Check if rate limited by request count
    if (validTimestamps.length >= maxRequests) {
      return false;
    }
    
    // Check if too many unique items (enumeration protection)
    if (item && !currentState.uniqueItems.includes(item)) {
      if (currentState.uniqueItems.length >= maxUniqueItems) {
        return false;
      }
    }
    
    // Record the request
    const newTimestamps = [...validTimestamps, now];
    const newUniqueItems = item && !currentState.uniqueItems.includes(item)
      ? [...currentState.uniqueItems, item]
      : currentState.uniqueItems;
    
    const newState = {
      timestamps: newTimestamps,
      uniqueItems: newUniqueItems,
    };
    
    setState(newState);
    setStorageState(storageKey, newState);
    
    return true;
  }, [maxRequests, maxUniqueItems, cleanOldTimestamps, storageKey]);

  // Calculate current status
  const validTimestamps = cleanOldTimestamps(state.timestamps);
  const isRateLimited = validTimestamps.length >= maxRequests || 
    state.uniqueItems.length >= maxUniqueItems;
  const remainingRequests = Math.max(0, maxRequests - validTimestamps.length);
  
  // Calculate when rate limit resets
  const resetTime = validTimestamps.length > 0 
    ? Math.max(0, windowMs - (Date.now() - validTimestamps[0]))
    : null;

  return {
    isAllowed: !isRateLimited,
    isRateLimited,
    checkAndRecord,
    remainingRequests,
    resetTime,
  };
}
