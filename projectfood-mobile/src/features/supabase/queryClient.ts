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

if (__DEV__) {
  // Dev-only: how long each network fetch takes, printed to the Metro terminal.
  const started = new Map<string, number>();
  queryClient.getQueryCache().subscribe((e) => {
    if (e.type !== 'updated') return;
    const q = e.query;
    if (e.action.type === 'fetch') started.set(q.queryHash, performance.now());
    else if (e.action.type === 'success' || e.action.type === 'error') {
      const t0 = started.get(q.queryHash);
      if (t0 === undefined) return;
      started.delete(q.queryHash);
      const data: unknown = e.action.type === 'success' ? e.action.data : undefined;
      const size = Array.isArray(data) ? `${data.length} rows` : data && typeof data === 'object' && 'plants' in data ? `${(data as { plants: unknown[] }).plants.length} plants` : e.action.type;
      console.log(`[perf] query ${String(q.queryKey[0])}: ${Math.round(performance.now() - t0)} ms (${size})`);
    }
  });
}

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
