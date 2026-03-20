"use client"

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUniStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdminRequest = searchParams.get('admin') === 'true';
  const { users, login } = useUniStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    if (isAdminRequest) {
      if (email === 'jcesperanza@neu.edu.ph' && password === 'admin123') {
        const adminUser = users.find(u => u.email === email);
        if (adminUser) {
          login(adminUser);
          router.push('/admin/dashboard');
          return;
        }
      }
      setError('Invalid administrative credentials. Please check your email and password.');
    } else {
      // Restricted to institutional domain
      if (!email.endsWith('@neu.edu.ph')) {
        setError('Institutional email domain required. Please use your @neu.edu.ph account.');
      } else {
        const existingUser = users.find(u => u.email === email);
        if (existingUser?.isBlocked) {
          setError('This account has been blocked. Please contact the administrator.');
        } else {
          const user = existingUser || {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email,
            role: 'VISITOR',
            classification: 'Student',
            isBlocked: false,
          };
          login(user as any);
          router.push('/visitor/check-in');
        }
      }
    }
    setIsLoading(false);
  };

  const handleGoogleMock = () => {
    // In a real app, this triggers Google OAuth
    setEmail('visitor@neu.edu.ph');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-md w-full shadow-lg border-primary/10">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-primary flex items-center hover:underline">
              <ArrowLeft className="mr-1 w-4 h-4" /> Back
            </Link>
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-center">
            {isAdminRequest ? 'Admin Sign-In' : 'Visitor Sign-In'}
          </CardTitle>
          <CardDescription className="text-center">
            {isAdminRequest 
              ? 'Enter your administrative credentials to access the portal' 
              : 'Sign in with your institutional email account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@neu.edu.ph" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            {isAdminRequest && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            )}

            {!isAdminRequest && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className={`w-full ${isAdminRequest ? 'bg-primary' : 'bg-secondary'} text-white`}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              {isAdminRequest ? 'Authenticate' : 'Institutional Sign-In'}
            </Button>

            {!isAdminRequest && !isLoading && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full border-secondary text-secondary hover:bg-secondary/5"
                onClick={handleGoogleMock}
              >
                Mock Google Account
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-center text-muted-foreground">
            {isAdminRequest 
              ? 'Restricted to authorized personnel only.' 
              : 'Institutional login restricted to @neu.edu.ph domain.'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
