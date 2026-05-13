# Pocket Guard

## Student Name
Seth Gundlach

## Instructor
Professor Ramsey

## Project Description
Pocket Guard is a React expense tracker built around the approved final project proposal. Users can register, log in, add expenses, edit or delete records, set a monthly budget goal, review recent spending, and view simple charts that explain where their money is going. The app uses Firebase Authentication and Firestore for user accounts and expense data.

## Main Features
- User authentication with protected routes for the dashboard, expenses, add/edit pages, and budget settings.
- Expense CRUD with amount, category, date, description, and recurring expense support.
- Monthly budget goals so users can compare spending against a target.
- Dashboard summary cards with total spent, budget remaining, top category, and recurring charge count.
- Pie chart for category spending and bar chart for recent monthly trends.
- Filter and search tools for category, date range, amount range, and recurring-only records.
- Responsive design for desktop and mobile layouts.
- Form validation, loading states, success messages, empty states, and delete confirmation.

## Technologies Used
- React
- React Router
- Vite
- Firebase Authentication
- Firebase Firestore
- Recharts
- CSS

## React Concepts Used
- Reusable components
- Props
- State with `useState`
- Effects with `useEffect`
- Controlled forms
- Conditional rendering
- Dynamic rendering with `.map()`
- Context API for authentication and expense state
- React Router protected routes

## Challenges Faced
- Designing a clean structure from an empty project folder while still keeping the code modular.
- Handling recurring expenses in a way that feels useful but still stays understandable for a class project.
- Building filters, summaries, and charts from the same shared expense data source.

## What I Learned
- How to organize a larger React project into pages, components, contexts, services, and utility files.
- How protected routes and user-scoped data work together in a budgeting app.
- How to use derived data for summaries, filters, and charts without hardcoding UI values.
- How to improve user experience with validation, success feedback, empty states, and responsive design.

## Future Improvements
- Add profile settings such as preferred currency and savings goals.
- Support recurring frequencies beyond monthly.
- Add downloadable reports or CSV export.
- Add category editing, dark mode, and richer analytics.
- Deploy with live Firebase configuration.

## Project Structure
src/
  components/
  context/
  data/
  lib/
  pages/
  services/
  App.jsx
  main.jsx
  index.css
```

## Firebase Setup
1. Firebase is configured in `src/lib/firebase.js`.
2. Enable Email/Password authentication in the Firebase console.

## Run Locally
```bash
npm install
npm run dev
```

