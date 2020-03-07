const theatre = (base, params, callback) => {

    // if (!params) { return callback('No parameters provided', undefined) }

    const theatres = base('Theatres')

    // Array of basic search terms
    const searchArray = [
        (params.city ? '{City} = "' + params.city + '"' : ''),
        (params.state ? '{State} = "' + params.state + '"' : ''),
        (params.name ? '{Theatre} = "' + params.name + '"' : ''),
        (params.vaudeville ? '{Primarily Vaudeville} = "' + params.vaudeville + '"' : ''),
        (params.manager ? '{Manager} = "' + params.manager + '"' : '')
    ]

    // Remove null search terms
    const filteredArray = searchArray.filter((term) => {
        return term !== ''
    })

    // Construct Airtable query
    var filter = 'AND('
    var count = 1
    for (const term of filteredArray) {
        filter = filter + term + (filteredArray.length === count ? '' : ',')
        count++
    }
    filter = filter + ')'

    console.log('Airtable Query: ' + filter)

    // Get data from Airtable
    theatres.select({
        view: 'Grid view',
        filterByFormula: filter
    }).firstPage((err, records) => {
        if (err) {
            console.error(err)
            return callback('Error occurred', undefined)
        }

        const fields = records.map(a => a.fields)

        if (!fields || fields.length === 0) {
            return callback('No results were found', undefined)
        }

        callback(undefined, fields)
    })

    // theatres.select({
    //     sort: [
    //         {field: 'Theatre', direction: 'asc'}
    //     ]
    // }).eachPage((records, fetchNextPage) => {
    //     records.forEach(function(record) {
    //         console.log('Retrieved ', record.get('Theatre'));
    //         airtableData.push(record.get('Theatre'))
    //     });

    //     fetchNextPage();
    // }, (error) => {
    //     console.log(error);
    // });
}

module.exports = theatre