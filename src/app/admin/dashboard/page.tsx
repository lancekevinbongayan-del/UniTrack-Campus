"use client"

import { useState, useMemo } from 'react';
import { useUniStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, Building2, HelpCircle, ArrowUpRight, TrendingUp, Monitor, Smartphone, Activity, Loader2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

const chartConfig = {
  value: {
    label: "Visits",
    theme: {
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))",
    },
  },
} satisfies ChartConfig;

const secondaryChartConfig = {
  value: {
    label: "Visits",
    theme: {
      light: "hsl(var(--secondary))",
      dark: "hsl(var(--secondary))",
    },
  },
} satisfies ChartConfig;

export default function AdminDashboard() {
  const { visits } = useUniStore();
  const [period, setPeriod] = useState('Day');
  const [deptFilter, setDeptFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const db = useFirestore();

  // Real-time Active Sessions from Firestore
  const activeSessionsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'user_sessions'), where('isActive', '==', true));
  }, [db]);
  
  const { data: activeSessions, isLoading: sessionsLoading } = useCollection(activeSessionsQuery);

  const filteredVisits = useMemo(() => {
    let result = visits;
    const now = new Date();

    if (period === 'Day') {
      result = result.filter(v => {
        const d = new Date(v.timestamp);
        return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (period === 'Week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(v => new Date(v.timestamp) >= oneWeekAgo);
    } else if (period === 'Month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter(v => new Date(v.timestamp) >= oneMonthAgo);
    }

    if (deptFilter !== 'All') {
      result = result.filter(v => v.department === deptFilter);
    }

    if (classFilter !== 'All') {
      result = result.filter(v => v.classification === classFilter);
    }

    return result;
  }, [visits, period, deptFilter, classFilter]);

  const deptStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredVisits.forEach(v => {
      counts[v.department] = (counts[v.department] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filteredVisits]);

  const reasonStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredVisits.forEach(v => {
      counts[v.reasonForVisit] = (counts[v.reasonForVisit] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filteredVisits]);

  const departments = Array.from(new Set(visits.map(v => v.department)));
  const classifications = Array.from(new Set(visits.map(v => v.classification)));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">System Overview</h1>
          <p className="text-muted-foreground text-lg">Real-time visitor statistics and institutional analytics.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 bg-card/40 p-2 rounded-xl border border-primary/10">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[120px] bg-transparent border-none">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Day">Today</SelectItem>
              <SelectItem value="Week">This Week</SelectItem>
              <SelectItem value="Month">This Month</SelectItem>
              <SelectItem value="All">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Session Monitor */}
        <Card className="lg:col-span-1 bg-card/60 border-primary/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
            <div className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Activity className="mr-3 w-6 h-6 text-green-500" />
              Active Sessions
            </CardTitle>
            <CardDescription>Live monitoring of institutional access points.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : activeSessions?.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground bg-primary/5 rounded-2xl border border-dashed border-primary/20">
                No active users detected.
              </div>
            ) : (
              activeSessions?.map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-3 border border-primary/5 rounded-xl bg-card/40 hover:bg-primary/5 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                      {session.userName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{session.userName}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center">
                        {session.deviceId === 'Mobile Device' ? <Smartphone className="w-3 h-3 mr-1" /> : <Monitor className="w-3 h-3 mr-1" />}
                        {session.deviceId}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20">LIVE</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Department Activity Chart */}
        <Card className="lg:col-span-2 bg-card/60 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Building2 className="mr-3 w-6 h-6 text-primary" />
              Department Traffic
            </CardTitle>
            <CardDescription>Visual breakdown of visitor traffic across campus units.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] pt-4">
            <ChartContainer config={chartConfig}>
              <BarChart data={deptStats.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--primary) / 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--primary) / 0.05)' }} 
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Visitors', value: filteredVisits.length, icon: Users, color: 'primary', sub: 'Calculated Period: ' + period },
          { label: 'Active Sessions', value: activeSessions?.length || 0, icon: Activity, color: 'green-500', sub: 'Live Connections' },
          { label: 'Mobile Users', value: activeSessions?.filter((s: any) => s.deviceId === 'Mobile Device').length || 0, icon: Smartphone, color: 'secondary', sub: 'Handheld access' },
          { label: 'Desktop Users', value: activeSessions?.filter((s: any) => s.deviceId === 'Desktop/Web').length || 0, icon: Monitor, color: 'accent', sub: 'Stationary access' },
        ].map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden bg-card/60 border-primary/10 hover:border-primary/30 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <h3 className="font-bold mt-1 text-3xl">{stat.value}</h3>
                </div>
                <div className={`p-4 bg-primary/10 rounded-2xl`}>
                  <stat.icon className={`w-6 h-6 text-primary`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span>{stat.sub}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
