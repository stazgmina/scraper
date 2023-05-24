const PORT = 3003 || 8000
import cors from 'cors'
import axios from 'axios'
import express  from 'express'
import iconv from 'iconv-lite'
import * as cheerio from 'cheerio'

const app = express()
app.use(cors())

const url = 'https://gmina.swidnica.pl'

const fetchArticles = async () => {
    const response = await axios.get(url, {responseType: 'arraybuffer'})
    const html = iconv.decode(Buffer.from(response.data), 'iso-8859-2')

    const $ = cheerio.load(html)

    const articles = $('a.contentpagetitle').map((i, element) => ({
        title: $(element).text().trim(),
        url: $(element).attr('href')
    })).get()

    for(const article of articles){
        const response2 = await axios.get(article.url, {responseType: 'arraybuffer'})
        const html2 = iconv.decode(Buffer.from(response2.data), 'iso-8859-2')

        const $$ = cheerio.load(html2)

        article.img = $$('p').find('img').attr('src')
        article.text = $$('p').find('b').text().trim()
    }

    return articles
}

app.get('/', async (req, res) => {
    const articles = await fetchArticles()

    console.log(articles)

    const html = articles.map(article => (
        `<a style="text-decoration: none; color: black;" href='${article.url}'>
            <div style='display: flex; flex-direction: column; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; border-radius: 2rem;  width: 500px;font-family: "Helvetica"; text-align: center;'>
                <h1 style="padding: 1rem;">${article.title}</h1>
                <img style='width: 100%;' src='${article.img}' alt='${article.title}'/>
                <p style="line-height: 1.5rem; padding: 1rem; letter-spacing: .08rem; flex-grow: 1;">${article.text}</p>
            </div>
        </a>`
    )).join('')

    res.send(
        `<div style='width: 100vw; display: flex; flex-wrap: wrap;  align-items: center; gap: 2rem; justify-content: center;'>
            ${html}    
        </div>`
    )
})

app.listen(PORT, () => console.log(`server running: ${PORT}`))

