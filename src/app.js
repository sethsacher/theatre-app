const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

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
        title: 'Weather app',
        name: 'Seth Sacher'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Seth Sacher'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Come here to get help',
        title: 'Help page',
        name: 'Seth Sacher'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            // Since JSON field and variable have the same name,
            // we can just write "error" once
            return res.send({error})
        }

        forecast(latitude, longitude, (error, dataForecast) => {
            if (error) {
                return res.send({error})
            }

            res.send({
                forecast: dataForecast,
                location,
                address: req.query.address
            })
        })
    }) 
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        errorText: 'Help article not found',
        title: '404 Help',
        name: 'Seth Sacher'
    })
})

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