import puppeteer from "puppeteer";
import * as fs from "fs";

const lines = fs.readFileSync("examlinks/data-sap-c02.txt", "utf-8").split("\n");
const failedLines: any = [];

function appendArrayToFile(filePath: string, content: string[]): void {
  for (const chunk of content) {
    fs.appendFileSync(filePath, chunk + "\n");
  }
}

async function downloadPageAsPDF(url: string, outputFilePath: string): Promise<void> {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    const selector = "h1";

    let selectorValue: any = await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      return element ? element.textContent : null;
    }, selector);

    selectorValue = selectorValue
      ?.replace(/\t|\n|\r/g, "")
      .split(" ")
      .splice(-2)[0];
    console.log(selectorValue);

    if (selectorValue == undefined) {
      failedLines.push(url);
    }

    // Generate PDF from the page
    await page.pdf({ path: `${outputFilePath}/${selectorValue}.pdf`, format: "A4" });
    console.log(`Page downloaded as PDF and saved to ${outputFilePath}`);

    await browser.close();
  } catch (error) {
    console.error(`Error downloading page as PDF: ${error.message}`);
  }
}

async function download() {
  for (let i = 0; i < lines.length; i++) {
    await downloadPageAsPDF(lines[i], "exams/SAP-C02");
  }
  appendArrayToFile("./failedlinks/data-sap-c02.txt", failedLines);
}

download();
