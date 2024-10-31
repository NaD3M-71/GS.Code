import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'password'
}, async(usuario, password, done)=>{
        if(usuario != process.env.USUARIO) return done(null, false, {
            message: 'Usuario Inexistente'
        });
        // si el usuario existe, lo verificamos
        
        if(password != process.env.PASSWORD) return done(null, false, {
            message: 'Password Incorrecto'
        })
        // El usuario existe y el password es correcto
            return done(null, usuario );
}));

passport.serializeUser((usuario,done) => done(null,usuario._id))

passport.deserializeUser(async (id,done) =>{
    const usuario = await Usuarios.findById(id);
    return done(null,usuario);
});

module.exports = passport;