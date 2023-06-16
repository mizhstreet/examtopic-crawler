import * as fs from "fs";

function filterTextFile(filePath: string, searchText: string): string[] {
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");
  const filteredLines = lines.filter((line) => line.includes(searchText));
  return filteredLines;
}

function appendArrayToFile(filePath: string, content: string[]): void {
  for (const chunk of content) {
    fs.appendFileSync(filePath, chunk + "\n");
  }
}

// Example usage
const filePath = "data.txt";
const searchText = "sap-c02";

const filteredLines = filterTextFile(filePath, searchText);

console.log(filteredLines);
appendArrayToFile("./examlinks/data-sap-c02.txt", filteredLines);
