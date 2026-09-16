import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import * as Network from 'expo-network';

/**
 * One QueryClient for the app. Catalog and household are persisted so the app opens with data;
 * mutations retry and queue while offline (the dinner table is not always online).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 1000 * 60 * 60 * 24 * 7,
      retry: 2,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 3,
      networkMode: 'offlineFirst',
    },
  },
});

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'pf-query-cache',
  throttleTime: 1000,
});

/** Only these query keys are written to disk. */
export const PERSISTED_QUERY_KEYS = new Set(['catalog', 'household', 'settings', 'facts']);

// Feed react-query's online state from the device.
onlineManager.setEventListener((setOnline) => {
  const sub = Network.addNetworkStateListener((s) => setOnline(!!s.isConnected && s.isInternetReachable !== false));
  return () => sub.remove();
});
