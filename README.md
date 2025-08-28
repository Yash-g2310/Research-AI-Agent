# Research AI Agent For Workshop - Google GenAI + Puppeteer
This project is a simple AI-powered research assistant that automates web searches and summarizes findings using Google Gemini AI. It is designed for beginners and can be run locally or on Replit.

## Table of Contents
- [Features](#features)
- [Setup Instructions (Local)](#setup-instructions-local)
- [Troubleshooting](#troubleshooting)
- [How It Works](#how-it-works)
- [License](#license)


## Features
- Generates research questions from a user topic using Gemini AI
- Searches the web for answers using DuckDuckGo
- Scrapes and collects information from top results
- Synthesizes a structured summary using Gemini AI

---

## Setup Instructions (Local)

### 1. Prerequisites

- **Node.js**  
  - Ensure you have Node.js installed (version 18 or above recommended).  
  - [Download Node.js](https://nodejs.org/)  
  - Verify installation by running:
  ```bash
  node -v
  npm -v
  ```

- **Puppeteer**  
  - Puppeteer is a Node.js library for automating Chrome/Chromium. It enables web scraping, browser automation, and more.  
  - It will be installed automatically with project dependencies.

- **Google GenAI Library**  
  - The Google GenAI library is required to interact with Gemini AI.  
  - It will be installed automatically with project dependencies.

- **Git** (optional but recommended)  
  - Git is useful for cloning the repository and managing code versions.  
  - [Download Git](https://git-scm.com/downloads)

- **Google Gemini API Key**  
  Required to access Gemini AI features.  
  To generate your Gemini API key:
  1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
  2. Sign in with your Google account
  3. Click "Create API Key" and

### 2. Clone the Repository (optional)

- If you're working with a repository hosted on platforms like GitHub, you can "clone" the repository to download all the project files to your local machine. 
- This requires Git to be installed on your computer.

- To clone the repository, open your terminal (or command prompt) and run the following commands:
```bash
git clone https://github.com/Yash-g2310/Research-AI-Agent.git
cd Research-AI-Agent
```
- After running these commands, you'll have a local copy of the project and will navigate into the project's directory.

**OR**

- You can also download the project as a ZIP file if you prefer not to use Git. To do this:
1. Visit the repository page in your browser.
2. Look for a "Code" button or "Download ZIP" option.
3. Download and extract the ZIP file to a folder on your machine.

- After downloading or cloning, navigate into the project folder using:
```bash
cd Research-AI-Agent
```

### 3. Install Dependencies

- In the project directory, install the required Node.js dependencies:
```bash
npm install
```
- This will automatically install Puppeteer, Google GenAI library, and other dependencies listed in `package.json`.

### 4. Configure Environment Variables
- Create a file named `.env` in the project folder and add your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```
- This allows your code to access the API key without exposing it directly in your source files.

### 5. Install Puppeteer Chrome Dependencies (Linux only)
- If you are using Linux, Puppeteer requires some additional system libraries to run Chrome/Chromium in headless mode.
- Run the provided apt-get commands in your terminal to install these dependencies:
```bash
sudo apt-get update
sudo apt-get install libnss3 libnspr4 libxss1 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libgbm1 libgtk-3-0 libpango-1.0-0 libpangocairo-1.0-0 libasound2
```
- This ensures Puppeteer can launch and control the browser for web automation.

### 6. Run the Agent
- Start the agent by running
```bash
npm start
```

---

## Troubleshooting
- If you see errors about missing libraries, install them as shown above (Linux only)
- If you get rate limit errors from Gemini, wait a few minutes and try again
- For any browser automation issues, check the [Puppeteer troubleshooting guide](https://pptr.dev/troubleshooting)

---

## How It Works
1. The agent generates research questions from your topic using Gemini AI
2. It searches DuckDuckGo for each question and collects the top results
3. It scrapes the content from those pages and stores in memory
4. It combines all the memory
5. It asks Gemini AI to summarize all the findings

---

## License
This project is licensed under the ISC License.
