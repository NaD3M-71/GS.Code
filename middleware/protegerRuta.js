import jwt from "jsonwebtoken";


const protegerRuta = async (req,res,next)=>{
    
    // Verificar si hay un token
    
    const {_token} =  req.cookies
    if (!_token) {
        return res.redirect('/admin-login')
    }

    // Comprobar el token
    try {
        const decoded = jwt.verify(_token,process.env.JWT_SECRET);
        const usuario = {
            usuario: process.env.USUARIO,
            password: process.env.PASSWORD
        }

        console.log(usuario);

    // Almacenar al usuario al Req
        if(usuario) {
            req.usuario = usuario
            return next();
        }else{
            return res.redirect('/admin-login')
        }

    } catch (error) {
        return res.clearCookie('_token').redirect('/admin-login')
    }

    
}

export default protegerRuta