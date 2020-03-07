// NOTE: This is client-side JS
// The console.log() calls show up in the browser's console

const theatreForm = document.querySelector('form')
const search = document.querySelector('input')
const message1 = document.querySelector('#message-1')
const message2 = document.querySelector('#message-2')
const showData = document.getElementById("showData")

// Load reference data
const addDropdownOption = (elementId, newOption) => {
    var select = document.getElementById(elementId)
    select.options[select.options.length] = new Option(newOption)
}

fetch('/refData').then((res) => {

    res.json().then((data) => {
        if (data.error) {
            console.log('Error retrieving reference data')
        } else {

            // State
            addDropdownOption('state', '')
            const states = data.refData.states
            for ( const index in states ) {
                addDropdownOption('state', states[index])
            }
        }
    })

})

// Get data on Submit
theatreForm.addEventListener('submit', (e) => {
    // Stops page from refreshing
    e.preventDefault()

    message1.textContent = 'Loading...'
    message2.textContent = undefined
    showData.textContent = undefined

    // Construct search query
    const searchQuery = {
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        name: document.getElementById('name').value
    }

    const isEmpty = (value) => {
        return value == null || value == "";
    }

    for(key in searchQuery)
        if(isEmpty(searchQuery[key]))
            delete searchQuery[key]; 

    const params = $.param(searchQuery)

    // console.log('Theater Search Params: ' + params)

    fetch('/theatre?' + params).then((res) => {

        res.json().then((data) => {
            if (data.error) {
                message1.textContent = data.error
                message2.textContent = undefined
                showData.textContent = undefined
            } else {
                // message1.textContent = JSON.stringify(data.records)
                message1.textContent = undefined
                message2.textContent = undefined
                showData.textContent = undefined
                createTableFromJSON(data.records)
            }
        })

    })

})

const createTableFromJSON = (json) => {
    // EXTRACT VALUE FOR HTML HEADER. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    var col = [];
    for (var i = 0; i < json.length; i++) {
        for (var key in json[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < json.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json[i][col[j]];
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}