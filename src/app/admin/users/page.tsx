"use client"

import { useState } from 'react';
import { useUniStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserMinus, UserCheck, ShieldAlert, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function UserManagement() {
  const { users, blockUser } = useUniStore();
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleBlockToggle = (id: string, name: string, isBlocked: boolean) => {
    blockUser(id);
    toast({
      title: isBlocked ? "User Restored" : "User Restricted",
      description: `${name} has been ${isBlocked ? 'unblocked' : 'blocked'} from the system.`,
      variant: isBlocked ? "default" : "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">User Management</h1>
          <p className="text-muted-foreground">Manage institutional accounts and access permissions.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Directory</CardTitle>
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>Search and manage status for all registered institutional users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${user.isBlocked ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="w-3 h-3 mr-1" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.classification}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{user.role}</span>
                    </TableCell>
                    <TableCell>
                      {user.isBlocked ? (
                        <Badge variant="destructive" className="flex items-center w-fit">
                          <ShieldAlert className="w-3 h-3 mr-1" /> Restricted
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role !== 'ADMIN' && (
                        <Button 
                          variant={user.isBlocked ? "outline" : "destructive"} 
                          size="sm"
                          onClick={() => handleBlockToggle(user.id, user.name, user.isBlocked)}
                        >
                          {user.isBlocked ? (
                            <><UserCheck className="w-4 h-4 mr-1" /> Restore</>
                          ) : (
                            <><UserMinus className="w-4 h-4 mr-1" /> Block User</>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}