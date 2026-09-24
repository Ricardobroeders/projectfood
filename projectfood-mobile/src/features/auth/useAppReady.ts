import { useSession } from '@/features/auth/useSession';
import { useHousehold } from '@/features/household/queries';

/**
 * Everything the first screen needs: fonts, the session, and (signed in) the household or its
 * error. The route gate renders nothing before this; the animated splash covers the wait.
 */
export function useAppReady(fontsLoaded: boolean): boolean {
  const { session, loading } = useSession();
  const hh = useHousehold();
  const signedIn = !!session;
  const householdKnown = !signedIn || hh.data !== undefined || hh.isError;
  return fontsLoaded && !loading && householdKnown;
}
