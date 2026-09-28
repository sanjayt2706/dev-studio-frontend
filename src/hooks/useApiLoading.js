import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useApiLoading - Centralized API loading & state flow hook
 * Follows strict state sequence:
 * idle -> loading -> success (data) | error (retry) | empty
 *
 * @param {Function} asyncFn - Async function returning data
 * @param {Object} options - Configuration options
 * @param {boolean} [options.immediate=false] - Whether to run asyncFn immediately on mount
 * @param {number} [options.minDuration=200] - Minimum loading duration in ms to prevent jarring flashes
 * @param {any} [options.initialData=null] - Initial state for data
 */
export function useApiLoading(asyncFn, options = {}) {
  const { immediate = false, minDuration = 200, initialData = null } = options;

  const [state, setState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error' | 'empty'
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);
  const lastArgsRef = useRef([]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      lastArgsRef.current = args;
      setState('loading');
      setError(null);

      const startTime = Date.now();

      try {
        const result = await asyncFn(...args);

        // Optional minimum duration to prevent flickering on ultra-fast responses
        const elapsed = Date.now() - startTime;
        if (minDuration > 0 && elapsed < minDuration) {
          await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
        }

        if (!isMountedRef.current) return result;

        setData(result);

        // Check if data is empty (empty array, null, or empty object)
        const isDataEmpty =
          result === null ||
          result === undefined ||
          (Array.isArray(result) && result.length === 0) ||
          (typeof result === 'object' && Object.keys(result).length === 0);

        if (isDataEmpty) {
          setState('empty');
        } else {
          setState('success');
        }

        return result;
      } catch (err) {
        const elapsed = Date.now() - startTime;
        if (minDuration > 0 && elapsed < minDuration) {
          await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
        }

        if (!isMountedRef.current) return null;

        const errorMsg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to communicate with Dev Studio network.';
        setError(errorMsg);
        setState('error');
        throw err;
      }
    },
    [asyncFn, minDuration]
  );

  const retry = useCallback(() => {
    return execute(...lastArgsRef.current);
  }, [execute]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    state,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    isEmpty: state === 'empty',
    isIdle: state === 'idle',
    data,
    setData,
    error,
    execute,
    retry,
  };
}

export default useApiLoading;
