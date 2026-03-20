"use client"

import { useState } from 'react';
import { useUniStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, FileText, Calendar, Clock, HelpCircle, Building } from 'lucide-react';
import { adminGenerateVisitSummaryReport, AdminGenerateVisitSummaryReportOutput } from '@/ai/flows/admin-generate-visit-summary-report';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function GenAIReports() {
  const { visits } = useUniStore();
  const [reportPeriod, setReportPeriod] = useState('Month');
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<AdminGenerateVisitSummaryReportOutput | null>(null);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    if (visits.length === 0) {
      toast({ title: "No Data", description: "At least one visit record is required to generate a report.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      // Prepare data for GenAI flow
      const flowInput = {
        visits: visits.map(v => ({
          timestamp: v.timestamp,
          reasonForVisit: v.reasonForVisit,
          department: v.department
        })),
        reportPeriod
      };

      const result = await adminGenerateVisitSummaryReport(flowInput);
      setReport(result);
      toast({ title: "Report Generated", description: "AI has successfully summarized the campus visit data." });
    } catch (error) {
      console.error(error);
      toast({ title: "Generation Failed", description: "An error occurred while communicating with the AI service.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Executive Summary</h1>
          <p className="text-muted-foreground">LLM-powered reporting for institutional deans and administrators.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Day">Last 24 Hours</SelectItem>
              <SelectItem value="Week">Last 7 Days</SelectItem>
              <SelectItem value="Month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleGenerateReport} 
            disabled={isGenerating}
            className="bg-secondary hover:bg-secondary/90 text-white"
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Summary
          </Button>
        </div>
      </div>

      {!report && !isGenerating && (
        <Card className="border-dashed py-12">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div className="max-w-md">
              <h3 className="text-xl font-bold">No Report Generated</h3>
              <p className="text-muted-foreground mt-2">
                Click the "Generate Summary" button to analyze campus activity using AI. The system will process recent visit data to identify trends and busiest periods.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card className="py-20">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-secondary" />
              <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">AI Analyst at Work</h3>
              <p className="text-muted-foreground max-w-sm">
                Parsing visit records, identifying peak hours, and synthesizing common reasons for campus visits...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {report && (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-l-4 border-l-primary shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/5 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary text-white">AI Analysis</Badge>
                  <CardTitle>Institutional Summary Report</CardTitle>
                </div>
                <div className="flex items-center text-sm text-muted-foreground bg-white px-3 py-1 rounded-full border">
                  <Calendar className="w-4 h-4 mr-2" /> {reportPeriod} Period
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose max-w-none text-foreground leading-relaxed">
                <p className="text-lg whitespace-pre-wrap">{report.reportSummary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-bold text-primary">
                    <Clock className="w-5 h-5" /> Peak Activity Hours
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.busiestHours.map((hour, i) => (
                      <Badge key={i} variant="outline" className="bg-muted px-3 py-1">{hour}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-bold text-secondary">
                    <HelpCircle className="w-5 h-5" /> Common Reasons
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.mostCommonReasons.map((reason, i) => (
                      <Badge key={i} variant="outline" className="bg-secondary/10 border-secondary/20 text-secondary-foreground px-3 py-1">{reason}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-bold text-accent">
                    <Building className="w-5 h-5" /> Most Visited Units
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.topDepartments.map((dept, i) => (
                      <Badge key={i} variant="outline" className="bg-accent/10 border-accent/20 text-accent-foreground px-3 py-1">{dept}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t py-4 text-xs text-muted-foreground text-center">
              This report was generated using LLM technology based on verified institutional visit logs.
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}