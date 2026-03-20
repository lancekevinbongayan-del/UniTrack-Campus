
"use client"

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useUniStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Building2, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth, useFirestore } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAdmin = searchParams.get('admin') === 'true';
  const { users, login } = useUniStore();
  const auth = useAuth();
  const db = useFirestore();
  const logo = PlaceHolderImages.find(img => img.id === 'logo-placeholder');
  
  const [role, setRole] = useState<'VISITOR' | 'ADMIN'>(initialAdmin ? 'ADMIN' : 'VISITOR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulated network delay
    await new Promise(r => setTimeout(r, 800));

    if (role === 'ADMIN') {
      if (email === 'jcesperanza@neu.edu.ph' && password === 'admin123') {
        const adminUser = users.find(u => u.email === email);
        if (adminUser) {
          try {
            const userCredential = await signInAnonymously(auth);
            const sessionId = Math.random().toString(36).substr(2, 9);
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            // Create real-time session in Firestore
            await setDoc(doc(db, 'user_sessions', sessionId), {
              id: sessionId,
              userId: userCredential.user.uid,
              userName: adminUser.name,
              userEmail: adminUser.email,
              loginTime: new Date().toISOString(),
              isActive: true,
              deviceId: isMobile ? 'Mobile Device' : 'Desktop/Web',
            });

            login(adminUser, sessionId);
            router.push('/admin/dashboard');
            return;
          } catch (err: any) {
            setError('System authentication failure: ' + err.message);
          }
        }
      }
      setError('Invalid administrative credentials.');
    } else {
      // Restricted to institutional domain
      if (!email.endsWith('@neu.edu.ph')) {
        setError('Institutional email domain required (@neu.edu.ph).');
      } else {
        const existingUser = users.find(u => u.email === email);
        if (existingUser?.isBlocked) {
          setError('This account has been blocked.');
        } else {
          try {
            const userCredential = await signInAnonymously(auth);
            const sessionId = Math.random().toString(36).substr(2, 9);
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            const newUser = existingUser || {
              id: userCredential.user.uid,
              name: email.split('@')[0],
              email,
              role: 'VISITOR',
              classification: 'Student',
              isBlocked: false,
            };

            // Create real-time session in Firestore
            await setDoc(doc(db, 'user_sessions', sessionId), {
              id: sessionId,
              userId: userCredential.user.uid,
              userName: newUser.name,
              userEmail: newUser.email,
              loginTime: new Date().toISOString(),
              isActive: true,
              deviceId: isMobile ? 'Mobile Device' : 'Desktop/Web',
            });

            login(newUser as any, sessionId);
            router.push('/visitor/check-in');
          } catch (err: any) {
            setError('System authentication failure: ' + err.message);
          }
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0c10]">
      <Card className="max-w-[440px] w-full bg-[#12141c] border-none shadow-2xl p-8 rounded-[2rem]">
        <CardContent className="p-0 space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            {logo && (
              <div className="relative w-16 h-16 overflow-hidden bg-transparent">
                <Image 
                  src={logo.imageUrl} 
                  alt="New Era University Logo" 
                  fill 
                  className="object-contain"
                  data-ai-hint="university logo"
                />
              </div>
            )}
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white tracking-tight">Identity Access</h1>
              <p className="text-muted-foreground text-sm font-medium">Authentication via @neu.edu.ph system.</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          {/* Role Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('VISITOR')}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all duration-300 ${
                role === 'VISITOR' 
                ? 'bg-primary shadow-[0_8px_24px_rgba(59,130,246,0.3)] text-white' 
                : 'bg-[#1a1d27] text-muted-foreground hover:bg-[#222632]'
              }`}
            >
              <GraduationCap className={`w-8 h-8 ${role === 'VISITOR' ? 'text-white' : 'text-muted-foreground'}`} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Visitor</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all duration-300 ${
                role === 'ADMIN' 
                ? 'bg-primary shadow-[0_8px_24px_rgba(59,130,246,0.3)] text-white' 
                : 'bg-[#1a1d27] text-muted-foreground hover:bg-[#222632]'
              }`}
            >
              <Building2 className={`w-8 h-8 ${role === 'ADMIN' ? 'text-white' : 'text-muted-foreground'}`} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Admin</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">NEU Institutional Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b949e] group-focus-within:text-primary transition-colors" />
                <Input 
                  type="email" 
                  placeholder="jcesperanza@neu.edu.ph" 
                  className="pl-12 h-14 bg-[#e8f0fe] border-none text-black rounded-xl focus-visible:ring-2 focus-visible:ring-primary placeholder:text-[#8b949e]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            {role === 'ADMIN' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Admin Password</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  className="h-14 bg-[#1a1d27] border-none text-white rounded-xl focus-visible:ring-2 focus-visible:ring-primary placeholder:text-muted-foreground/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl text-md font-bold shadow-[0_8px_24px_rgba(59,130,246,0.2)] transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Verify & Continue
            </Button>
          </form>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center space-y-1">
        <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} New Era University
        </p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0c10]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
