const puppeteer = require("puppeteer");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const user = "sajidurshajib";
let arr = [];

const scrapper = async () => {
    const url = `https://github.com/${user}?tab=repositories`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: "networkidle2",
    });

    //My code
    const test = await page.evaluate(() => {
        const repo = Array.from(
            document.querySelectorAll(".wb-break-all > a"),
            (element) => {
                return {
                    repoName: element.textContent.replace(/\s+/g, " ").trim(),
                    repoLink: element.href,
                };
            }
        );

        return {
            repo,
        };
    });

    //1st push
    arr.push(...test.repo);

    while (await page.$(".BtnGroup > .BtnGroup-item:nth-child(2)")) {
        await page.click(".BtnGroup > .BtnGroup-item:nth-child(2)");

        await page.goto(page.url(), {
            waitUntil: "networkidle2",
        });
        const again = await page.evaluate(() => {
            const repo = Array.from(
                document.querySelectorAll(".wb-break-all > a"),
                (element) => {
                    return {
                        repoName: element.textContent
                            .replace(/\s+/g, " ")
                            .trim(),
                        repoLink: element.href,
                    };
                }
            );

            return {
                repo,
            };
        });

        //2nd push
        arr.push(...again.repo);

        //loop break for disabled button
        const is_disabled = await page.evaluate(
            () => document.querySelector("button[disabled]") !== null
        );
        if (is_disabled === true) {
            break;
        }
    }

    console.log(arr);

    //Write csv
    const csvWriter = createCsvWriter({
        path: "RepoList.csv",
        header: [
            { id: "repoName", title: "RepoName" },
            { id: "repoLink", title: "RepoLink" },
        ],
    });

    csvWriter.writeRecords(arr).then(() => {
        console.log("Your csv is ready...");
    });

    //Close headless browser
    await browser.close();
};

scrapper();
