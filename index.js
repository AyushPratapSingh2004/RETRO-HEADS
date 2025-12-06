const express = require("express");

const mysql = require("mysql2");

const app = express();

const port = 8080;

const mongoose = require('mongoose');

const path = require("path");

const Story = require("./models/userModel");

const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/miniproject";

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'miniproject',
  password : "Ayush@rev1"
});

main()
.then(()=>{ 
    
    console.log("connected to database");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.listen(port , ()=>{

    console.log(`listening through port ${port}`);
});

app.set("view engine","ejs");

app.set("views", path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname, "public")));


app.use(express.urlencoded({extended :true}));

app.engine("ejs",ejsMate);

app.get("/",(req,res)=>{

    res.render("home");
});

app.get("/login",(req,res)=>{

    res.render("login");
});

app.get("/signup",(req,res)=>{

    res.render("signup");
})



app.post("/user",(req,res)=>{

    let {username , email , password} = req.body;

    let q = "select * from retro where username = ?"

    connection.query(q,[username],(err, result)=>{

        if(err){

            console.log(err);
        }
        
        let data = result[0];
        let pass = result[0].password;
        let mail = result[0].email;

        if(result.length==0){

           return res.send("no user found ");
        }

        if(password != pass || email != mail ){

           return res.send("incorrect email or  password");
        }

        if(password.length < 8){

            return res.send("password should  atleat contain 8 letters");
        }

        if(password == pass){

           return res.render("user",{data}); 
        }
  
    })
})

app.post("/newUser",(req,res)=>{
    
    let {username,email,password} = req.body;
    let q = "insert into retro(username,email,password) values (?,?,?)";

    connection.query(q,[username,email,password],(err,result)=>{
            
        console.log(result);
        res.redirect("login");

    })

})

app.get("/user/home", async(req,res)=>{

let storyData = await Story.find();

res.render("homepg",{storyData});
})