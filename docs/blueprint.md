# **App Name**: UniTrack Campus Visitor

## Core Features:

- User Authentication: Implement Google Login for both admins and visitors, restricted to institutional email domains.
- Visitor Check-in: Visitors input their 'College Department' and 'Reason for Visit' upon login.
- Admin Check-in: Requires a password after inputting of email. Update the login verification logic and the initial store data to set `jcesperanza@neu.edu.ph` with password `admin123` as the official administrative credential.
- Real-time Statistics Dashboard: Admins view a dashboard with real-time statistics, including stat cards for total visitors filtered by Day, Week, and Month. Add interactive filters for Department, Reason for Visit, and Visitor Classification, ensuring that both the real-time statistics and the activity logs dynamically reflect your selections.
- User Search: Admins can search for specific users by name.
- User Management: Admins can manage users, with the ability to 'Block User'.
- Visit Logging: The app saves visit with timestamps, user emails, and department categories to allow filtering.
- Summary Report Generation: LLM-powered tool to generate the reports for the dean that shows the busiest hours of the day and the most common reasons for visits.

## Style Guidelines:

- Primary color: A deep and trustworthy blue (#24488F) to evoke professionalism and institutional stability, used for primary actions, headings, and branding elements.
- Background color: A soft, cool off-white (#F0F3F5) to ensure high readability and provide a clean, academic feel, minimizing eye strain.
- Accent color: A vibrant cyan (#26C3D8) used strategically for interactive elements, status indicators, and subtle highlights to guide user attention.
- All text uses 'Inter' (sans-serif) for its modern, neutral, and highly readable qualities, suitable for both prominent headings and detailed information in forms and tables.
- Utilize clean, vector-based icons, drawing from a consistent system like Material Design, for clear and intuitive representation of actions, navigation, and visitor statuses.
- Prioritize a responsive layout that ensures optimal display across devices, featuring a prominent, clear check-in form for visitors and well-organized, data-rich dashboards for administrators.
- Incorporate subtle animations for visual feedback on successful form submissions, changes in visitor status, and smooth transitions when navigating between dashboard sections, enhancing user experience without distraction.