"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUniStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Loader2, LogOut, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DEPARTMENTS = [
  'College of Engineering',
  'College of Computer Science',
  'College of Business',
  'College of Arts and Sciences',
  'College of Education',
  'Graduate School',
  'Library',
  'Admissions Office',
  'Registrar',
  'Other'
];

const REASONS = [
  'Academic Advising',
  'Library Research',
  'Class Attendance',
  'Document Request',
  'Meeting',
  'Inquiry',
  'Other'
];

const CLASSIFICATIONS = [
  'Student',
  'Faculty',
  'Guest',
  'Staff'
];

export default function VisitorCheckIn() {
  const router = useRouter();
  const { auth, logout, addVisit, isLoaded } = useUniStore();
  const { toast } = useToast();
  
  const [department, setDepartment] = useState('');
  const [reason, setReason] = useState('');
  const [classification, setClassification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  useEffect(() => {
    if (isLoaded && !auth.isAuthenticated) {
      router.push('/login');
    }
  }, [isLoaded, auth, router]);

  if (!isLoaded || !auth.user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !reason || !classification) {
      toast({ title: "Incomplete Form", description: "Please fill out all fields before checking in." });
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    addVisit({
      userId: auth.user!.id,
      userEmail: auth.user!.email,
      userName: auth.user!.name,
      department,
      reasonForVisit: reason,
      classification
    });

    setIsSubmitting(false);
    setHasCheckedIn(true);
    toast({ title: "Check-in Successful", description: "Your visit has been recorded. Welcome to the campus!" });
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (hasCheckedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full text-center p-4">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-primary">Check-in Completed</CardTitle>
            <CardDescription className="text-lg">
              Thank you, {auth.user.name}. Your entry has been logged.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-sm text-left">
              <p><strong>Department:</strong> {department}</p>
              <p><strong>Reason:</strong> {reason}</p>
              <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Logout <LogOut className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xs">UT</span>
          </div>
          <span className="font-bold text-primary">UniTrack</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
          <LogOut className="mr-2 w-4 h-4" /> Logout
        </Button>
      </div>

      <Card className="max-w-md w-full shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl font-headline font-bold text-primary">Visitor Check-in</CardTitle>
          <CardDescription>
            Please provide details about your campus visit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="classification">Visitor Classification</Label>
              <Select onValueChange={setClassification} value={classification}>
                <SelectTrigger id="classification">
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSIFICATIONS.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">College Department</Label>
              <Select onValueChange={setDepartment} value={department}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Select onValueChange={setReason} value={reason}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {REASONS.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-secondary hover:bg-secondary/90 text-white py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
              Complete Check-in
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center w-full text-muted-foreground">
            Information collected will be used strictly for institutional security and analytics purposes.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}