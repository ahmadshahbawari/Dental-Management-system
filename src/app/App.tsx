import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/features/auth/context/AuthContext';
<<<<<<< HEAD
import { I18nProvider } from '@/lib/I18nContext';
=======
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
import { AppRoutes } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="dental-lab-theme">
<<<<<<< HEAD
          <I18nProvider>
            <AuthProvider>
              <AppRoutes />
              <Toaster position="top-right" toastOptions={{ className: 'font-sans' }} />
              <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
          </I18nProvider>
=======
          <AuthProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'font-sans',
              }}
            />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
