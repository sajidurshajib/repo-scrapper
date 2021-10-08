const puppeteer = require('puppeteer');


let arr = []

const scrapper = async () => {
    const url = 'https://github.com/sajidurshajib?tab=repositories'

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle2',
    });
  
    //My code
    const test = await page.evaluate(() => {
        const repo = Array.from(
            document.querySelectorAll('.wb-break-all > a'), 
                element => element
                        .textContent
                        .replace(/\s+/g, ' ')
                        .trim()
            )

        return {
            repo
        };
    });
    
    //1st push
    arr.push(...test.repo)


    while(await page.$('.BtnGroup > .BtnGroup-item:nth-child(2)')){
        await page.click('.BtnGroup > .BtnGroup-item:nth-child(2)')

        await page.goto(page.url(), {
            waitUntil: 'networkidle2',
        });
        const again = await page.evaluate(() => {
            const repo = Array.from(
                document.querySelectorAll('.wb-break-all > a'), 
                    element => element
                            .textContent
                            .replace(/\s+/g, ' ')
                            .trim()
                )
    
            return {
                repo
            };
        });



        //2nd push
        arr.push(...again.repo)

        //loop break for disabled button
        const is_disabled = await page.evaluate(() => document.querySelector('button[disabled]') !== null)
        if(is_disabled===true){
            break
        }
        
    }

    console.log(arr)
    await browser.close();
}

scrapper()


