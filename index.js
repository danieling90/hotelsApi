'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')

mongoose.connect(config.db, { useMongoClient: true }, (err, res) => {
    if (err) {
        return console.log(`Error connecting to the database: ${err}`)
    }
    console.log('Connection to the established database...')

    app.listen(config.port, () => {
        console.log(`REST API running in http://localhost:${config.port}`)
    })
})



