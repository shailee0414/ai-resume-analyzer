import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, History, FileSearch } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const onLogin = location.pathname === '/login';
  const onSignup = location.pathname === '/signup';

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
            R
          </div>
          <span className="font-semibold tracking-tight">ResumeFit</span>
        </Link>

        <nav className="flex items-center gap-1">
          {user && (
            <>
              <NavLinkItem to="/analyze" icon={<FileSearch className="h-4 w-4" />} label="Analyze" />
              <NavLinkItem to="/history" icon={<History className="h-4 w-4" />} label="History" />
            </>
          )}
          <ThemeSwitcher />
          {user ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out of ResumeFit?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You'll be returned to the login page. Your analyses will remain saved and available
                    next time you sign in.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="gap-1.5">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <>
              <Button
                asChild
                variant={onLogin ? 'default' : 'ghost'}
                size="sm"
                className={cn(onLogin && 'shadow-[0_0_18px_hsl(var(--primary)/0.35)]')}
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                variant={onSignup ? 'default' : 'outline'}
                size="sm"
                className={cn(onSignup && 'shadow-[0_0_18px_hsl(var(--primary)/0.35)]')}
              >
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLinkItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors',
          isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )
      }
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </NavLink>
  );
}
