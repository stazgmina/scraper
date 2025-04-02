const PORT = 3003 || 8000
import cors from 'cors'
import express  from 'express'
import puppeteer from 'puppeteer'
// import * as cheerio from 'cheerio'
// import axios from 'axios'

// const url = 'https://www.x-kom.pl/goracy_strzal'
// godziny 22:00  // 10:00

const app = express()
app.use(cors())

const bot = async () => {

    function delay(time) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        })
     }

    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto('https://www.x-kom.pl/p/1144748-sluchawki-bezprzewodowe-meizu-pop-2s.html')

    const acceptCookies = await page.waitForSelector('.dRLEBj')
    await delay(3000) // TEST
    await acceptCookies.click()

    await delay(3000) // TEST
    const addToCart = await page.waitForSelector('[data-name=addToBasketButton]')
    await addToCart.click()

    const goToCart = await page.waitForSelector('.dQxHSV')
    await goToCart.click()

    await delay(3000) // TEST
    await page.goto('https://www.x-kom.pl/zamowienie')

    const name = await page.waitForSelector('[name=recipientName]')
    await name.type('John Doe', {delay: 100})

    const street = await page.waitForSelector('[name=recipientStreet]')
    await street.type('Głowackiego 4', {delay: 100})

    const postal = await page.waitForSelector('[name=recipientPostalCode]')
    await postal.type('58-100 Świdnica', {delay: 100})

    const city = await page.waitForSelector('[name=recipientCity]')
    await city.type('Świdnica', {delay: 100})

    const number = await page.waitForSelector('[name=recipientPhoneNumber]')
    await number.type('696 997 911', {delay: 100})

    const email = await page.waitForSelector('[name=recipientEmail]')
    await email.type('dzondoe@doe.com', {delay: 100})

    await delay(3000)
    const paymentBox = await page.waitForSelector('.cWqeuf')
    const methods = await paymentBox.$$('.hwPbot')
    const blik = methods[1]
    await blik.click()


    await delay(3000)
    if(await page.waitForSelector('.ejgVFR')){
        const checkboxes = await page.$$('.ejgVFR')
        const acceptTerms = checkboxes[3]
        await acceptTerms.click()

        await delay(5000)
        const checkout = await page.waitForSelector('.cnUgwg')
        await checkout.click()
    }
}

bot()

app.listen(PORT, () => console.log(`server running: ${PORT}`))
