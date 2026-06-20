Frontend setup for DevInsight AI

Install additional dependencies required for the enhanced dashboard:

```bash
cd frontend
npm install jspdf html2canvas recharts axios
# if using TailwindCSS ensure it's configured (existing project should have tailwind)
```

Start dev server:

```bash
npm run dev
```

Notes:
- The enhanced dashboard component is at `src/pages/DashboardEnhanced.jsx`.
- The profile component is at `src/components/ProfileCard.jsx`.
- API helper is at `src/services/devinsightApi.js` — set `VITE_API_URL` in `.env` to point to backend API (e.g. http://localhost:8000/api).
