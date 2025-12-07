const express = require("express");

const mysql = require("mysql2");

const app = express();

const port = 8080;

const mongoose = require('mongoose');

const path = require("path");

const Story = require("./models/userModel");

const Place = require("./models/placeModel");

const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/miniproject";

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'miniproject',
  password : "Ayush@rev1"
});

// const connection = mysql.createConnection({
//   host: process.env.MYSQL_HOST || 'localhost',
//   user: process.env.MYSQL_USER || 'root',
//   password: process.env.MYSQL_PASSWORD || 'root',
//   database: process.env.MYSQL_DATABASE || 'miniproject'
// });


main()
.then(()=>{ 
    
    console.log("connected to database");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const session = require("express-session");

app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false
}));


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
           
             console.log(data);
             req.session.userinfo = data;
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

app.get("/forgot-password", (req, res) => {
    res.render("forgotPassword");
});


app.post("/forgot-password", (req, res) => {
    const { username, email, newPassword } = req.body;

    let q = "SELECT * FROM retro WHERE username = ? AND email = ?";

    connection.query(q, [username, email], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Server Error");
        }

        if (result.length === 0) {
            return res.send("Invalid username or email!");
        }

        // Update password
        let updateQuery = "UPDATE retro SET password = ? WHERE username = ?";

        connection.query(updateQuery, [newPassword, username], (err2, updateResult) => {
            if (err2) {
                console.log(err2);
                return res.send("Unable to update password");
            }

            res.send(`
                <h2>Password Reset Successful!</h2>
                <a href="/login">Go to Login</a>
            `);
        });
    });
});


app.get("/user/home", async(req,res)=>{

let storyData = await Story.find();

res.render("homepg",{storyData});
})



app.get("/user/newStory" , (req,res)=>{
    const info = req.session.userinfo;
    
    if(info == undefined){
        res.redirect("/login");
    }
    console.log(info);
    res.render("newStory.ejs",{info});
    
})

app.post("/user/newStory/:username",async(req,res)=>{
    
    const {username} = req.params;
    const { title, story } = req.body;
    await Story.create({ username,title, story });
    res.redirect("/user/home");
})

app.get("/user/profile", async (req, res) => {
    const info = req.session.userinfo;

    if (!info) {
        return res.redirect("/login");
    }

    
    const userStories = await Story.find({ username: info.username });

    res.render("profile", { info, userStories });
});

app.post("/user/delete/:id", async (req, res) => {
    const info = req.session.userinfo;
    const storyId = req.params.id;

    if (!info) {
        return res.redirect("/login");
    }

    
    const story = await Story.findById(storyId);

    
    if (story.username !== info.username) {
        return res.send("You cannot delete someone else's post!");
    }

    await Story.findByIdAndDelete(storyId);

    res.redirect("/user/profile");
});


app.get("/user/search", async (req, res) => {
    const { username } = req.query;

    if (!username || username.trim() === "") {
        return res.render("searchResults", { stories: [], username: null, message: "Please enter a username." });
    }

    const userStories = await Story.find({ username: username.trim() });

    if (userStories.length === 0) {
        return res.render("searchResults", { stories: [], username, message: "No stories found for this user." });
    }

    res.render("searchResults", { stories: userStories, username, message: null });
});


app.get("/user/places", async (req, res) => {
    const places = await Place.find();
    res.render("placesHome", { places });
});


app.get("/user/places/new", (req, res) => {
    const info = req.session.userinfo;
    if (!info) return res.redirect("/login");

    res.render("newPlace", { info });
});


app.post("/user/places/new/:username", async (req, res) => {
    const { username } = req.params;
    const { placeName, state, city, description, bestTimeToVisit } = req.body;

    await Place.create({
        username,
        placeName,
        state,
        city,
        description,
        bestTimeToVisit
    });

    res.redirect("/user/places");
});


app.get("/user/places/view/:id", async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render("placeDetails", { place });
});


app.post("/user/places/delete/:id", async (req, res) => {
    const info = req.session.userinfo;
    if (!info) return res.redirect("/login");

    const place = await Place.findById(req.params.id);

    // Check user access
    if (place.username !== info.username) {
        return res.send("You cannot delete this place!");
    }

    await Place.findByIdAndDelete(req.params.id);
    res.redirect("/user/places");
});
