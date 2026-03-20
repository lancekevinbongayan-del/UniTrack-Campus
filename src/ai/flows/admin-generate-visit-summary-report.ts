'use server';
/**
 * @fileOverview A Genkit flow for generating a summary report of campus visits.
 *
 * - adminGenerateVisitSummaryReport - A function that generates a campus visit summary report.
 * - AdminGenerateVisitSummaryReportInput - The input type for the adminGenerateVisitSummaryReport function.
 * - AdminGenerateVisitSummaryReportOutput - The return type for the adminGenerateVisitSummaryReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AdminGenerateVisitSummaryReportInputSchema = z.object({
  visits: z.array(
    z.object({
      timestamp: z.string().describe('ISO 8601 timestamp of the visit (e.g., "2023-10-27T10:30:00Z")'),
      reasonForVisit: z.string().describe('The reason for the campus visit.'),
      department: z.string().describe('The department visited.'),
    })
  ).describe('A list of campus visit records for a specific period.'),
  reportPeriod: z.string().describe('The period for which the report is being generated (e.g., "Day", "Week", "Month").'),
});
export type AdminGenerateVisitSummaryReportInput = z.infer<typeof AdminGenerateVisitSummaryReportInputSchema>;

// Output Schema
const AdminGenerateVisitSummaryReportOutputSchema = z.object({
  reportSummary: z.string().describe('A comprehensive summary of the campus visit report, including overall trends.'),
  busiestHours: z.array(z.string()).describe('A list of the busiest hours of the day, e.g., ["10:00 AM - 11:00 AM", "01:00 PM - 02:00 PM"].'),
  mostCommonReasons: z.array(z.string()).describe('A list of the most common reasons for visits, e.g., ["Academic Advising", "Library Research"].'),
  topDepartments: z.array(z.string()).describe('A list of the top departments visited, e.g., ["Computer Science", "Biology"].'),
});
export type AdminGenerateVisitSummaryReportOutput = z.infer<typeof AdminGenerateVisitSummaryReportOutputSchema>;

// Prompt definition
const adminGenerateVisitSummaryReportPrompt = ai.definePrompt({
  name: 'adminGenerateVisitSummaryReportPrompt',
  input: {schema: AdminGenerateVisitSummaryReportInputSchema},
  output: {schema: AdminGenerateVisitSummaryReportOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing campus visit data to generate summary reports for deans.
Your task is to analyze the provided list of campus visits for the {{reportPeriod}} and extract key insights.
Identify the busiest hours of the day, the most common reasons visitors came to campus, and the departments that received the most visits.
Structure your output strictly as a JSON object matching the provided schema, including a comprehensive narrative summary in 'reportSummary'.

Campus Visit Data for {{reportPeriod}}:
{{#each visits}}
- Timestamp: {{{timestamp}}}, Reason for Visit: {{{reasonForVisit}}}, Department: {{{department}}}
{{/each}}
`,
});

// Flow definition
const adminGenerateVisitSummaryReportFlow = ai.defineFlow(
  {
    name: 'adminGenerateVisitSummaryReportFlow',
    inputSchema: AdminGenerateVisitSummaryReportInputSchema,
    outputSchema: AdminGenerateVisitSummaryReportOutputSchema,
  },
  async (input) => {
    const {output} = await adminGenerateVisitSummaryReportPrompt(input);
    if (!output) {
      throw new Error('Failed to generate report summary.');
    }
    return output;
  }
);

// Wrapper function
export async function adminGenerateVisitSummaryReport(input: AdminGenerateVisitSummaryReportInput): Promise<AdminGenerateVisitSummaryReportOutput> {
  return adminGenerateVisitSummaryReportFlow(input);
}
