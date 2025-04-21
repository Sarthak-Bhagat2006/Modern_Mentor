

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        
        req.flash("error","You have to logged in first !!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUser = (req,res,next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
       
        
    }
    next();
};


