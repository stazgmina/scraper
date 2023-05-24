const PORT = 3003 || 8000
import cors from 'cors'
import axios from 'axios'
import express  from 'express'
import * as cheerio from 'cheerio'


const app = express()
app.use(cors())

const scraper = async () => {

    let products = []
    let i = 1
    
    while(i<=2){ //88

        const response = await axios.get(`https://www.dermstore.com/skin-care.list?pageNumber=${i}`) 
        const html = response.data
        const $ = cheerio.load(html)
        $('div .productBlock').each((i, element) => {
            const brand = $(element).attr('data-product-brand')
            const name = $(element).attr('data-product-name')
            const image = $(element).find('img').attr('src')
    
            const value = name.toLocaleLowerCase()
            const matchArray = value.match(/cleanser|exfoliant|exfoliator|moisturizer|lotion|scrub|cream|spf|sunscreen|eye|serum|oil|cleansing|hydrator|toner/gm)
            const matchValue = matchArray ? matchArray[0] : 'unknown';

            let category = ''

            switch(matchValue){
                case 'exfoliant':
                case 'exfoliator':
                case 'scrub':
                    category = 'exfoliator'
                    break
                case 'cleanser':
                case 'cleansing':
                    category = 'cleanser'
                    break
                case 'moisturizer':
                case 'lotion':
                case 'hydrator':
                    category = 'moisturizer'
                    break
                    case 'spf':
                    case 'sunscreen':
                        category = 'sunscreen'
                        break
                default:
                    category = matchValue
                    break

            }

            products.push({id: i,brand: brand,name: name,category: category, image: image})
        })

        i++
    }

    console.log(products)
}

scraper()

app.listen(PORT, () => console.log(`server running: ${PORT}`))