const path = require('path')
const express = require('express')
const hbs = require('hbs')
const Airtable = require('airtable')
const theatre = require('./utils/theatre')

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// TODO: Better API Key management
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

const app = express()
// Default to 3000 if PORT not set
const port = process.env.PORT || 3000

// Define paths for Express config
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(path.join(__dirname, '../public')))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Theatre Search',
        name: 'Seth Sacher'
    })
})

// app.get('/help', (req, res) => {
//     res.render('help', {
//         helpText: 'Come here to get help',
//         title: 'Help',
//         name: 'Seth Sacher'
//     })
// })

app.get('/history', (req, res) => {
    res.render('history', {
        title: 'A Short History of Road Houses and Theatre Circuits',
        name: 'Seth Sacher'
    })
})

app.get('/circuits', (req, res) => {
    res.render('circuits', {
        title: 'Sample Circuits',
        name: 'Seth Sacher'
    })
})

app.get('/guide', (req, res) => {
    res.render('guide', {
        title: 'The Julius Cahn Official Theatrical Guides',
        name: 'Seth Sacher'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'What’s in this database',
        name: 'Seth Sacher'
    })
})

app.get('/additional-information', (req, res) => {
    res.render('additional-information', {
        title: 'Additional Information and Other Resources',
        name: 'Seth Sacher'
    })
})

app.get('/theatre', (req, res) => {
    if(!req.query.city) {
        return res.send({
            error: 'You must provide a city.'
        })
    }

    theatre(base, req.query.city, (error, records) => {
        if (error) {
            // Since JSON field and variable have the same name,
            // we can just write "error" once
            return res.send({error})
        } 

        res.send({
            records
        })
    }) 
})

// app.get('/help/*', (req, res) => {
//     res.render('error', {
//         errorText: 'Help article not found',
//         title: '404 Help',
//         name: 'Seth Sacher'
//     })
// })

app.get('*', (req, res) => {
    res.render('error', {
        errorText: 'Page not found',
        title: '404',
        name: 'Seth Sacher'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})