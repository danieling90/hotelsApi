'use strict'

const express = require('express')
const hotelCtrl = require('../controllers/hotel');
const api = express.Router();

api.post('/hotel', hotelCtrl.insertHotel)
api.post('/hotel/list', hotelCtrl.getHotels)
api.get('/hotel/:hotelId', hotelCtrl.getHotel)
api.delete('/hotel/:hotelId', hotelCtrl.deleteHotel)
api.put('/hotel/:hotelId', hotelCtrl.updateHotel)

module.exports = api