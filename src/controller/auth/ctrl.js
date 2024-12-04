const { UserDAO } = require("../../DAO");
const {
    verifyPassword,
    generatePassword,
} = require('../../lib/authentication');

const signInForm = async (req,res,next) => {
    try{
        const {user} = req.session;
        console.log("Session before login:", req.session);
        if (user) res.redirect("/");
        else res.render("auth/sign-in.pug", {user});
    } catch (err){
        console.error("Error in signIn:", err);
        return next(err);
    }
}

const signIn = async (req, res, next) => {
    try {
        console.log(`hi there`);
        const {username, password} = req.body;

        console.log(`username is ${username}`);
        if(!username || !password) throw new Error("BAD_REQUEST");

        const user = await UserDAO.getByUsername(username);

        if(!user) throw new Error("UNAUTHORIZED");
        else console.log("find user!");

        const isValid = await verifyPassword(password,user.password);

        if (!isValid) throw new Error("UNAUTHORIZED");
        else console.log("right password!");

        const { id, displayName, isActive, isStaff } = user;

        req.session.user = {id, username, displayName, isActive, isStaff };
        
        console.log("Session after login:", req.session);
        return res.redirect("/");
    }catch (err){
        return next(err);
    }
};

const signUpForm = async (req,res,next) => {
    try{
        const { user } = req.session;
        
        return res.render("auth/sign-up.pug", )
    }catch (err){
        return next(err);
    }
};

const signUp = async (req,res,next) => {
    try{
        const {username, password, displayName } = req.body;

        if (!username ||
            username.length > 16 ||
            !password ||
            !displayName ||
            displayName.length > 32
        ) throw new Error("BAD_REQUEST");

        const hashedPassword = await generatePassword(password);
        await UserDAO.createUser(username, hashedPassword, displayName);
        return res.redirect('/auth/sign_in');
    } catch (err) {
        return next(err);
    }
};


// GET /auth/sign_out
const signOut = async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if (err) throw err;
            else return res.redirect('/');
        });
    } catch (err) {
        return next(err);
} };


module.exports = {
    signInForm,
    signIn,
    signUpForm,
    signUp,
    signOut,
};
