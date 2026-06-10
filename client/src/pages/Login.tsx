import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { loginSchema, type LoginInput } from '@/schemas/auth';
import { api, apiErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@/types';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await api.post<{ token: string; user: User }>('/api/auth/login', input);
      return data;
    },
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      const to = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/analyze';
      navigate(to, { replace: true });
    },
    onError: (err) => {
      const status = (err as AxiosError)?.response?.status;
      if (status === 401) {
        toast.error('Account does not exist with these credentials, please try again');
      } else {
        toast.error(apiErrorMessage(err, 'Login failed'));
      }
    },
  });

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md items-center px-4">
      <Card className="w-full">
        <CardContent className="p-8">
          <h1 className="font-serif text-3xl italic">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Log in to analyze your resume.</p>

          <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((d) => mutate(d))}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" {...form.register('password')} />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Logging in…' : 'Log in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{' '}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
