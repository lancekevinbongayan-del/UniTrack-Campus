"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUniStore } from '@/lib/store';
import Image from 'next/image';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Users, 
  FileBarChart, 
  LogOut, 
  Settings, 
  Loader2,
  CalendarDays
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { auth, logout, isLoaded } = useUniStore();
  const logo = PlaceHolderImages.find(img => img.id === 'logo-placeholder');

  useEffect(() => {
    if (isLoaded && (!auth.isAuthenticated || auth.user?.role !== 'ADMIN')) {
      router.push('/login?admin=true');
    }
  }, [isLoaded, auth, router]);

  if (!isLoaded || !auth.user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { title: 'Visitor Log', icon: CalendarDays, href: '/admin/logs' },
    { title: 'User Management', icon: Users, href: '/admin/users' },
    { title: 'GenAI Reports', icon: FileBarChart, href: '/admin/reports' },
  ];

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" className="border-r border-primary/10">
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-white p-1">
              {logo && (
                <Image 
                  src={logo.imageUrl} 
                  alt="New Era University Logo" 
                  fill 
                  className="object-contain"
                  data-ai-hint="university logo"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-primary font-headline tracking-tight text-sm">NEU UniTrack</span>
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Admin Control</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.href} className="flex items-center px-4 py-2 hover:bg-primary/5 rounded-md transition-colors">
                    <item.icon className="mr-3 w-5 h-5 text-primary" />
                    <span className="font-medium">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t space-y-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => { logout(); router.push('/'); }} className="w-full text-muted-foreground hover:text-destructive">
                <LogOut className="mr-3 w-5 h-5" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="px-2 text-[8px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] text-center">
            © {new Date().getFullYear()} New Era University
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Officer: {auth.user.name}</span>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
