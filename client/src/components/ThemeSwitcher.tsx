import { Moon, Sun, MoonStar, Coffee, Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { THEMES } from '@/stores/themeStore';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/types';

const ICONS: Record<Theme, React.ReactNode> = {
  dark: <Moon className="h-4 w-4" />,
  light: <Sun className="h-4 w-4" />,
  midnight: <MoonStar className="h-4 w-4" />,
  sepia: <Coffee className="h-4 w-4" />,
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Switch theme">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map((t) => (
          <DropdownMenuCheckboxItem
            key={t.value}
            checked={theme === t.value}
            onCheckedChange={() => setTheme(t.value)}
          >
            <span className="mr-2 inline-flex">{ICONS[t.value]}</span>
            {t.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
