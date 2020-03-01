const theatre = (base, city, callback) => {

    const theatres = base('Theatres')

    theatres.select({
        view: 'Grid view'
    }).firstPage((err, records) => {
        if (err) {
          console.error(err)
          return callback('Error occurred', undefined)
        }

        const fields = records.map(a => a.fields)

        // if(!records || !records.airtableData || !records.airtableData.fields) {
        //     return callback ('Records not found', undefined)
        // }

        //all records are in the `records` array, do something with it
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