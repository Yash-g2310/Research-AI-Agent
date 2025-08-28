import dotenv from "dotenv";
import puppeteer from "puppeteer";
import { GoogleGenAI } from "@google/genai";
import readline from "readline";
import chalk from "chalk";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.blueBright.bold("\n🔬 Welcome to Research-AI-Agent!"));

rl.question(chalk.yellowBright("\n💡 Enter your research topic: "), async (userPrompt) => {
  // Gemini setup
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenAI({apiKey: GEMINI_API_KEY});

  // Utility: delay
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  async function main() {
    let browser;
    try {
      // ---- 2. Reason/Plan ----
      const reasoningPrompt = `Given the user query: "${userPrompt}", 
      generate 3 specific research questions that would help in answering it. 
      Only output the questions as a numbered list.`;

      let reasoningRes;
      try {
        reasoningRes = await genAI.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: reasoningPrompt,
        });
      } catch (err) {
        console.log(chalk.redBright("❌ Error generating research questions. Please check your API key and network."));
        throw err;
      }

      const questions = reasoningRes.candidates[0].content.parts[0].text.split("\n").filter(q => q.trim());
      console.log(chalk.greenBright("\n🧠 Research Questions:"));
      questions.forEach((q, i) => {
        console.log(chalk.cyanBright(`${i + 1}. ${q}`));
      });

      // ---- 3. Act: Use Puppeteer to search ----
      try {
        browser = await puppeteer.launch({ headless: false, defaultViewport: null, });
      } catch (err) {
        console.log(chalk.redBright("❌ Error launching browser. Is Puppeteer installed and working?"));
        throw err;
      }

      let page;
      try {
        page = await browser.newPage();
        console.log(chalk.magentaBright("\n🌐 Browser launched."));
      } catch (err) {
        console.log(chalk.redBright("❌ Error opening new browser page."));
        throw err;
      }

      let memory = [];

      for (const question of questions) {
        console.log(chalk.yellowBright(`\n🔎 Searching: ${question}`));
        try {
          await page.goto("https://duckduckgo.com/");
          await page.type("input[name='q']", question);
          await page.keyboard.press("Enter");
          await page.waitForSelector(".react-results--main");

          const links = await page.$$eval('[data-testid="result-title-a"]', anchors =>
            anchors.slice(0, 3).map(a => a.href)
          );

          console.log(chalk.blueBright("🌐 Top results:"));
          links.forEach((l, idx) => console.log(chalk.gray(`  ${idx + 1}. ${l}`)));

          // Visit and scrape each link
          for (const link of links) {
            try {
              const newPage = await browser.newPage();
              await newPage.goto(link, { waitUntil: "domcontentloaded", timeout: 30000 });

              const content = await newPage.$eval("body", el => el.innerText.slice(0, 1500)); // limit for speed
              memory.push({ question, link, content });
              await newPage.close();
            } catch (err) {
              console.log(chalk.redBright("⚠️ Could not scrape:", link));
            }
            await delay(1000);
          }
        } catch (err) {
          console.log(chalk.redBright("❌ Error searching DuckDuckGo for:", question));
        }
      }

      // ---- 4. Memory ----
      console.log(chalk.greenBright(`\n💾 Collected ${memory.length} documents into memory.`));

      // ---- 5. Synthesizer ----
      const combinedText = memory.map(m => `From ${m.link}:\n${m.content}`).join("\n\n");

      const finalPrompt = `User Query: ${userPrompt}
      Here is research material collected from multiple sources:\n${combinedText}

      Please write a clear, structured summary (around 4-5 paragraphs). 
      Highlight key insights, trends, and evidence.`;

      let summaryRes;
      try {
        summaryRes = await genAI.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: finalPrompt,
        });
      } catch (err) {
        console.log(chalk.redBright("❌ Error generating summary. Please check your API key and network."));
        throw err;
      }

      console.log(chalk.bgWhite.black("\n📝 Final Answer:\n"));
      console.log(chalk.whiteBright(summaryRes.candidates[0].content.parts[0].text));

      await browser.close();
    } catch (err) {
      if (browser) {
        await browser.close();
      }
      console.log(chalk.redBright("\n❌ An unexpected error occurred. Please try again."));
      console.error(err);
    }
  }

  await main();
  rl.close();
});
