import dotenv from "dotenv";
import puppeteer from "puppeteer";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// ---- 1. Perception: User query ----
const userPrompt = "Impact of renewable energy on global economy";

// Gemini setup
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({apiKey: GEMINI_API_KEY});

// Utility: delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function main() {
  // ---- 2. Reason/Plan ----
  const reasoningPrompt = `Given the user query: "${userPrompt}", 
  generate 3 specific research questions that would help in answering it. 
  Only output the questions as a numbered list.`;

  const reasoningRes = await genAI.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: reasoningPrompt,
  });
//   console.log("this is the reasoning res")
//   console.log(reasoningRes)
//   console.log("this is the content")
//   console.log(reasoningRes.candidates[0].content.parts[0].text);
  const questions = reasoningRes.candidates[0].content.parts[0].text.split("\n").filter(q => q.trim());
  questions.shift();
//   console.log("\n🧠 Research Questions:\n", questions);

//   // ---- 3. Act: Use Puppeteer to search ----
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, });

  const page = await browser.newPage();
  console.log("\n🌐 Browser launched.");

  let memory = [];
  // let questions = [
  //   '1.  How does investment in renewable energy infrastructure affect GDP growth and job creation in different countries, considering varying levels of economic development and resource endowments?',
  // '2.  What is the impact of fluctuating renewable energy prices and government subsidies on the competitiveness of renewable energy industries compared to fossil fuel-based industries, and how does this affect international trade patterns?',
  // '3.  To what extent does the adoption of renewable energy technologies contribute to energy independence, reduce reliance on fossil fuel imports, and mitigate the economic risks associated with climate change in various global regions?'
  // ];

  for (const question of questions) {
    console.log(`\n🔎 Searching: ${question}`);
    // await page.goto("https://www.google.com");
    // await page.type("textarea[name=q]", question);
    // await page.keyboard.press("Enter");
    // await page.waitForSelector("h3");

    // // Extract top 3 search results
    // const links = await page.$$eval("h3", els =>
    //   els.slice(0, 3).map(el => el.parentElement.href)
    // );
    
    await page.goto("https://duckduckgo.com/");
    await page.type("input[name='q']", question);
    await page.keyboard.press("Enter");
    await page.waitForSelector(".react-results--main");
    console.log("got it")
    const links = await page.$$eval('[data-testid="result-title-a"]', anchors =>
  anchors.slice(0, 3).map(a => a.href)
);
    
    console.log("🌐 Top results:", links);


    // Visit and scrape each link
    for (const link of links) {
      try {
        const newPage = await browser.newPage();
        await newPage.goto(link, { waitUntil: "domcontentloaded", timeout: 30000 });

        const content = await newPage.$eval("body", el => el.innerText.slice(0, 1500)); // limit for speed
        memory.push({ question, link, content });
        await newPage.close();
      } catch (err) {
        console.log("⚠️ Could not scrape:", link);
      }
      await delay(1000);
    }
  }

  // ---- 4. Memory ----
  console.log(`\n💾 Collected ${memory.length} documents into memory.`);

  // ---- 5. Synthesizer ----
  const combinedText = memory.map(m => `From ${m.link}:\n${m.content}`).join("\n\n");

  const finalPrompt = `User Query: ${userPrompt}
Here is research material collected from multiple sources:\n${combinedText}

Please write a clear, structured summary (around 4-5 paragraphs). 
Highlight key insights, trends, and evidence.`;

console.log(finalPrompt)
  const summaryRes = await genAI.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: finalPrompt,
  });
  console.log("this is the summary res")
  console.log(summaryRes)
  console.log("\n📝 Final Answer:\n", summaryRes.candidates[0].content.parts[0].text);

  await browser.close();
}

main();
