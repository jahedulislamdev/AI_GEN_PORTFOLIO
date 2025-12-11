# CozyFolio Manager

A modern, animated, and AI-powered portfolio website built with React. This project features a public-facing portfolio with a "cozy" aesthetic and a secure, private dashboard for managing content dynamically.

## 🚀 Overview

CozyFolio is designed to be a personal branding hub that is easy to update without touching code. It leverages **Google's Gemini API** to assist in writing professional bios and project descriptions, ensuring your portfolio always looks polished.

### ✨ Key Features

-   **🎨 Modern & Responsive Design:** Built with Tailwind CSS and Framer Motion for smooth, high-quality animations and a "cozy", inviting color palette.
-   **🔒 Secure Dashboard:** A private administration area protected by password authentication to manage your data.
-   **🤖 AI-Powered Content:** Integrated with Google Gemini API to:
    -   Enhance user bios and project descriptions.
    -   Auto-generate skill suggestions based on job titles.
-   **📝 Dynamic Content Management:** Add, edit, or remove projects and skills in real-time.
-   **💾 Data Persistence:** Uses LocalStorage for immediate state saving and offers a JSON Export feature to backup your portfolio data.
-   **⚡ High Performance:** Optimized animations and code splitting using Vite/React best practices.

## 🛠️ Tech Stack

-   **Frontend Framework:** [React 19](https://react.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **AI Integration:** [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
-   **Routing:** [React Router DOM](https://reactrouter.com/)

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone or Download

Download the source code to your local machine.

### 2. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory of your project to store your secrets.

```env
# Required for AI features (Bio enhancement, Skill generation)
# Get your key at: https://aistudio.google.com/app/apikey
API_KEY=your_google_gemini_api_key

# Optional: Set a custom password for the Dashboard (Default: admin123)
ADMIN_PASSWORD=my_secure_password
```

### 4. Run the Application

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```text
/
├── components/       # Reusable UI components (Layout, etc.)
├── pages/            # Main page views (Portfolio, Dashboard)
├── services/         # API integrations (Gemini AI service)
├── store/            # State management (Context API)
├── types.ts          # TypeScript interfaces
├── App.tsx           # Main application entry
├── index.tsx         # Render entry point
└── index.html        # HTML template
```

## 🔐 Usage Guide

### Public Portfolio

The homepage (`/`) displays your information. It features:

-   **Hero Section:** Animated introduction.
-   **Projects:** Grid view of your work with hover effects.
-   **Skills:** Visual progress bars and skill levels.

### Dashboard (Private)

Navigate to `/dashboard`.

1.  **Login:** Enter your `ADMIN_PASSWORD` (Default: `admin123`).
2.  **Profile Tab:** Edit your name, title, and social links. Use the **AI Enhance** button to improve your bio.
3.  **Projects Tab:** Add new projects. Provide a title and description, then let AI polish the text.
4.  **Skills Tab:** Add skills manually or generate a list based on your job title.
5.  **Export:** Click "Export Data" to download a `.json` backup of your configuration.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

**Built with 🤎 using React & Gemini**
