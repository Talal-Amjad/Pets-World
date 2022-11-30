const Auth = (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect("/Signin");
    }
    next();
};


module.exports=Auth;
