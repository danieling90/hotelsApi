const Hotel = require('../models/Hotel');

/**
 * @swagger
 * resourcePath: /api
 * description: All about API
 */

/**
 * @swagger
 * path: /api/hotel/{hotelId}
 * operations:
 *   -  httpMethod: GET
 *      summary: Get a hotel based on id
 *      nickname: get
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: hotelId
 *          description: Identifier
 *          paramType: path
 *          required: true
 *          type: string
 */
function getHotel(req, res) {
    let hotelId = req.params.hotelId

    Hotel.findById(hotelId, (err, hotel) => {
        if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
        if (!hotel) return res.status(404).send({ message: `The hotel does not exist` })

        res.status(200).send({ hotel: hotel })
    })
}

/**
 * @swagger
 * path: /api/hotel/list
 * operations:
 *   -  httpMethod: POST
 *      summary: Returns a hotels collections
 *      nickname: list
 *      consumes: 
 *          - text/html
 *          - application/json
 *      produces: 
 *          - application/json
 *      parameters:
 *        - name: name
 *          paramType: body
 *          required: false
 *          type: string
 *          description: hotel name 
 *        - name: stars
 *          paramType: body
 *          required: false
 *          type: string
 *          description: hotel stars
 *        - name: amenities
 *          paramType: body
 *          required: false
 *          type: string
 *          description: hotel amenities
 */
function getHotels(req, res) {

    let filters = {};

    if (req.body.name !== undefined) {
        filters.name = { $regex: new RegExp(req.body.name, "i") };
    }

    if (req.body.stars !== undefined) {
        let stars = req.body.stars.split(',').map(function (x) {
            return parseInt(x);
        })
        filters.stars = { "$in": stars };
    }

    if (req.body.priceMin !== undefined || req.body.priceMax !== undefined) {
        let min = (req.body.priceMin === undefined) ? 0 : req.body.priceMin;
        let max = (req.body.priceMax === undefined) ? 1000000 : req.body.priceMax;
        filters.price = { $gt: req.body.priceMin, $lt: req.body.priceMax };
    }

    if (req.body.amenities !== undefined) {
        let amenities = req.body.amenities.split(',');
        filters.amenities = { "$in": amenities };
    }    

    console.log(req.body);

    Hotel.count(filters,(err, count) => {
        if (err) return res.status(500).send({ message: `Error making the request: ${err}` })

        Hotel.
        find(filters).
        limit((req.body.limit === undefined) ? 20: req.body.limit).
        skip((req.body.skip === undefined) ? 1: req.body.skip).
        sort({ name: 1 }).
        exec((err, hotels) => { 
            if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
            res.status(200).send({ hotels: hotels , total: count})
        });
    });    
}

/**
 * @swagger
 * path: /api/hotel/{hotelId}
 * operations:
 *   -  httpMethod: PUT
 *      summary: Update a hotel based on id
 *      nickname: update
 *      responseClass: Hotel 
 *      consumes: 
 *          - text/html
 *          - application/json
 *      produces: 
 *          - application/json
 *      parameters:
 *        - name: hotelId
 *          paramType: path
 *          required: true
 *          type: int
 *          description: identifier
 */
function updateHotel(req, res) {
    let hotelId = req.params.hotelId
    let dataUpdate = req.body

    Hotel.findByIdAndUpdate(hotelId, dataUpdate, (err, hotelUpdated) => {
        if (err) return res.status(500).send({ message: `Error updating the product: ${err}` })
        if (!hotelUpdated) return res.status(404).send({ message: `The hotel does not exist` })

        res.status(200).send({ message: `The hotel has been updated` })

    })
}

/**
 * @swagger
 * path: /api/hotel/{hotelId}
 * operations:
 *   -  httpMethod: DELETE
 *      summary: Delete a hotel based on id
 *      nickname: delete
 *      consumes: 
 *          - text/html
 *          - application/json
 *      produces: 
 *          - application/json
 *      parameters:
 *        - name: hotelId
 *          paramType: path
 *          required: true
 *          type: int
 *          description: identifier
 */
function deleteHotel(req, res) {
    let hotelId = req.params.hotelId

    Hotel.findById(hotelId, (err, hotel) => {
        if (err) return res.status(500).send({ message: `Error deleting the hotel: ${err}` })
        if (!hotel) return res.status(404).send({ message: `The hotel does not exist` })

        hotel.remove(err => {
            if (err) return res.status(500).send({ message: `Error deleting the hotel: ${err}` })
            res.status(200).send({ message: `The hotel has been eliminated` })
        })

    })
}

/**
 * @swagger
 * path: /api/hotel/
 * operations:
 *   -  httpMethod: POST
 *      summary: Create a new Hotel
 *      responseClass: Hotel
 *      nickname: create
 *      consumes: 
 *          - text/html
 *          - application/json
 *      produces: 
 *          - application/json
 *      parameters:
 *          - name: Hotel
 *            paramType: body
 *            required: true
 *            type: Hotel
 *            description: Entity
 */
function insertHotel(req, res) {
    let hotel = new Hotel();
    hotel.id = req.body.id
    hotel.name = req.body.name
    hotel.stars = req.body.stars
    hotel.price = req.body.price
    hotel.price = req.body.price
    hotel.amenities = req.body.amenities

    hotel.save((err, hotelStored) => {
        if (err) res.status(500).send({ message: 'Error saving the hotel ' })

        res.status(200).send({ hotel: hotelStored })
    })
}

/**
 * @swagger
 * models:
 *   Hotel:
 *     id: Hotel
 *     properties:
 *       name:
 *         type: string
 *       stars:
 *         type: int    
 *       price:
 *         type: int    
 *       image:
 *         type: string    
 *       amenities:
 *         type: array    
 */
module.exports = {
    getHotel,
    getHotels,
    updateHotel,
    deleteHotel,
    insertHotel
}