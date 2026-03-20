
"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, CalendarDays, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export default function VisitorLogs() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const db = useFirestore();

  const visitsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'visits'), orderBy('timestamp', 'desc'));
  }, [db]);

  const { data: visits, isLoading } = useCollection(visitsQuery);

  const filteredVisits = useMemo(() => {
    if (!visits) return [];
    return visits.filter(v => {
      const matchesSearch = v.userName.toLowerCase().includes(search.toLowerCase()) || 
                           v.userEmail.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === 'All' || v.department.includes(deptFilter);
      return matchesSearch && matchesDept;
    });
  }, [visits, search, deptFilter]);

  const departments = useMemo(() => {
    if (!visits) return [];
    return Array.from(new Set(visits.map(v => v.department.split(' - ').pop() || v.department)));
  }, [visits]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Visitor Logs</h1>
        <p className="text-muted-foreground">Full historical record of campus check-ins.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <CardTitle>History</CardTitle>
            </div>
            <div className="flex gap-2">
              <div className="relative w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search visitor..." 
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>Comprehensive list of all successful visitor check-ins.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" /> Retrieving live logs...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredVisits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No visit records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVisits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{visit.userName}</p>
                          <p className="text-xs text-muted-foreground">{visit.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{visit.classification}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{visit.department}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm italic text-muted-foreground">{visit.reasonForVisit}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p className="font-medium">{new Date(visit.timestamp).toLocaleDateString()}</p>
                          <p className="text-muted-foreground">{new Date(visit.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
