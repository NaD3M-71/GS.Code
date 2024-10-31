import express from "express";
import routes from './routes/routes.js';
import db from './config/db.js';
import cookieParser from "cookie-parser";

// Creando al app
const app = express();

//Habilitar cookieParser
app.use(cookieParser());

//  habilitar body request
app.use( express.urlencoded({extended:true}))

// Conexion a la base de datos
try {
    await db.authenticate();
    db.sync()
    console.log('Conectado correctamente a la DB');
} catch (error) {
    console.log(error);
}
// Routing
app.use('/', routes);
// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta public
app.use( express.static('public'))

const port = 7117
app.listen(port, ()=>{
    console.log('El servidor esta funcionando en el puerto numero 7117');
});



/// PROXIMO Conectar base de datos!!!!!!