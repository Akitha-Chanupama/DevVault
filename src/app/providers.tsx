import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from '@/stores/themeStore';
import { useFontSizeStore } from '@/stores/fontStore';
import { ErrorBoundary } from './error-boundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const initTheme = useThemeStore((state) => state.initTheme);
  const initFontSize = useFontSizeStore((state) => state.initFontSize);

  useEffect(() => {
    initTheme();
    initFontSize();
  }, [initTheme, initFontSize]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

