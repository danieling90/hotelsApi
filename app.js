'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const swagger = require('swagger-express')
const swaggerUi = require('express-swagger-ui')
const api = require('./routes')
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({origin: '*'}));
app.use('/api', api)

swaggerUi({
  app       : app,
  swaggerUrl: '/api-docs.json/api', 
  localPath : '/swagger' 
});

app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    swaggerURL: '/swagger',
    swaggerJSON: '/api-docs.json',
    swaggerUI: '/swagger',
    basePath: 'http://localhost:8080',
    apis: ['./controllers/hotel.js']
  }));

module.exports = app;