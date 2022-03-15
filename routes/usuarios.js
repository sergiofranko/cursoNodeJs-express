const express = require('express');
const Joi = require('joi');
const routes = express.Router();

let usuarios = ['Sergio', 'Isabel', 'Gloria'];

let users = [
    {id:1, nombre: 'Luis'},
    {id:2, nombre: 'Daniel'},
    {id:3, nombre: 'Mauricio'}
];

routes.get('/', (request, response) => {
    response.send(users);
})

routes.get('/:id', (request, response) => {
    response.send(usuarios[request.params.id]);
});

routes.get('/api/users/:id', (request, response) => {
    let user = existeUsuario(request.params.id);
    if (!user) {
        response.status(404).send('Usuario no encontrado');
    } else {
        response.status(200).send(user)
    }
});

routes.post('/', (request, response) => {

    const {error, value} = validarUsuario(request.body.nombre);

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

routes.put('/:id', (request, response) => {
    //Encontrar si existe el usuario a modificar
    let usuario = existeUsuario(request.params.id);
    if (!usuario) response.status(404).send("Usuario no encontrado");

    const {error, value} = validarUsuario(request.body.nombre);

    if (error) {
        response.status(400).send(error.details[0].message);
        return;
    }
    
    usuario.nombre = value.nombre;
    response.send(usuario);
});

function existeUsuario(id) {
    return (users.find(user => user.id === parseInt(id)));
}

function validarUsuario(nombre) {
    const schema = Joi.object({
        nombre: Joi.string()
                .min(3)
                .required()
    });

    return (schema.validate({ nombre: nombre }));

}

module.exports = routes;