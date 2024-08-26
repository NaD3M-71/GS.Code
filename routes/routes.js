// Imports
import  express  from "express";
import {
    inicio
} from "../controllers/homeController.js"
import { 
    portfolio,
    mostrarProyecto
 } from "../controllers/portfolioController.js";
import { 
    admin,
    agregarProyecto,
    guardarProyecto ,
    agregarImagen,
    almacenarImagen,
    editarProyecto,
    eliminarProyecto
} from "../controllers/adminController.js";
import {
    contactos,
    enviarConsulta
} from "../controllers/contactoController.js";
import aboutme from "../controllers/aboutmeController.js";

import upload from "../middleware/subirImagen.js";

// Router
const router = express.Router();

// -------Rutas-------

// Inicio
router.get('/', inicio);

// Admin
router.get('/admin', admin)
router.get('/admin/agregar-proyecto', agregarProyecto)
router.post('/admin/agregar-proyecto', guardarProyecto)
router.get('/admin/agregar-imagen/:id', agregarImagen)
router.post('/admin/agregar-imagen/:id', 
    upload.single('imagen'), // si no funciona mas de una imagen cambiar a .single('imagen)
    almacenarImagen
)
router.get('/admin/editar/:id', editarProyecto)
router.get('/admin/eliminar/:id', eliminarProyecto)

// Portfolio
router.get('/portfolio', portfolio);
router.get('/proyecto/:id', mostrarProyecto);

// Contacto
router.get('/contacto', contactos);
router.post('/contacto', enviarConsulta);

// About Me
router.get('/about-me', aboutme);

export default router