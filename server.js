const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const JWT = require('jsonwebtoken');
const JWTSign = 'Ac4m1c1_2020';
const arrayUsuarios = [];
let lastId = 0



//MIDDLWARES

/** Middlewares generales */
server.use(bodyParser.json());

server.use((err, req, res, next) => {
    if (!err) return next();
    console.log('Error, algo salio mal', err);
    res.status(500).send('Error');
});


/** Middlewares controladores */

//validar que exista usuario en log in
const validarUsuarioLogIn = (req, res, next) => {
    const userLogIn = req.body;
    const existeUsuario = arrayUsuarios.find(user => user.usuario === userLogIn.usuario && user.clave === userLogIn.clave);

    if (existeUsuario) {
        next();
    } else {
        res.status(404).json({
            mensaje: 'Usuario o contraseña incorrectos'
        });
    }
}

//validar token
const validateUserToken = (req, res, next) => {
    try {
        const user = req.headers.authorization; //guardo el token
        const verify = JWT.verify(user, JWTSign); //devuelve nombre, apellido y id pq eso le guarde yo al token en log in
        if (verify.id) {
            req.locals = verify; //me guardo información que despues uso en la ruta
            console.log(verify);
            console.log(req.locals)
            next();
        } else {
            res.status(403).json({
                mensaje: 'usuario sin id'
            });
        }
    } catch (err) {
        console.log(err)
        res.status(401).json({
            mensaje: 'Token no válido'
        });
    }
}

/** RUTAS */

/** devuelvo el usuario según el id*/
server.get('/usuarios/:idUsuario', (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario);
    const usuario = arrayUsuarios.find(us => us.id === idUsuario);

    if (!usuario) {
        res.status(404).json({
            mensaje: 'no existe el usuario'
        });
    } else {
        res.status(200).json(usuario);
    }
});


/** Devuelvo una cuenta de un usuario*/
server.get('/usuarios/:idUsuario/cuentas/:idCuenta', (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario);
    const idCuenta = parseInt(req.params.idCuenta);

    const usuario = arrayUsuarios.find(us => us.id === idUsuario);
    const cuenta = usuario.cuentas.find(c => c.id === idCuenta)


    res.status(200).json(cuenta);

});


/**registro un nuevo usario */
server.post('/usuarios/register', (req, res) => {
    const nuevoUsuario = req.body

    nuevoUsuario.id = ++lastId
    nuevoUsuario.cuentas = [{
        nombreCu: 'cuenta1',
        id: 1,
        saldo: 500,
    }]

    //me fijo que no exista ese usuario
    if (arrayUsuarios.find(us => us.usuario.toLowerCase() === nuevoUsuario.usuario.toLowerCase())) {
        return res.status(401).send("El usuario ya existe");
    } else {
        arrayUsuarios.push(nuevoUsuario)
        return res.status(201).json(arrayUsuarios);
    }
})


/**login usuario */
server.post('/login', validarUsuarioLogIn, (req, res) => {
    const userLogIn = req.body
    const user = arrayUsuarios.find(user => user.usuario === userLogIn.usuario && user.clave === userLogIn.clave);

    const token = JWT.sign({
        nombre: user.nombre,
        apellido: user.apellido,
        id: user.id,
    }, JWTSign);

    res.status(200).json({
        token
    });
});



/** transfiero a otro usuario */
server.patch('/miUsuario/:idUserToTransfer', validateUserToken, (req, res) => {

    //guardo monto transferencia
    const monto = parseInt(req.query.monto);

    //obtengo id del usuario que va a transferir a partir del token 
    const idUser = req.locals

    console.log(idUser)


    //encuentro ese usuario en array
    // let indexUser;
    // const user = arrayUsuarios.find((user, index) => {
    //     if (user.id === idUser) {
    //         indexUser = index;
    //         return true;
    //     } else {
    //         return res.status(404).json({
    //             mensaje: 'Usuario no encontrado'
    //         });
    //     }
    // });
    // console.log(indexUser)
    const user = arrayUsuarios[1] //LO ASIGNO MANUALMENTE PQ NO SE PQ ME TIRA ERROR
 


    //obtengo id del usuario al que le transfiero
    const idUserToTransfer = parseInt(req.params.idUserToTransfer);

    //encuentro usuario al que transfiero en array
    let indexUserToTransfer;
    const userToTransfer = arrayUsuarios.find((user, index) => {
        if (user.id === idUserToTransfer) {
            indexUserToTransfer = index;
            return true;
        } else {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado, pruebe con otro id'
            });
        }
    });

    //@TODO:TENDRIA Q HACERLO CON UN MIDDLEWARE. PROBE validaciónSaldoDisponibleTransf PERO NO PUDE
    //valido monto 
    if (user.cuentas[0].saldo >= monto){
        //resto saldo al que transfiere
        arrayUsuarios[1] = {
            ...user,
            ...user.cuentas[0].saldo -= monto,
        };

        //sumo saldo al transferido
        arrayUsuarios[indexUserToTransfer].cuentas[0].saldo += monto

        //devuelvo array usuarios donde puedo ver ambos saldos cambiados
        res.status(200).json(arrayUsuarios)
    }else{
        res.status(409).json({ mensaje: 'saldo insuficiente'})
    }
});




//SERVIDOR
server.listen(3000, () => {
    console.log((new Date()).toISOString() + " - Server Iniciado")
});