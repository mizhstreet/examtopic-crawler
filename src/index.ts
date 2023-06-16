import { parse } from "node-html-parser";
import * as fs from "fs";
// import * as mysql from "mysql2";
import crossfetch from "cross-fetch";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require("fetch-retry")(crossfetch);
// import retry from "fetch-retry";

// const QUIZ_START = process.env.QUIZ_START || "0";
// const QUIZ_END = process.env.QUIZ_END || "110000";
// const DB_HOST = process.env.DB_HOST || "";
// const DB_USER = process.env.DB_USER || "";
// const DB_PASSWORD = process.env.DB_PASSWORD || "";

// const EXAM_NAME = [
//   "SAA-C02",
//   "SAA-C03",
//   "AWS DevOps Engineer Professional",
//   "AWS Certified Developer Associate",
//   "AWS Certified Solutions Architect - Professional",
//   "AWS Certified SysOps Administrator",
// ];

interface IQuestions {
  content?: string;
  answers: string[];
  exam?: string;
  link: string;
}

function appendArrayToFile(filePath: string, content: string[]): void {
  for (const chunk of content) {
    fs.appendFileSync(filePath, chunk + "\n");
  }
}
const main = async (): Promise<void> => {
  try {
    // const connection = mysql.createConnection({
    //   host: DB_HOST,
    //   user: DB_USER,
    //   password: DB_PASSWORD,
    //   database: "question-app",
    // });

    // for (let i = 1; i <= 513; i++) {
    //   console.log("");
    // }

    for (let i = 1; i <= 514; i++) {
      const data: string[] = [];
      const link = `https://www.examtopics.com/discussions/amazon/${i}/`;
      const response = await fetch(link);
      const textResponse = await response.text();
      const root = parse(textResponse);
      // const discussion =
      //   root.querySelector(".discussion-list")?.childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[1]
      //     .rawAttributes;

      const links = root.querySelectorAll(".discussion-link");
      // const quesitonNumbers = root.querySelectorAll(".discussion-link");

      links.forEach((e) => {
        console.log("https://www.examtopics.com" + e.rawAttributes.href);
        data.push("https://www.examtopics.com" + e.rawAttributes.href);
        // console.log(
        //   e.firstChild.innerText
        // .replace(/\t|\n|\r/g, "")
        // .split(" ")
        // .splice(-2)[0],
        // );
      });
      appendArrayToFile("./data.txt", data);
    }

    // console.log(linka);

    // for (let i = parseInt(QUIZ_START || "0"); i < parseInt(QUIZ_END || "130000"); i++) {
    //   await new Promise((resolve) => setTimeout(resolve, 20000));
    //   console.log(`Processing question number ${i}`);
    //   try {
    //     const link = `https://www.examtopics.com/discussions/microsoft/view/${i}-ajshbdasbnnijasd/`;
    //     const resp = await fetch(link, {
    //       retries: 3,
    //       retryDelay: function (attempt) {
    //         return Math.pow(2, attempt) * 10000; // 1000, 2000, 4000
    //       },
    //       retryOn: [404, 503],
    //     });
    //     console.log(`---- Status code:${resp.status} - ${resp.statusText}`);
    //     const res = await resp.text();

    //     // HTML extraction
    //     const root = parse(res);
    //     const title = root.querySelector(".discussion-list-header > h1")?.childNodes[1].text;

    //     // check if the question is included in the examname above
    //     // let matchedExam = "";
    //     // if (
    //     //   !EXAM_NAME.some((v) => {
    //     //     matchedExam = v;
    //     //     return title?.includes(v);
    //     //   })
    //     // ) {
    //     //   continue;
    //     // }

    //     const content = root.querySelector(".card-text")?.innerHTML.trim();

    //     // console.log(content);
    //     const question: IQuestions = {
    //       content,
    //       answers: [],
    //       exam: title,
    //       link,
    //     };
    //     const answers = root.querySelector(".question-choices-container > ul")?.childNodes;
    //     if (answers && answers.length > 0) {
    //       answers.forEach((a) => {
    //         // console.log("break");
    //         const ans = a.text.replace(/\t|\n|\r/g, "") || "";
    //         if (ans !== "") {
    //           question.answers.push(ans);
    //         }
    //         question.answers.slice(0, -1);
    //       });
    //     }
    //     // questions.push(question);
    //     connection.query(`insert into question(exam, answers, content, link) values (?,?,?,?)`, [
    //       question.exam,
    //       JSON.stringify(question.answers),
    //       question.content,
    //       question.link,
    //     ]);
    //   } catch (e) {
    //     console.log(e);
    //     console.warn("err");
    //   }
    // }
  } catch (error) {
    console.log(error);
    console.log("Question not found, skipping...");
  }
};

main();
