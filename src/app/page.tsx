"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, ShieldCheck, UserCheck } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-campus');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">
              UniTrack <span className="text-secondary">Campus Visitor</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome to the institutional campus visitor management system. Securely check-in and explore our campus facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Card className="check-in-card hover:border-secondary transition-all cursor-pointer">
              <Link href="/login" className="block p-2">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                    <UserCheck className="text-secondary w-5 h-5" />
                  </div>
                  <CardTitle className="text-xl">Visitor Access</CardTitle>
                  <CardDescription>Check-in for your campus visit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
                    Institutional Login <LogIn className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="check-in-card hover:border-primary transition-all cursor-pointer">
              <Link href="/login?admin=true" className="block p-2">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <ShieldCheck className="text-primary w-5 h-5" />
                  </div>
                  <CardTitle className="text-xl">Administrator Portal</CardTitle>
                  <CardDescription>Manage visits and view analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                    Admin Login
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute -inset-4 bg-secondary/10 rounded-full blur-3xl" />
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src={heroImage?.imageUrl || "https://picsum.photos/seed/campus/600/800"}
              alt="Campus"
              width={600}
              height={800}
              className="object-cover w-full h-[500px]"
              data-ai-hint="university building"
            />
          </div>
        </div>
      </div>

      <footer className="mt-16 text-muted-foreground text-sm font-medium">
        © {new Date().getFullYear()} UniTrack Campus Visitor System. All institutional rights reserved.
      </footer>
    </div>
  );
}