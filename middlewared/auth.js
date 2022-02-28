function CheckNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect("/");
    }
    next();
}

function CheckAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = {
    CheckNotAuthenticated,
    CheckAuthenticated
}