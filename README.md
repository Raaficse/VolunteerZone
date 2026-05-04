# VolunteerZone: A Modern Volunteer Management Ecosystem

VolunteerZone is a next-generation platform designed to bridge the gap between NGOs and volunteers. Built with a focus on security, quality assurance, and verified recognition, it introduces a unique 4-tier user role system to ensure every volunteer opportunity is legitimate and every contribution is recognized.

---

## 🛠️ Tech Stack
- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Zustand](https://github.com/pmndrs/zustand).
- **Backend**: [Supabase](https://supabase.com/) (Auth, PostgreSQL, RLS).
- **Deployment**: Firebase Hosting / Vercel.

---

## 🚦 Installation & Setup Guide

Follow these steps to set up the project on your local machine.

### 📋 Prerequisites
- **Node.js (v18+)**
- **Git**
- **Supabase Account**

### 🏗️ 1. Clone & Install
```bash
git clone https://github.com/Raaficse/VolunteerZone.git
cd VolunteerZone
npm install
```

### ☁️ 2. Supabase Backend Setup
1.  **Create a Project**: Go to [Supabase](https://supabase.com/) and create a new project.
2.  **SQL Initialization**: Open the **SQL Editor** in Supabase and run the following script to create your tables:

```sql
-- 1. Create Users Table (Profile)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text default 'volunteer' check (role in ('admin', 'moderator', 'organization', 'volunteer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Events Table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_date timestamp with time zone not null,
  location text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'finished')),
  max_volunteers int default 10,
  org_id uuid references public.users(id),
  certificate_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Registrations Table
create table public.event_registrations (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade,
  volunteer_id uuid references public.users(id) on delete cascade,
  attendance_status text default 'pending' check (attendance_status in ('pending', 'present', 'absent')),
  certificate_link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 🔑 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 🚀 4. Run Locally
```bash
npm run dev
```
Access the app at `http://localhost:3000`.

---

## 📦 Role Overview
| Role | Responsibility |
| :--- | :--- |
| **Admin** | Full system oversight and staff management. |
| **Moderator** | Quality control and auditing event submissions. |
| **Organization** | Posting events and issuing certificates. |
| **Volunteer** | Joining events and earning verified recognition. |

## 📄 License
This project is for academic purposes. [MIT License](LICENSE)

---
Developed with ❤️ by Raaficse.
