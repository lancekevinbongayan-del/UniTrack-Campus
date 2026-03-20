"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const logo = PlaceHolderImages.find(img => img.id === 'logo-placeholder');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[60%] -right-[5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-1">
        <div className="space-y-8 z-10 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Official NEU Institutional Portal</span>
            </div>
            
            <div className="flex flex-col items-center lg:items-start space-y-4">
              {logo && (
                <div className="relative w-24 h-24 mb-2 bg-transparent p-0 rounded-2xl">
                  <Image 
                    src={logo.imageUrl} 
                    alt="New Era University Logo" 
                    fill 
                    className="object-contain"
                    data-ai-hint="university logo"
                  />
                </div>
              )}
              <h1 className="text-5xl md:text-6xl font-headline font-bold text-foreground tracking-tight leading-tight">
                UniTrack <span className="text-primary">Campus</span> <br />
                <span className="text-secondary">Visitor Management</span>
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
              Welcome to the New Era University visitor gateway. Secure, efficient, and integrated institutional check-in services.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto lg:mx-0">
            <Card className="check-in-card bg-card/50 backdrop-blur-sm border-primary/20">
              <Link href="/login" className="block p-2 h-full">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4 border border-secondary/30">
                    <UserCheck className="text-secondary w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Visitor</CardTitle>
                  <CardDescription className="text-muted-foreground/80">Check-in for your visit</CardDescription>
                </CardHeader>
                <CardContent className="mt-4">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/20 font-bold">
                    SIGN IN <LogIn className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="check-in-card bg-card/50 backdrop-blur-sm border-primary/20">
              <Link href="/login?admin=true" className="block p-2 h-full">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 border border-primary/30">
                    <ShieldCheck className="text-primary w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Admin</CardTitle>
                  <CardDescription className="text-muted-foreground/80">Institutional Oversight</CardDescription>
                </CardHeader>
                <CardContent className="mt-4">
                  <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10 font-bold">
                    ADMIN PORTAL
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>

        {/* Splash Art */}
        <div className="relative hidden lg:flex items-center justify-center min-h-[500px] splash-art-container">
          <svg
            viewBox="0 0 500 500"
            className="w-full max-w-md h-auto drop-shadow-2xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="250" cy="250" r="180" stroke="url(#paint0_linear)" strokeWidth="2" strokeDasharray="10 10" />
            <circle cx="250" cy="250" r="140" stroke="url(#paint1_linear)" strokeWidth="4" />
            <path
              d="M250 50V110M250 390V450M50 250H110M390 250H450"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <g className="animate-pulse">
              <rect x="235" y="235" width="30" height="30" rx="4" fill="hsl(var(--primary))" />
              <rect x="230" y="230" width="40" height="40" rx="6" stroke="hsl(var(--primary))" strokeOpacity="0.3" />
            </g>
            <path
              d="M150 150L210 210M290 290L350 350M350 150L290 210M210 290L150 350"
              stroke="hsl(var(--secondary))"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="paint0_linear" x1="250" y1="70" x2="250" y2="430" gradientUnits="userSpaceOnUse">
                <stop stopColor="hsl(var(--primary))" />
                <stop offset="1" stopColor="hsl(var(--secondary))" />
              </linearGradient>
              <linearGradient id="paint1_linear" x1="250" y1="110" x2="250" y2="390" gradientUnits="userSpaceOnUse">
                <stop stopColor="hsl(var(--secondary))" />
                <stop offset="1" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Floating Accents */}
          <div className="absolute top-[15%] right-[10%] w-16 h-16 bg-primary/20 rounded-full blur-xl animate-bounce duration-[3000ms]" />
          <div className="absolute bottom-[20%] left-[5%] w-12 h-12 bg-secondary/20 rounded-full blur-xl animate-bounce duration-[4000ms]" />
        </div>
      </div>

      <footer className="mt-16 pb-8 text-center space-y-2 z-10">
        <p className="text-muted-foreground/60 text-sm font-medium">
          © {new Date().getFullYear()} New Era University. All institutional rights reserved.
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
          <span>UniTrack System</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span>Property of NEU</span>
        </div>
      </footer>
    </div>
  );
}
