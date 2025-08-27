# Research AI Agent

This project is a simple AI-powered research assistant that automates web searches and summarizes findings using Google Gemini AI. It is designed for beginners and can be run locally or on Replit.

## Features
- Generates research questions from a user topic using Gemini AI
- Searches the web for answers using DuckDuckGo
- Scrapes and collects information from top results
- Synthesizes a structured summary using Gemini AI

---

## Setup Instructions (Local)

### 1. Prerequisites
- **Node.js** (version 18 or above recommended)
- **npm** (comes with Node.js)
- **Google Gemini API Key** (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

### 2. Clone the Repository
```bash
git clone https://github.com/Yash-g2310/Research-AI-Agent.git
cd Research-AI-Agent
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a file named `.env` in the project folder and add your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

### 5. Install Puppeteer Chrome Dependencies (Linux only)
If you are on Linux, run:
```bash
sudo apt-get update
sudo apt-get install libnss3 libnspr4 libxss1 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libgbm1 libgtk-3-0 libpango-1.0-0 libpangocairo-1.0-0 libasound2
```

### 6. Run the Agent
```bash
npm start
```

---

## Setup Instructions (Replit)

1. **Fork this repo to your Replit account**
2. Go to the "Secrets" tab in Replit and add your Gemini API key as `GEMINI_API_KEY`
3. Click the "Run" button

*Note: Puppeteer may not work with headless browsers on Replit. If you encounter issues, comment out the Puppeteer code and use only the Gemini AI features.*

---

## Troubleshooting
- If you see errors about missing libraries, install them as shown above (Linux only)
- If you get rate limit errors from Gemini, wait a few minutes and try again
- For any browser automation issues, check the [Puppeteer troubleshooting guide](https://pptr.dev/troubleshooting)

---

## How It Works
1. The agent generates research questions from your topic using Gemini AI
2. It searches DuckDuckGo for each question and collects the top results
3. It scrapes the content from those pages
4. It asks Gemini AI to summarize all the findings

---

## For Freshers
- No prior coding experience is required
- Just follow the steps above and ask for help if you get stuck
- You can experiment with changing the research topic in `agent.js`

---

## License
This project is licensed under the ISC License.
