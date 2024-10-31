import { generarJWT, generarId } from "../helpers/tokens.js";
import { check, validationResult } from "express-validator";

const login = async (req,res) =>{
    const admin = "panel";
    res.render('admin/login',{
        pagina:"Inicia sesion de administrador",
        admin
    })
}


const autenticar = async (req, res) => {
    //Validación
    await check("usuario")
      .isEmail()
      .withMessage("El Email es obligatorio")
      .run(req);
    await check("password")
      .notEmpty()
      .withMessage("El Password es obligatorio")
      .run(req);
  
    let resultado = validationResult(req);

    console.log(req.body);
  
    //Verificar que el resultado este vacio
  
    // if (!resultado.isEmpty()) {
    //   //errores
    //   return res.render("admin/login", {
    //     pagina: "Inicia sesion de administrador",
    //     errores: resultado.array(),
    //   });
    // }
    const { usuario, password } = req.body;
    //Comprobar que el usuario este registrado
    const Usuario = {
        usuario: process.env.USUARIO,
        password: process.env.PASSWORD,
        id: 40089752
    }
    if (usuario != Usuario.usuario) {
      return res.render("admin/login", {
        pagina: "Inicia sesion de administrador",
        errores: [{ msg: `el usuario ${usuario} no existe` }],
      });
    }

    //Revisar el password
    if (password != Usuario.password) {
      return res.render("admin/login", {
        pagina: "Inicia sesion de administrador",
        errores: [
          {
            msg: `La contraseña es Incorrecta`,
          },
        ],
      });
    }
    //Autenticar al usuario con un JWT(JSON Web Token)
    const token = generarJWT({ id: Usuario.id, nombre: usuario.nombre });
    console.log(token);
  
    //Almacenar el JWT en un cookie
    return res
      .cookie("_token", token, {
        httpOnly: true,
        // secure: true, //-->esta opcion solo funciona con certificaciones https y en esta instancia no de desarrollo no tenemos certificacion
        // sameSite:true //-->idem a la opcion secure
      })
      .redirect("/admin");
  };


  export {
    login,
    autenticar
  }