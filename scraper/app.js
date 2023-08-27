const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const url = 'https://www.bbc.co.uk/sport/football/66552613'

    const browser = await puppeteer.launch({
        dumpio: true
    })
    const page = await browser.newPage()
    await page.goto(url)
   
    const commentsButtonSelector = '.view-comments-button'
    await page.waitForSelector(commentsButtonSelector)
    await page.click(commentsButtonSelector)

    await page.waitForSelector('.comments-list')

    let pageCount = 1
    let hasMorePages = true

    const moreCommentsButtonSelector = '.comments__more-comments-button'
    while (pageCount <= 10 && hasMorePages) {
        let moreCommentsButton = (await page.waitForSelector(moreCommentsButtonSelector, { timeout: 10000 })) || ""
        if (moreCommentsButton) {
            await page.click(moreCommentsButtonSelector)
            pageCount++
        } else {
            hasMorePages = false
        }
    }

    // todo: figure out why the not() isn't working; enrich data
    const comments = await page.evaluate(() => {
        return [...document.querySelectorAll('ul.comments-list:not(.replies-list-reply-open) .comment__text')].map((commentEl) => {
            return commentEl.textContent
        })
    })

    const fileData = {
        date: new Date().getTime(),
        comments: comments
    }

    fs.writeFile('comments.json', JSON.stringify(fileData), err => {
        if (err) {
            console.error(err)
        }
    })

    await browser.close()
})()