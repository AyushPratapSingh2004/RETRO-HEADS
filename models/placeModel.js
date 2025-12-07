const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    placeName: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String 
    },
    description: { 
        type: String, 
        required: true 
    },
    bestTimeToVisit: { 
        type: String 
    },
    
});

const place = mongoose.model("Place", placeSchema);

module.exports = place;