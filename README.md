# UniTrack Campus Visitor Management System

## 🌐 Live Demo
Access the official institutional visitor portal and administrative command center:
**[Launch UniTrack System](https://studio-1292497662-88e10.web.app/)** 

---

Official institutional visitor management and real-time check-in system for **New Era University**. This application provides a secure, efficient, and AI-enhanced gateway for managing campus traffic and institutional oversight.

## 🚀 Key Features

### 🔐 Identity & Access Management
- **Institutional Authentication**: Secure login system restricted to the `@neu.edu.ph` domain.
- **Role-Based Access Control**: Distinct interfaces and permissions for **Visitors** and **Administrators**.
- **Session Tracking**: Real-time monitoring of active user sessions across the campus.

### 📍 Visitor Check-in System
- **Facility Selection**: Quick check-in for key campus units including the University Library and Dean's Offices.
- **Smart Data Entry**: Captures visitor classification (Student, Employee), target department, and primary purpose of visit.
- **Real-time Logging**: Instant synchronization of visit records with the central administrative database.

### 📊 Administrative Command Center
- **Real-time Dashboard**: Live visualization of campus activity, active sessions, and recent visit logs.
- **Advanced Analytics**: Interactive charts (powered by Recharts) showing traffic distribution across university colleges.
- **Multi-Dimensional Filtering**: Drill down into data by time period, department, visitor type, or visit reason.
- **User Directory**: Centralized management of institutional accounts with the ability to restrict access (block/unblock).

### 🤖 AI-Powered Executive Reporting
- **Genkit Integration**: Leverages Google Gemini models to generate institutional summary reports.
- **Trend Analysis**: Automatically identifies busiest hours, top departments, and most frequent visit reasons from raw logs.
- **Dean-Ready Summaries**: Synthesizes complex data into narrative executive summaries for academic leadership.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **AI Framework**: [Genkit](https://github.com/firebase/genkit)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 📁 Project Structure

- `src/app`: Next.js application routes and layouts.
- `src/ai`: Genkit flows and AI prompt definitions.
- `src/firebase`: Firebase configuration and custom hooks for real-time data synchronization.
- `src/components`: Reusable UI components and layout elements.
- `src/lib`: Shared utilities, types, and state management logic.

---
© 2026 New Era University. All institutional rights reserved.