require('dotenv').config();
const express = require("express");
const { append } = require("express/lib/response");
const mongoose = require("mongoose");
const passport = require('passport');
const flash = require("express-flash");
const session = require('express-session');
const User = require('./models/User');
const iniPass = require('./passport_cfg');
const methodOverride = require("method-override");
const {
    CheckNotAuthenticated,
    CheckAuthenticated
} = require("./middlewared/auth");
const bcrypt = require('bcryptjs/dist/bcrypt');

const app = express();

iniPass(
    passport, async(email) =>{
        const userFinding = await User.findOne({email})
        return userFinding;
    }, async(id) =>{
        const userFinding = await User.findOne({id: id})
        return userFinding;
    }
);


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : true}));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(express.static("public"));

app.get("/" ,CheckAuthenticated ,(req,res) => {
    res.render("main_test", {name: req.user.name});
});

app.get("/register",CheckNotAuthenticated, (req,res) =>{
    res.render("dangky_form");
});

app.get("/login",CheckNotAuthenticated, (req,res) =>{
    res.render("dangnhap_form");
});

app.post("/login", CheckNotAuthenticated, passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash:true
}));

app.post("/register", CheckNotAuthenticated, async(req,res) =>{
    const UserFind = await User.findOne({email: req.body.email});
    if(UserFind){
        req.flash('Cảnh cáo','Tài khoản này đã tồn tại');
        res.redirect("/register");
    }else{
        try{
            const hashPass = await bcrypt.hash(req.body.password,10);
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashPass
            })

            await user.save();
            res.redirect("/login");

        }catch(error){
            console.log(error);
            res.redirect("/register");
        }
    }
});

app.delete('/logout', (req,res) =>{
    req.logOut();
    res.redirect('/login');
})

mongoose.connect("mongodb+srv://cluster0.pdk59.mongodb.net/auth",{
    useUnifiedTopology:true,
    useNewUrlParser: true,
}).then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000...")
    });
});