const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
const { use } = require("passport");

function initialize(passport, getEmail, getID){
    const AuthUser = async (email, pass, done) =>{
        const user = await getEmail(email);
        if(user == null){
            return done(null, false, {message: "Không tìm thấy tài khoản với email tương ứng"});
        }

        try{
            if(await bcrypt.compare(pass,user.pass)){
                return done(null, user);
            }else{
                return done(null, false, {message: "Mật khẩu không tương ứng"});
            }
        }catch(err){
            return done(e);
        }
    }
    passport.use(new LocalStrategy({username_field: 'email'}, AuthUser));
    passport.serializeUser((user,done) => done(null, user.id));
    passport.deserializeUser(async(id,done) => {
        return done(null, await getID(id))
    });
}

module.exports = initialize;