const mongoose = require("mongoose");
const initData = require("./data2.js");

const place = require("../models/placeModel.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/miniproject";

main()
.then(()=>{
    
    console.log("connected to database");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const initDB = async ()=>{

    
    await place.insertMany(initData.data);
    console.log("data was initilised");
}

initDB();
// run this file in terminal 1 1.cd init  2.node index.js


