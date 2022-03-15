const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express');
const usuarios =require('./routes/usuarios');
const config = require('config');
const morgan = require('morgan');
const app = express();

app.use(express.json());

app.use('/api/usuarios', usuarios);

//Configuración de entornos
console.log("Application Env: " + config.get('nombre'));
console.log("Application DB server: " + config.get('configDB.host'));

if (app.get('env') === 'development') {
    //Uso de middleware de terceros - Morgan
    app.use(morgan('tiny'));
    inicioDebug('morgan habilitado');
}

//Trabajos con la BD //set DEBUG=app:{Nombre-variable-entorno-depuracion}
dbDebug('Conectando con la base de datos')


app.listen(3000, () => {
    console.log("escuchando en el puerto 3000...");
});