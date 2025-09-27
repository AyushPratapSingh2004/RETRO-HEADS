let loginBtn = document.querySelector(".login");
let signupBtn = document.querySelector(".signup");
console.log(loginBtn);

loginBtn.addEventListener("click",()=>{

     window.location.href = "http://localhost:8080/login";

    
});

signupBtn.addEventListener("click",()=>{

     window.location.href = "http://localhost:8080/signup";

    
});