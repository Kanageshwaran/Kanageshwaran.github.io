# Kanageshwaran Dhakshinamoorthy — Academic & Professional Portfolio

This repository contains the source code for my personal academic and professional portfolio website.  
The site showcases my coursework, projects, activities, and background, and is built as a full-stack React application backed by Supabase.

🌐 **Live Site:** https://kanageshwaran.github.io  
📦 **Repository:** https://github.com/Kanageshwaran/Kanageshwaran.github.io

---

## 🚀 Tech Stack

**Frontend**

- React + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Lucide Icons

**Backend / Data**

- Supabase (PostgreSQL)
- Supabase Storage (media assets)
- Supabase Views (aggregations & counts)

**Testing (Planned / In Progress)**

- Jest (unit testing)
- Maestro (E2E testing)

**Deployment**

- GitHub Pages

---

## 📁 Project Structure

src/
├── components/ # Reusable UI components
├── pages/ # Route-based pages
├── services/ # Supabase data access layer
├── contexts/ # Theme & global context
├── styles/ # Global and theme styles
├── lib/ # Supabase client
├── App.tsx # App shell & routing
├── main.tsx # App entry point

---

## 🧭 Application Pages

### 🏠 Home

- Hero introduction
- Academic work preview
- Activities preview
- Social links

### 👤 About

- Full professional biography
- Who I am, what I do, and what I’ve learned
- Content powered by Supabase (`about_page` table)

### 📘 Academic Work

- Subjects → Courses → Assignments
- Course & assignment counts via Supabase views
- Tools used per course (limited preview)

### 🎯 Activities

- Volunteering
- Photography exhibitions
- Portfolio development
- Each activity includes:
  - Organization
  - Location
  - Date range
  - Full story page

### ✉️ Contact

- Email (click-to-send)
- LinkedIn / Handshake / GitHub
- All data fetched dynamically from Supabase

### ⚙️ Settings

- Theme preferences
- Isolated from background visuals

---

## 🗄️ Database Design (Supabase)

**Key Tables**

- `profile`
- `subjects`
- `courses`
- `assignments`
- `course_tool`
- `activities`
- `social_links`
- `about_page`
- `contact_messages`

**Views**

- `subjects_with_counts`
- `courses_with_counts`
- `activities_count`

All read operations are abstracted through `portfolioService.ts`.

---

## 🎨 Design System

- Light theme: white background with black ladder accent
- Dark theme: black background with red ladder accent
- Background applied globally except Settings page
- Responsive layout (desktop-first)

---

## 🔐 Environment Variables

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

These are required for local development and production builds.

📦 Local Development
npm install
npm run dev

📦 Local Development
npm install
npm run dev

📈 Roadmap

✅ Database-driven portfolio

✅ Activities & About pages

✅ GitHub Pages deployment

🔜 Automated testing

🔜 Performance optimizations

🔜 Accessibility improvements

👤 Author

Kanageshwaran Dhakshinamoorthy
Computer Science Graduate
📍 California, USA

LinkedIn: https://www.linkedin.com

GitHub: https://github.com/Kanageshwaran
```
