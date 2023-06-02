const PORT = 3003 || 8000
import cors from 'cors'
import axios from 'axios'
import express  from 'express'
import * as cheerio from 'cheerio'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const app = express()
app.use(cors())

const scraper = async () => {

    let products = []
    let i = 1
    
    while(i<=4){ 

        const response = await axios.get(`https://www.dermstore.com/skin-care.list?pageNumber=${i}`) 
        const html = response.data
        const $ = cheerio.load(html)
        $('div .productBlock').each((i, element) => {
            const brand = $(element).attr('data-product-brand')
            const name = $(element).attr('data-product-name')
            const image = $(element).find('img').attr('src')
    
            const value = name.toLocaleLowerCase()
            const matchArray = value.match(/cleanser|creme|exfoliant|moisturizing|exfoliating|aha|bha|pha|foliant|acid|exfoliator|hydrating|moisturizer|lotion|scrub|cream|spf|sunscreen|eye|serum|oil|cleansing|hydrator|toner|treatment|essence|mask|sheet/gm)
            const matchValue = matchArray ? matchArray[0] : 'unknown';

            let category = ''

            switch(matchValue){
                case 'exfoliant':
                case 'exfoliating':
                case 'exfoliator':
                case 'scrub':
                case 'foliant':
                case 'acid':
                case 'aha':
                case 'bha':
                case 'pha':
                    category = 'exfoliator'
                    break
                case 'cleanser':
                case 'cleansing':
                    category = 'cleanser'
                    break
                case 'moisturizer':
                case 'moisturizing':
                case 'lotion':
                case 'hydrator':
                case 'hydrating':
                    category = 'moisturizer'
                    break
                    case 'spf':
                    case 'sunscreen':
                        category = 'sunscreen'
                        break
                    case 'creme':
                        category = 'cream'
                        break
                default:
                    category = matchValue
                    break

            }

            products.push({id: i,brand: brand,name: name,category: category, image: image})
        })

        i++
    }

    products.forEach(async (product,i) => {
        await prisma.product.create({
            data: {
                brand: product.brand,
                name: product.name,
                category: product.category,
                image: product.image
            }
        }).finally(()=>{
            console.log(`${i}. Product: - ${product.name}_inserted into database.`)
        })
    })
}

scraper()

app.listen(PORT, () => console.log(`server running: ${PORT}`))