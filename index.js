const express = require("express");

const app = express();

const port = 8080;

const path = require("path");

app.listen(port , ()=>{

    console.log(`listening through port ${port}`);
});

app.set("view engine","ejs");

app.set("views", path.join(__dirname,"views"));

app.use(express.static("public"));


app.get("/",(req,res)=>{

    res.render("home");
});

app.get("/login",(req,res)=>{

    res.render("login");
});

app.get("/signup",(req,res)=>{

    res.render("signup");
})