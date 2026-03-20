"use client"

import { useState, useMemo } from 'react';
import { useUniStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, Building2, HelpCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';

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

  // Analytics helper functions
  const totalVisitors = filteredVisits.length;
  
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

          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[180px] bg-transparent border-none">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Departments</SelectItem>
              {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[150px] bg-transparent border-none">
              <SelectValue placeholder="Classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Classes</SelectItem>
              {classifications.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Visitors', value: totalVisitors, icon: Users, color: 'primary', sub: '12% from last ' + period.toLowerCase() },
          { label: 'Unique Users', value: new Set(filteredVisits.map(v => v.userId)).size, icon: TrendingUp, color: 'secondary', sub: 'Verified institutional accounts' },
          { label: 'Avg. Visits/Hr', value: totalVisitors > 0 ? (totalVisitors / (period === 'Day' ? 8 : period === 'Week' ? 40 : 160)).toFixed(1) : 0, icon: Clock, color: 'accent', sub: 'Standard operating hours' },
          { label: 'Top Dept.', value: deptStats[0]?.name || 'N/A', icon: Building2, color: 'primary', sub: (deptStats[0]?.value || 0) + ' visits recorded', isSmall: true },
        ].map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden bg-card/60 border-primary/10 hover:border-primary/30 transition-all duration-300">
            <div className={`absolute top-0 left-0 w-1 h-full bg-${stat.color}`} />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <h3 className={`font-bold mt-1 ${stat.isSmall ? 'text-xl' : 'text-3xl'} truncate max-w-[150px]`}>{stat.value}</h3>
                </div>
                <div className={`p-4 bg-${stat.color}/10 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                {stat.label === 'Total Visitors' && <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />}
                <span className={stat.label === 'Total Visitors' ? 'text-green-500 font-medium' : ''}>{stat.sub}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Activity Chart */}
        <Card className="bg-card/60 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Building2 className="mr-3 w-6 h-6 text-primary" />
              Department Traffic
            </CardTitle>
            <CardDescription>Visual breakdown of visitor traffic across campus units.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
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

        {/* Reason for Visit Chart */}
        <Card className="bg-card/60 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <HelpCircle className="mr-3 w-6 h-6 text-secondary" />
              Purpose of Entry
            </CardTitle>
            <CardDescription>Most common intentions for campus visitors.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ChartContainer config={secondaryChartConfig}>
              <BarChart data={reasonStats.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--secondary) / 0.1)" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={110} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11}} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--secondary) / 0.05)' }} 
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar dataKey="value" fill="var(--color-value)" radius={[0, 6, 6, 0]} barSize={30} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Mini-Log */}
      <Card className="bg-card/60 border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">Live Activity Stream</CardTitle>
          <CardDescription>Continuous feed of institutional visitor check-ins.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredVisits.slice(0, 5).map((visit) => (
              <div key={visit.id} className="flex items-center justify-between p-4 border border-primary/5 rounded-2xl bg-card/40 hover:bg-primary/5 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center font-bold text-primary text-lg shadow-sm">
                    {visit.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{visit.userName}</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Users className="w-3 h-3 mr-1" /> {visit.userEmail}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{visit.department}</Badge>
                  <p className="text-xs text-muted-foreground font-mono">
                    {new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {filteredVisits.length === 0 && (
              <div className="text-center py-12 text-muted-foreground bg-primary/5 rounded-2xl border border-dashed border-primary/20">
                <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
                No activity found for the selected filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}