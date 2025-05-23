Tes's Grievance Portal
A web application built with Next.js and Drizzle ORM that allows users to submit and track grievances.

Next.js

Features
User Authentication: Secure login and registration system
Grievance Submission: Submit grievances with title, content, mood, and severity
Grievance History: View all submitted grievances with filtering options
User Management: User profiles and session management
Responsive Design: Beautiful UI that works on all devices
Tech Stack
Frontend: Next.js 15, React, Tailwind CSS
Database: PostgreSQL via Supabase
ORM: Drizzle ORM for type-safe database operations
Authentication: Custom authentication system with secure password hashing
UI Components: shadcn/ui component library
Getting Started
Prerequisites
Node.js  and npm
Supabase account and project
Environment Setup
Create a .env file in the root directory with the following variables:

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
DATABASE_URL=postgresql://postgres.
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
Installation
Clone the repository:
git clone https://github.com/Dsmalldara/grievance_portal
cd grievance_portal
