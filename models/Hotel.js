'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema


const HotelSchema = Schema({
    id: String,
    name: String,
    stars: Number,
    price: Number,
    image: String,
    amenities: {
        type: [String],
        enum: [
            "bathrobes",
            "bathtub",
            "beach",
            "beach-pool-facilities",
            "business-center",
            "children-club",
            "coffe-maker",
            "deep-soaking-bathtub",
            "fitness-center",
            "garden",
            "kitchen-facilities",
            "newspaper",
            "nightclub",
            "restaurant",
            "safety-box",
            "separate-bredroom",
            "sheets"
        ]
    }
})

module.exports = mongoose.model('Hotel', HotelSchema)

