// Imports
import {emailContacto, recibirConsulta} from "../helpers/emails.js"
// **CONTROLADORES**


// Vista Contactos
const contactos = (req,res) =>{
    res.render('contactos/contacto',{
        pagina:"Contacto",

    })
}

// const enviarConsulta = (req,res) =>{
//     console.log(req.body);
//     res.render('templates/exito',{
//         pagina: "Contacto",
//         mensaje: "Consulta enviada correctamente"
//     })
// }

// Enviar Consulta
const enviarConsulta = (req,res) =>{
    const { nombre,email,consulta} = req.body
    emailContacto(req.body)
    recibirConsulta(req.body)

    res.render('templates/exito',{
        pagina: "Contacto",
        mensaje: "Consulta enviada correctamente"
    })
}


export {
    contactos,
    enviarConsulta
}