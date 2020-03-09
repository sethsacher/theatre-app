const path = require('path')
const url = require('url')
const express = require('express')
const hbs = require('hbs')
const Airtable = require('airtable')
const theatre = require('./utils/theatre')
const refData = require('./utils/refData')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const theatres = base('Theatres')

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
        title: 'Internet Theatre Circuit Database',
        name: 'Seth Sacher'
    })
})

// Dynamic route for theatre details
app.get('/theatre/:id', function (req, res) {
    theatres.find(req.params.id, function(err, record) {
        if (err) { 
            console.error(err)
            return res.send({err})
        }

        res.render('theatre-details', {
            title: record.fields.Theatre,
            name: 'Seth Sacher',
            record: record.fields
        })
    })
    
});

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

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    }

    if (isEmpty(req.query)) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    var params = url.parse(req.url, true).query

    theatre(base, params, (error, records) => {
        if (error) {
            return res.send({ error })
        }

        res.send({
            records
        })
    })
})

app.get('/refData', (req, res) => {
    refData((error, refData) => {
        if (error) {
            return res.send({ error })
        }

        res.send({
            refData
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