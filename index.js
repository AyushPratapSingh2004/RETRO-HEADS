const express = require("express");

const mysql = require("mysql2");

const app = express();

const port = 8080;

const path = require("path");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'miniproject',
  password : "Ayush@rev1"
});

app.listen(port , ()=>{

    console.log(`listening through port ${port}`);
});

app.set("view engine","ejs");

app.set("views", path.join(__dirname,"views"));

app.use(express.static("public"));

app.use(express.urlencoded({extended :true}));


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

            res.send("no user found ");
        }

        if(password != pass || email != mail ){

            res.send("incorrect email or  password");
        }

        if(password == pass){

            res.render("user",{data});
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