const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/b52a666bf0db1dd0cdb4268d4b3fc424/' + latitude + ',' + longitude

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service.', undefined)
        } else if (body.error) {
            callback('Unable to find location.', undefined)
        } else {
            const currently = body.currently
            callback(
                undefined,
                body.daily.data[0].summary + 
                ' It is currently ' + currently.temperature + ' degrees out. There is a ' + currently.precipProbability + '% chance of rain. ' +
                'The UV Index is ' + body.daily.data[0].uvIndex
            )
        }
    })

}

module.exports = forecast