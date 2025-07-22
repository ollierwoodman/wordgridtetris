import { useCallback, useEffect, useState } from 'react';
import { useTrackingOptOut } from './useLocalStorage';

export type MatomoFunction = (this: unknown) => void;

declare global {
  interface Window {
    _paq: (string | number | MatomoFunction)[][] | undefined;
  }
}

/**
 * Hook to manage Matomo tracking opt-in/out state.
 * Syncs with Matomo's _paq and localStorage.
 */
export function useMatomoOptOut() {
  const [isOptedOut, setLocalOptedOut] = useTrackingOptOut();
  const [loading, setLoading] = useState(true);

  // Check Matomo's opt-out state and sync with localStorage
  const checkMatomoOptOut = useCallback(() => {
    if (typeof window._paq === 'undefined') {
      setLoading(false);
      return;
    }
    
    window._paq.push([
      function (this: unknown) {
        const matomoOptedOut = (this as { isUserOptedOut: () => boolean }).isUserOptedOut();
        setLocalOptedOut(matomoOptedOut);
        setLoading(false);
      },
    ]);
  }, [setLocalOptedOut]);

  // On mount, check Matomo's opt-out state
  useEffect(() => {
    checkMatomoOptOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set opt-out/in and sync with Matomo
  const setOptedOut = useCallback(
    (optOut: boolean) => {
      if (typeof window._paq === 'undefined') return;
      if (optOut) {
        window._paq.push(['optUserOut']);
      } else {
        window._paq.push(['forgetUserOptOut']);
      }
      setLocalOptedOut(optOut);
    },
    [setLocalOptedOut]
  );

  return {
    isOptedOut,
    setOptedOut,
    checkMatomoOptOut,
    loading,
  };
} 