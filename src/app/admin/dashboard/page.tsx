"use client"

import { useState, useMemo } from 'react';
import { useUniStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, Building2, HelpCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">System Overview</h1>
          <p className="text-muted-foreground">Real-time visitor statistics and institutional analytics.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[120px]">
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Departments</SelectItem>
              {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[150px]">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                <h3 className="text-3xl font-bold mt-1">{totalVisitors}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>12% from last {period.toLowerCase()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Users</p>
                <h3 className="text-3xl font-bold mt-1">{new Set(filteredVisits.map(v => v.userId)).size}</h3>
              </div>
              <div className="p-3 bg-secondary/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <span>Verified institutional accounts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Visits/Hr</p>
                <h3 className="text-3xl font-bold mt-1">
                  {totalVisitors > 0 ? (totalVisitors / (period === 'Day' ? 8 : period === 'Week' ? 40 : 160)).toFixed(1) : 0}
                </h3>
              </div>
              <div className="p-3 bg-accent/10 rounded-full">
                <Clock className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <span>Standard operating hours</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Dept.</p>
                <h3 className="text-xl font-bold mt-1 truncate max-w-[120px]">
                  {deptStats[0]?.name || 'N/A'}
                </h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <span>{deptStats[0]?.value || 0} visits recorded</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 w-5 h-5 text-primary" />
              Visits by Department
            </CardTitle>
            <CardDescription>Breakdown of visitor traffic across campus units.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptStats.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reason for Visit Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2 w-5 h-5 text-secondary" />
              Reasons for Visit
            </CardTitle>
            <CardDescription>Most common purposes for campus entry.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reasonStats.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Mini-Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Visitor Stream</CardTitle>
          <CardDescription>Live feed of latest visitor activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVisits.slice(0, 5).map((visit) => (
              <div key={visit.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {visit.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{visit.userName}</p>
                    <p className="text-xs text-muted-foreground">{visit.userEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">{visit.department}</Badge>
                  <p className="text-xs text-muted-foreground">
                    {new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {filteredVisits.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No activity found for the selected filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}