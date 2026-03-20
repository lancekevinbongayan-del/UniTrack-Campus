
"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Building2, HelpCircle, Smartphone, Monitor, Activity, Loader2, Filter, History } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';

const chartConfig = {
  value: {
    label: "Visits",
    theme: {
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))",
    },
  },
} satisfies ChartConfig;

export default function AdminDashboard() {
  const [period, setPeriod] = useState('Day');
  const [deptFilter, setDeptFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const [reasonFilter, setReasonFilter] = useState('All');
  const db = useFirestore();

  // Real-time Active Sessions from Firestore
  const activeSessionsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'user_sessions'), where('isActive', '==', true));
  }, [db]);
  
  const { data: activeSessions, isLoading: sessionsLoading } = useCollection(activeSessionsQuery);

  // Real-time Visits from Firestore
  const visitsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'visits'), orderBy('timestamp', 'desc'));
  }, [db]);

  const { data: rawVisits, isLoading: visitsLoading } = useCollection(visitsQuery);

  const filteredVisits = useMemo(() => {
    if (!rawVisits) return [];
    let result = rawVisits;
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
      result = result.filter(v => v.department.includes(deptFilter));
    }

    if (classFilter !== 'All') {
      result = result.filter(v => v.classification === classFilter);
    }

    if (reasonFilter !== 'All') {
      result = result.filter(v => v.reasonForVisit === reasonFilter);
    }

    return result;
  }, [rawVisits, period, deptFilter, classFilter, reasonFilter]);

  const deptStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredVisits.forEach(v => {
      const dept = v.department.split(' - ').pop() || v.department;
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filteredVisits]);

  const departments = useMemo(() => {
    if (!rawVisits) return [];
    return Array.from(new Set(rawVisits.map(v => v.department.split(' - ').pop() || v.department)));
  }, [rawVisits]);

  const classifications = useMemo(() => {
    if (!rawVisits) return [];
    return Array.from(new Set(rawVisits.map(v => v.classification)));
  }, [rawVisits]);

  const reasons = useMemo(() => {
    if (!rawVisits) return [];
    return Array.from(new Set(rawVisits.map(v => v.reasonForVisit)));
  }, [rawVisits]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">System Overview</h1>
          <p className="text-muted-foreground text-lg">Real-time visitor statistics and institutional analytics.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 bg-card/40 p-3 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-2 px-2 text-primary">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
          </div>
          
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[130px] h-9 bg-background/50 border-primary/20">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Day">Today</SelectItem>
              <SelectItem value="Week">This Week</SelectItem>
              <SelectItem value="Month">This Month</SelectItem>
              <SelectItem value="All">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[160px] h-9 bg-background/50 border-primary/20">
              <SelectValue placeholder="All Colleges" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Departments</SelectItem>
              {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[140px] h-9 bg-background/50 border-primary/20">
              <SelectValue placeholder="Classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Users</SelectItem>
              {classifications.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={reasonFilter} onValueChange={setReasonFilter}>
            <SelectTrigger className="w-[160px] h-9 bg-background/50 border-primary/20">
              <SelectValue placeholder="Reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Reasons</SelectItem>
              {reasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Session Monitor */}
        <Card className="lg:col-span-1 bg-card/60 border-primary/10 overflow-hidden relative shadow-xl">
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
          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
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

        {/* Real-time Recent Visits Log */}
        <Card className="lg:col-span-2 bg-card/60 border-primary/10 shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <History className="mr-3 w-6 h-6 text-primary" />
              Recent Visits
            </CardTitle>
            <CardDescription>Live log of visitor entries across all campus units.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto p-0">
            {visitsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : filteredVisits.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No recent activity recorded.
              </div>
            ) : (
              <div className="divide-y divide-primary/5">
                {filteredVisits.slice(0, 10).map((visit: any) => (
                  <div key={visit.id} className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary text-sm">
                        {visit.userName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{visit.userName}</p>
                        <p className="text-xs text-muted-foreground">{visit.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{visit.reasonForVisit}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(visit.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Traffic Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Calculated Visits', value: filteredVisits.length, icon: Users, color: 'primary', sub: 'Based on current filters' },
          { label: 'Live Connections', value: activeSessions?.length || 0, icon: Activity, color: 'green-500', sub: 'Across all devices' },
          { label: 'Primary Department', value: deptStats[0]?.name || 'None', icon: Building2, color: 'secondary', sub: 'Most visited in period' },
          { label: 'Frequent Purpose', value: reasonFilter === 'All' ? 'Mixed' : reasonFilter, icon: HelpCircle, color: 'accent', sub: 'Primary visit reason' },
        ].map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden bg-card/60 border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="max-w-[150px]">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">{stat.label}</p>
                  <h3 className="font-bold mt-1 text-2xl truncate">{stat.value}</h3>
                </div>
                <div className={`p-3 bg-primary/10 rounded-2xl`}>
                  <stat.icon className={`w-5 h-5 text-primary`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span className="truncate">{stat.sub}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Activity Chart */}
      <Card className="bg-card/60 border-primary/10 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Building2 className="mr-3 w-6 h-6 text-primary" />
            Institutional Traffic Breakdown
          </CardTitle>
          <CardDescription>Visual breakdown of activity across campus units based on current filters.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] pt-4">
          <ChartContainer config={chartConfig}>
            <BarChart data={deptStats.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--primary) / 0.1)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
              <ChartTooltip 
                cursor={{ fill: 'hsl(var(--primary) / 0.05)' }} 
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
