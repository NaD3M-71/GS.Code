// Imports
import { Sequelize } from 'sequelize'
import Proyecto from '../models/Proyectos.js'

//Controladores

// Vista todos los proyectos
const portfolio = async (req,res)=>{
    
    const proyectos = await Proyecto.findAll({raw:true}) 
    
    res.render('proyectos/portfolio',{
        pagina: "Portfolio",
        proyectos
    })
}

// Vista un solo proyecto
const mostrarProyecto = async (req,res)=>{
    const id = req.params
    const proyecto = await Proyecto.findByPk(req.params.id)
    if (!proyecto){
        res.redirect('/404');
    }

    res.render(`proyectos/proyecto`,{
        pagina: `${proyecto.titulo}`,
        proyecto
    })
}
export {
    portfolio,
    mostrarProyecto
}