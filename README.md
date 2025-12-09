# Applio/
### Smart Job Application Tracker

**Live App:** https://applio-job-tracker-025135847b67.herokuapp.com/

---

## 🎯 Goal
Applio/ helps job seekers organize and track their entire application process in one place. Instead of scattered notes, browser tabs, and spreadsheets, users can add job links, summarize job descriptions, generate custom cover letters, upload CVs, and follow each application from idea → offer.

---

## 🧠 Overview & Concept
Applio/ is a full-stack web application built to simplify job hunting.

Users can:
- Add job applications manually or using a job URL
- Automatically extract and clean job-posting content
- Generate AI-powered summaries and cover letters
- Upload their CV and auto-fill profile fields
- Track application status visually (Idea, Applied, Interviewing, Tech Test, Offer, Rejected)
- Store and edit notes per application
- Enjoy a clean, responsive UI focused on clarity

This project blends **full-stack CRUD**, **web scraping**, **authentication**, and **AI integration** into one polished tool.

---

## 🛠️ Technologies Used

### **Frontend**
- React (Vite)
- React Router
- Context API (Auth state)
- CSS custom design system (status pills, gradients, animations)
- Fetch API
- Heroku (Frontend hosting)

### **Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- pdf-parse for CV extraction
- OpenAI API (summaries + cover letters)
- node-fetch for scraping
- CORS, Morgan, dotenv
- Heroku (Backend hosting)

### **Other Tools**
- Git / GitHub
- Intersection Observer for animations
- Custom URL normalizer utilities

---

## 🚀 Approach Taken
1. **UI & Design First**  
   Built a consistent design system: pills, gradients, spacing, and a clean dashboard layout.

2. **Backend Architecture**  
   Created RESTful routes for:
   - Authentication
   - Profile + CV upload/parsing
   - Job applications CRUD
   - URL scraping + AI generation endpoints

3. **Scraping & Parsing**  
   - Normalized job URLs  
   - Stripped HTML into clean text  
   - Handled redirects, 403 errors, and blocked pages  

4. **AI Integration**  
   Implemented endpoints to produce:
   - Job summaries  
   - Cover letters  

5. **Frontend Implementation**  
   - Protected routes with JWT
   - Dashboard with search + filters
   - Single application page with status, notes, and actions
   - File upload UX with loading states
   - Optimized animations + loaders

6. **Deployment**  
   Two separate Heroku apps: backend API and React frontend.

---

## 📚 Key Learnings
- Handling blocked scraping requests (LinkedIn, Indeed)
- Solving CORS issues between multiple Heroku dynos
- Structuring scalable full-stack apps
- Debugging Heroku Vite build errors
- Clean error feedback and user-friendly loading UX
- AI prompt tuning for consistency

---

## ⚠️ Challenges
- 403 responses from job-board URLs
- Heroku not detecting `server.js` during frontend deployment
- Vite asset path issues in production
- Occasional AI response formatting inconsistencies
- Parsing large CV files with edge-case layouts
- Overlapping dropdown menus due to absolute positioning

---

## 🐞 Known Bugs / Issues
- Some job URLs may not scrape correctly (LinkedIn protection)
- AI responses can take a few seconds on slow networks
- JSON parse errors if backend returns HTML on failure
- Dropdowns occasionally appear above overlays
- Token persistence may break in incognito mode

---

