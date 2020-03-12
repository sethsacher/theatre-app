const theatre = (base, params, callback) => {

    // if (!params) { return callback('No parameters provided', undefined) }

    const theatres = base('Theatres')

    // Array of basic search terms
    const searchArray = [
        (params.city ? 'FIND("' + params.city +'", {City}, 0)' : ''),
        (params.state ? '{State} = "' + params.state + '"' : ''),
        (params.name ? 'FIND("' + params.name +'", {Theatre}, 0)' : ''),
        (params.vaudeville ? '{Primarily Vaudeville} = "' + params.vaudeville + '"' : ''),
        (params.manager ? 'FIND("' + params.manager +'", {Manager}, 0)' : ''),
        (params.year ? 'FIND("' + params.year +'", {Years active}, 0)' : ''),
        (params.circuit ? '{Circuit Name} = "' + params.circuit + '"' : '')
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
        filterByFormula: filter,
        fields: ["Theatre_ID", "Theatre", "City", "Circuit Name"]
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