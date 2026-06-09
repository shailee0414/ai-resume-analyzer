import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

export function Toaster() {
  const { theme } = useTheme();
  const isLight = theme === 'light' || theme === 'sepia';
  return (
    <SonnerToaster
      theme={isLight ? 'light' : 'dark'}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'bg-popover text-popover-foreground border-border rounded-lg shadow-lg',
          title: 'text-sm font-medium',
          description: 'text-xs text-muted-foreground',
        },
      }}
    />
  );
}
