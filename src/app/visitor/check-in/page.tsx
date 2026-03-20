
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUniStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Loader2, LogOut, ArrowRight, Library, Building2, GraduationCap, Briefcase, MapPin, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';

const DEPARTMENTS = [
  'College of Agriculture',
  'College of Arts and Sciences',
  'College of Business Administration',
  'College of Communication',
  'College of Computer Studies',
  'College of Criminology',
  'College of Education',
  'College of Engineering and Architecture',
  'College of Law',
  'College of Medical Technology',
  'College of Music',
  'College of Nursing',
  'College of Physical Therapy',
  'School of Graduate Studies',
  'Integrated School',
  'Admissions Office',
  'Registrar',
  'University Library',
  'Guidance and Counseling',
  'Student Affairs',
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

const FACILITIES = [
  { id: 'library', name: 'University Library', subtitle: 'RESOURCE CENTER', icon: Library },
  { id: 'office', name: "Dean's Office", subtitle: 'ADMINISTRATION', icon: Building2 },
];

const CLASSIFICATIONS = [
  { id: 'Student', label: 'Student', icon: GraduationCap },
  { id: 'Employee', label: 'Employee', icon: Briefcase },
];

export default function VisitorCheckIn() {
  const router = useRouter();
  const { auth, logout, isLoaded, currentSessionId } = useUniStore();
  const { toast } = useToast();
  const db = useFirestore();
  
  const [selectedFacility, setSelectedFacility] = useState('library');
  const [department, setDepartment] = useState('');
  const [reason, setReason] = useState('');
  const [classification, setClassification] = useState('Student');
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
    
    const facilityName = FACILITIES.find(f => f.id === selectedFacility)?.name || 'Unknown';

    try {
      // Record visit in Firestore
      await addDoc(collection(db, 'visits'), {
        userId: auth.user!.id,
        userEmail: auth.user!.email,
        userName: auth.user!.name,
        department: `${facilityName} - ${department}`,
        reasonForVisit: reason,
        classification,
        timestamp: new Date().toISOString(),
      });

      setHasCheckedIn(true);
      toast({ title: "Check-in Successful", description: "Your visit has been recorded. Welcome to the campus!" });
    } catch (err) {
      console.error('Failed to record visit:', err);
      toast({ variant: 'destructive', title: "Error", description: "System failure recording visit." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (currentSessionId && db) {
      try {
        await updateDoc(doc(db, 'user_sessions', currentSessionId), {
          isActive: false,
          logoutTime: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Failed to close session:', err);
      }
    }
    logout();
    router.push('/');
  };

  if (hasCheckedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0c10]">
        <Card className="max-w-md w-full text-center p-4 border-none bg-[#12141c] shadow-2xl rounded-[2rem]">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-white font-bold">Welcome to NEU Library!</CardTitle>
            <CardDescription className="text-lg text-[#8b949e]">
              Thank you, {auth.user.name}. Your entry has been logged.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[#1a1d27] border border-primary/10 p-4 rounded-xl text-sm text-left text-white">
              <p className="flex justify-between py-1 border-b border-primary/5"><strong>Classification:</strong> <span>{classification}</span></p>
              <p className="flex justify-between py-1 border-b border-primary/5"><strong>Department:</strong> <span>{department}</span></p>
              <p className="flex justify-between py-1"><strong>Time:</strong> <span>{new Date().toLocaleTimeString()}</span></p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button onClick={handleLogout} variant="outline" className="w-full border-primary/20 hover:bg-primary/5 text-white">
              Logout <LogOut className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0c10] text-white">
      <div className="max-w-4xl w-full mb-12 text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Facility Check-in</h1>
        <p className="text-[#8b949e]">Secure real-time institutional logging.</p>
      </div>

      <div className="max-w-4xl w-full space-y-8">
        {/* Facility Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FACILITIES.map((fac) => (
            <button
              key={fac.id}
              onClick={() => setSelectedFacility(fac.id)}
              className={cn(
                "relative group flex flex-col items-center justify-center p-12 rounded-[2rem] transition-all duration-300 border-2",
                selectedFacility === fac.id 
                ? "bg-[#12141c] border-primary shadow-[0_0_30px_rgba(59,130,246,0.2)]" 
                : "bg-[#12141c]/50 border-transparent hover:border-primary/30"
              )}
            >
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300",
                selectedFacility === fac.id ? "bg-primary shadow-[0_8px_24px_rgba(59,130,246,0.3)]" : "bg-[#1a1d27]"
              )}>
                <fac.icon className={cn("w-10 h-10", selectedFacility === fac.id ? "text-white" : "text-muted-foreground")} />
              </div>
              <h3 className="text-2xl font-bold">{fac.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e] mt-2">{fac.subtitle}</p>
              
              {selectedFacility === fac.id && (
                <div className="absolute bottom-6 right-6 w-6 h-6 rounded-full bg-primary border-2 border-primary flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Visit Details Section */}
        <Card className="bg-[#12141c] border-none rounded-[2rem] p-8">
          <CardHeader className="p-0 mb-10 flex flex-row items-center gap-4 space-y-0">
            <div className="w-12 h-12 rounded-2xl bg-[#1a1d27] flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Visit Details</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e]">
                TARGET: <span className="text-primary">{FACILITIES.find(f => f.id === selectedFacility)?.id === 'library' ? 'LIBRARY' : 'OFFICE'}</span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Classification */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-[0.2em]">Classification</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CLASSIFICATIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setClassification(c.id)}
                      className={cn(
                        "flex items-center gap-4 p-6 rounded-2xl transition-all duration-300 border-2",
                        classification === c.id 
                        ? "bg-[#1a1d27] border-primary text-white" 
                        : "bg-[#1a1d27]/40 border-transparent text-[#8b949e] hover:bg-[#1a1d27]/60"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        classification === c.id ? "bg-primary text-white" : "bg-[#12141c]"
                      )}>
                        <c.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-[0.2em]">College Department</label>
                  <Select onValueChange={setDepartment} value={department}>
                    <SelectTrigger className="h-16 bg-[#0a0c10] border-none rounded-xl text-white px-6 focus:ring-2 focus:ring-primary">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#12141c] border-primary/20 text-white">
                      {DEPARTMENTS.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-[0.2em]">Primary Reason</label>
                  <Select onValueChange={setReason} value={reason}>
                    <SelectTrigger className="h-16 bg-[#0a0c10] border-none rounded-xl text-white px-6 focus:ring-2 focus:ring-primary">
                      <SelectValue placeholder="Purpose of visit" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#12141c] border-primary/20 text-white">
                      {REASONS.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-20 bg-[#254b8c] hover:bg-[#2c58a3] text-white text-lg font-bold uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(37,75,140,0.3)] transition-all active:scale-[0.98]"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
                Confirm Entry
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-center w-full text-muted-foreground">
              Information collected will be used strictly for institutional security and analytics purposes.
            </p>
          </CardFooter>
        </Card>

        <div className="flex justify-center">
          <Button variant="ghost" onClick={handleLogout} className="text-[#8b949e] hover:text-white hover:bg-white/5">
            <LogOut className="mr-2 w-4 h-4" /> Logout Session
          </Button>
        </div>
      </div>
    </div>
  );
}
