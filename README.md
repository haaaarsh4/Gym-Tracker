# Gym-Tracker

A modern **full-stack workout tracking web application** built with **Next.js, TypeScript, Tailwind CSS, and Prisma** — with integrated **AI chatbot support** to help users with fitness questions and workout guidance.

Live demo: https://workout-tracker-sepia-nine.vercel.app

---

## Overview

Gym-Tracker is a fitness web app that lets users:

- Log workouts (exercises, sets, reps, weights)
- Track workout history
- See progress over time
- Ask an integrated **AI Fitness Assistant** questions about exercise, workouts, or fitness tips

This app is designed to be simple, mobile-friendly, and easy to deploy.

---

## Key Features

### Workout Tracking

- Create workouts with a name & date
- Add exercises with sets, reps, and weights
- Persist workouts to a database
- View, edit, and delete logged workouts

### AI Fitness Chatbot

- Ask fitness questions like:
  - “What’s a good chest workout for strength?”
  - “How should I structure rest days?”
  - “How many calories should I aim for in a cutting phase?”
- Powered via **OpenAI or AI API backend**
- Helps users with guidance, terminology, and personalized tips

### Tech Highlights

- **Next.js** for frontend & backend API routes
- **TypeScript** for safety & clarity
- **Tailwind CSS** for beautiful UI
- **Prisma ORM** for database interaction
- Built for deployment on **Vercel**

---

## Technology Stack

| Layer                     | Tech                      |
|--------------------------|---------------------------|
| Frontend                 | Next.js, TypeScript       |
| Styling                  | Tailwind CSS              |
| Backend APIs             | Next.js API Routes        |
| Database                 | Prisma (any supported DB) |
| AI Integration           | OpenAI or similar         |
| Deployment               | Vercel                    |

---

## Installation & Local Setup

Follow these steps to run Gym-Tracker on your local machine:

### STEP 1: Clone the repository

```bash
git clone https://github.com/haaaarsh4/Gym-Tracker.git
cd Gym-Tracker
```

### STEP 2: Install dependencies

```bash
npm install
# or
yarn install
```

### STEP 3: Create environment config

Create a `.env` file in the project root with the following variables:

```
DATABASE_URL="your_database_connection_string"
OPENAI_API_KEY="your_openai_api_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### STEP 4: Run database migrations

```bash
npx prisma migrate dev --name init
```

### STEP 5: Start the development server

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser.

---

## How to Use

### Workout Logging

1. From the home page, navigate to **Workouts**
2. Click **Create Workout**
3. Add exercises with sets, reps, and optional weights
4. Save your workout
5. View your workout history on the **History** page to see progress over time

---

## AI Fitness Chat

- Go to the **AI Chat** or **Fitness Assistant** screen
- Type questions like:
  - “What exercises build back strength?”
  - “How many rest days should I take per week?”
- Hit send and get helpful fitness tips from the chatbot

> The AI features require your `OPENAI_API_KEY` (or equivalent) to be set in `.env`.

---

## Project Structure

```
📦 Gym-Tracker
├─ 📁 app/                  # Next.js frontend + server routes
├─ 📁 components/ ui/       # UI components
├─ 📁 lib/                  # Helper utilities & shared logic
├─ 📁 prisma/               # Prisma schema & migrations
├─ 📁 public/               # Static files
├─ .env                    # Environment variables (local only)
├─ next.config.ts          # Next.js config
├─ tailwind.config.ts      # Tailwind CSS config
└─ tsconfig.json           # TypeScript config
```

---

## AI Integration Details

The AI chatbot uses your selected AI provider (default: OpenAI). It sends user questions to the API and displays thoughtful responses.

Make sure your `.env` includes:

```
OPENAI_API_KEY="your_openai_api_key_here"
```

The API route handling this can be found under `app/api`.

---

## Contributing :)

Contributions are welcome! Here’s how:

1. Fork this repository
2. Create a branch (e.g., `feature/new-chatbot`)
3. Implement changes
4. Open a Pull Request

Please keep code style consistent and add tests for new features where applicable.

---

## Roadmap

Future improvements might include:

- Data visualization (charts, graphs)
- Workout plans & templates
- Push notifications for workout reminders
- Improved mobile UI/UX

---

## License

Released under the **MIT License**.

---

## Contact

**Harsh Upadhyay** — Gym-Tracker Creator  
GitHub: https://github.com/haaaarsh4

Stay fit and keep building! 💪
