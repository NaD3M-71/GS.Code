import { Sequelize } from 'sequelize'
import Proyecto from '../models/Proyectos.js'
import { raw } from 'mysql2';

// TODO: proteger rutas admin con jwt
const admin = async (req,res) =>{
    const proyectos = await Proyecto.findAll({raw:true});
    res.render('admin/admin',{
        pagina: "Panel de Administracion",
        admin,
        proyectos
    })
}

const agregarProyecto = (req,res) =>{
    res.render('admin/agregar-proyecto',{
        pagina: 'Agregar Proyecto',
        admin
    })
}

const guardarProyecto = async (req,res) =>{

    const proyecto = await Proyecto.create(req.body);

    // redireccionamos a agregar imagen
    res.redirect(`/admin/agregar-imagen/${proyecto.id}`)
}
// agregar imagen
const agregarImagen = async (req,res) =>{

    const proyecto = await Proyecto.findOne({
        where: {
            id: req.params.id
        }
    });

    //validar que el proyecto existe
    if (!proyecto){
        return res.redirect('/404')
    }

    //Vista
    res.render('admin/agregar-imagen',{
        pagina: 'Agregar imagen',
        proyecto,
        admin
        
})
}
const almacenarImagen = async (req,res,next)=> {
    const proyecto = await Proyecto.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!proyecto){
        
        return res.redirect('/404')
    }
    // almacenar imagen
    try {
        //console.log(req.file);
        proyecto.imagen = req.file.filename;
        await proyecto.save();
    
        next();
      } catch (error) {
        console.log(error);
      }
}

const editarProyecto = async(req,res)=>{
    const proyecto = await Proyecto.findByPk(req.params.id)
    res.render('admin/editar-proyecto',{
        pagina: `Editar ${proyecto.titulo}`,
        proyecto
    });
}
const eliminarProyecto = (req,res)=>{
    res.send("modificar proy");
}

export {
    admin,
    agregarProyecto,
    guardarProyecto,
    agregarImagen,
    almacenarImagen,
    editarProyecto,
    eliminarProyecto
}