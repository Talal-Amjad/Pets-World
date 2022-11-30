const Auth = (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect("/Signin");
    }
    next();
};
const userAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/Signin");
    }
    next();
};


module.exports=
{
    Auth,
    userAuth
};
