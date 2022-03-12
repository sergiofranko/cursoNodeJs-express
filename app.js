const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express');
const Joi = require('joi');
const config = require('config');
const morgan = require('morgan');
const app = express();

app.use(express.json());

//Configuración de entornos
console.log("Application Env: " + config.get('nombre'));
console.log("Application DB server: " + config.get('configDB.host'));

if (app.get('env') === 'development') {
    //Uso de middleware de terceros - Morgan
    app.use(morgan('tiny'));
    inicioDebug('morgan habilitado');
}

//Trabajos con la BD
dbDebug('Conectando con la base de datos')

let usuarios = ['Sergio', 'Isabel', 'Gloria'];

let users = [
    {id:1, nombre: 'Luis'},
    {id:2, nombre: 'Daniel'},
    {id:3, nombre: 'Mauricio'}
];

app.get('/', (request, response) =>{
    response.send('Express');
});

app.get('/api/usuarios', (request, response) => {
    response.send(users);
})

app.get('/api/usuarios/:id', (request, response) => {
    response.send(usuarios[request.params.id]);
});

app.get('/api/users/:id', (request, response) => {
    let user = users.find(user => user.id === parseInt(request.params.id));
    if (!user) {
        response.status(404).send('Usuario no encontrado');
    } else {
        response.status(200).send(user)
    }
})

/* app.post('/api/usuarios', (request, response) => {
    if (!request.body.nombre || request.body.nombre.length <= 2) {
        response.status(400).send("ingrese un nombre, con mínimo 3 letras");
        return;
    } else {
        const usuario = {
            id: users.length + 1,
            nombre: request.body.nombre
        };
        users.push(usuario);
        response.status(200).send(users);
    }
    
}); */

app.post('/api/usuarios', (request, response) => {

    const schema = Joi.object({
        nombre: Joi.string()
                .min(3)
                .required()
    });

    const {error, value} = schema.validate({ nombre: request.body.nombre });

    if (error) {
        response.status(400).send(error.details[0].message);
        return;
    } else {
        const usuario = {
            id: users.length + 1,
            nombre: value.nombre
        };
        users.push(usuario);
        response.status(200).send(users);
    }
    
});

app.put('/api/usuarios/:id', (request, response) => {
    //Encontrar si existe el usuario a modificar
    let usuario = users.find(user => user.id === parseInt(request.params.id));
    if (!usuario) response.status(404).send("Usuario no encontrado");

    const schema = Joi.object({
        nombre: Joi.string()
                .min(3)
                .required()
    });

    const {error, value} = schema.validate({ nombre: request.body.nombre });

    if (error) {
        response.status(400).send(error.details[0].message);
        return;
    }
    
    usuario.nombre = value.nombre;
    response.send(usuario);
})

app.listen(3000, () => {
    console.log("escuchando en el puerto 3000...");
});