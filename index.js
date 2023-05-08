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
        `<a href='${article.url}'>
            <div style='border: 1px solid black; width: 350px; text-align: center; padding: .5rem;'>
                <h1>${article.title}</h1>
                <img style='width: 100%;' src='${article.img}' alt='${article.title}'/>
                <p>${article.text}</p>
            </div>
        </a>`
    )).join('')

    res.send(
        `<div style='display: flex; flex-direction: column; align-items: center; gap: 2rem;'>
            ${html}    
        </div>`
    )
})

app.listen(PORT, () => console.log(`server running: ${PORT}`))