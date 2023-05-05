const PORT = 8000
import axios from 'axios'
import * as cheerio from 'cheerio'
import express  from 'express'
import cors from 'cors'
import fs from 'node:fs'

const app = express()
app.use(cors())

const url = 'https://gmina.swidnica.pl'
const articles = []
let text = ``

let options = {    charset: 'utf8', responseEncodig: 'utf8'}

axios(url,options).then(response => {
    const html = response.data
    const $ = cheerio.load(html,{ decodeEntities: true })

    $('a.contentpagetitle').each(function(){
        const title = $(this).text()
        articles.push({title: title, url: url})
    })

    articles.forEach(element => {
        text += ` ${element.title} - ${element.url} `
    })

    fs.writeFile('./bruh.txt', text, err => {
        if (err) {
          console.error(err);
        }
    })

})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))