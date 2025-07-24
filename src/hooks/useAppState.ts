import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setLoading, addError, clearError, clearAllErrors } from '@/lib/features/app/appSlice';
import type { LoadingKeys, ErrorState } from '@/types/app.types';
import { toast } from 'sonner';

export const useLoading = (key: LoadingKeys) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state: any) => !!state.app.loading[key]);

  const startLoading = useCallback(() => {
    dispatch(setLoading({ key, isLoading: true }));
  }, [dispatch, key]);

  const stopLoading = useCallback(() => {
    dispatch(setLoading({ key, isLoading: false }));
  }, [dispatch, key]);

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
};

export const useError = () => {
  const dispatch = useAppDispatch();
  const errors = useAppSelector((state) => state.app.errors);
  const lastError = useAppSelector((state) => state.app.lastError);

  const handleError = useCallback((error: Omit<ErrorState, 'timestamp'>) => {
    const errorWithTimestamp: ErrorState = {
      ...error,
      timestamp: Date.now(),
    };
    
    dispatch(addError(errorWithTimestamp));

    // Show toast notification for the error
    toast[error.severity || 'error'](error.message, {
      description: error.code ? `Error code: ${error.code}` : undefined,
    });
  }, [dispatch]);

  const removeError = useCallback((timestamp: number) => {
    dispatch(clearError(timestamp));
  }, [dispatch]);

  const removeAllErrors = useCallback(() => {
    dispatch(clearAllErrors());
  }, [dispatch]);

  return {
    errors,
    lastError,
    handleError,
    removeError,
    removeAllErrors,
  };
};

// Utility hook for async operations with automatic loading state management
export const useAsyncOperation = (key: LoadingKeys) => {
  const { startLoading, stopLoading } = useLoading(key);
  const { handleError } = useError();

  const execute = async <T>(
    operation: () => Promise<T>,
    errorMessage = 'Operation failed'
  ): Promise<T | undefined> => {
    try {
      startLoading();
      const result = await operation();
      return result;
    } catch (error) {
      handleError({
        message: errorMessage,
        severity: 'error',
        source: key,
        code: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
      });
      return undefined;
    } finally {
      stopLoading();
    }
  };

  return { execute };
}; 