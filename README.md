# 💰 Moneo - Personal Finance Dashboard

[![Live Demo](https://img.shields.io/badge/Live-Demo-2ea44f?style=for-the-badge&logo=vercel)](https://moneo-finance-dashboard.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)

**Moneo** is a modern, privacy-first personal finance dashboard designed to give you complete control over your money. It operates 100% offline using your browser's local storage, ensuring your sensitive financial data never leaves your device unless you explicitly choose to analyze it with AI.

![Dashboard Overview](docs/assets/dashboard.png)

## ✨ Features

-   **🔒 Privacy First:** All data is stored locally in your browser (`localStorage`). No servers, no tracking.
-   **🤖 Multi-Provider AI Assistant:** Analyze your finances with the power of **Google Gemini**, **OpenAI (GPT)**, **Anthropic (Claude)**, or **DeepSeek**.
-   **📄 Smart PDF Import:** Drag & drop your bank statement PDFs. Moneo uses AI to automatically extract transactions and categorize them.
-   **📊 Interactive Dashboard:** Customizable grid layout with drag-and-drop widgets.
-   **📈 Predictive Analytics:**
    -   Daily Heatmap (Visual spending intensity)
    -   Budget Depletion Forecast
    -   Next Month Expense Prediction
    -   Goal Completion Estimator
-   **🎨 Personalization:** Multiple themes (Dark, Light, Neon, Sunset) and a custom color generator.
-   **🌍 Localization:** Full support for English and Turkish languages.

---

## 🚀 Getting Started

You can use the [Live Demo](https://moneo-finance-dashboard.vercel.app/) immediately, or run it locally on your machine for development.

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/recepzgrmh/moneo-finance-dashboard.git
    cd my-financial-report
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

---

## 💡 How to Use

### 1. Import Your Data
Go to the **Import Data** page. You can:
-   Upload a generic Bank Statement PDF.
-   Select your preferred AI Provider (Gemini, OpenAI, Claude, DeepSeek) to parse the PDF.
-   Moneo will detect the bank, categorize transactions, and populate your dashboard.

![Import Options](docs/assets/import.png)

### 2. Analyze with AI
Visit the **AI Assistant** page to chat with your financial data.
-   Ask questions like *"How can I save more this month?"* or *"Analyze my spending habits."*
-   Switch between different AI models to get the best advice.

![AI Assistant](docs/assets/ai_assistant.png)

### 3. Customize Your View
-   Click **"Edit Layout"** on the dashboard to resize or move cards.
-   Use the **Theme** selector in the sidebar to match your style.

---

## 🎨 Style Gallery

Moneo comes with an extensive collection of built-in themes to match your mood and aesthetic.

| | |
|:---:|:---:|
| **Cosmic Glass**<br>![Cosmic](docs/designs/cosmic_glass.png) | **Professional (Light)**<br>![Professional](docs/designs/professional.png) |
| **Golden Luxury**<br>![Golden](docs/designs/golden.png) | **Neo-Brutalism**<br>![Neo Brutalism](docs/designs/neo-brut.png) |
| **Windows XP**<br>![Windows XP](docs/designs/windows_xp.png) | **Terminal (Hacker)**<br>![Terminal](docs/designs/terminal.png) |
| **Pop Art**<br>![Pop Art](docs/designs/pop_art.png) | **Paper & Pen (Sketch)**<br>![Paper Pen](docs/designs/paper_pen.png) |
| **8-Bit Retro**<br>![8-Bit](docs/designs/8-bit.png) | **Glitch Art**<br>![Glitch](docs/designs/glitch.png) |
| **VHS Tape**<br>![VHS](docs/designs/vsh.png) | **Xerox Punk**<br>![Xerox](docs/designs/xerox_punk.png) |
| **Thermal Vision**<br>![Thermal](docs/designs/thermo.png) | **X-Ray**<br>![X-Ray](docs/designs/x-ray.png) |
| **Airport Flip Board**<br>![Flip Board](docs/designs/flip_board.png) | **Sonar**<br>![Sonar](docs/designs/sonar.png) |
| **Las Vegas**<br>![Vegas](docs/designs/vegas.png) | **E-Ink**<br>![E-Ink](docs/designs/e-ink.png) |
| **Medieval Dungeon**<br>![DND](docs/designs/dnd.png) | |

---

## 🤖 The AI Experiment

> **Disclaimer:** This project is a collaborative experiment between Human and AI.

While the **architecture, file structure, tech stack, and core application logic** were fully designed and directed by the human creator, the **implementation details, code generation, CSS styling, and even this README file** were executed by Artificial Intelligence.

The goal of this project was to run a real-world experiment: **to explore how far AI-assisted development can go when guided by a clear human vision, even within a language or framework not fully mastered by the creator.**

Moneo stands as a proof of concept for the future of software development:
**Human vision. AI execution.**

---

## 🛠️ Contributing

We welcome contributions! Moneo is an open-source project and we'd love to see it grow.

### Areas for Improvement
-   [ ] **Mobile App:** A React Native version for mobile.
-   [ ] **More Bank Formats:** Improve PDF parsing prompts for more international banks.
-   [ ] **Budgeting Rules:** Add 50/30/20 rule visualizations.
-   [ ] **Export:** Add CSV/Excel export functionality.

### Steps to Contribute
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 🤖 The AI Experiment

> **Disclaimer:** This entire project—including all code, design decisions, CSS styling, and even this README—was generated by Artificial Intelligence.

The purpose of this project was to conduct a comprehensive experiment: **To see how far AI-assisted coding could go in building a complex, full-stack application in a language and framework completely unknown to the creator.** 

Moneo serves as a proof of concept for the future of software development, where AI acts not just as a helper, but as a core architect and builder.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/recepzgrmh">Recep</a>
</p>
