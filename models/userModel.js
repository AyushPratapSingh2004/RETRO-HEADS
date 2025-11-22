const mongoose = require("mongoose");


//this lne is not that necessary we can directly use mongoose.schema
const Schema = mongoose.Schema;

const storySchema = new Schema({

    username :{

        type : String,
        
    },

    title:{

        type: String,
    },

    story :{

        type : String,
    },

    

});

const story = mongoose.model("story" , storySchema);

module.exports = story;