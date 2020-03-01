// NOTE: This is client-side JS
// The console.log() calls show up in the browser's console

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const message1 = document.querySelector('#message-1')
const message2 = document.querySelector('#message-2')

weatherForm.addEventListener('submit', (e) => {
    // Stops page from refreshing
    e.preventDefault()

    const location = search.value

    message1.textContent = 'Loading...'
    message2.textContent = undefined

    fetch('/weather?address=' + location).then((res) => {

        res.json().then((data) => {
            if (data.error) {
                message1.textContent = data.error
                message2.textContent = undefined
            } else {
                message1.textContent = data.location
                message2.textContent = data.forecast
            }
        })
    })
})