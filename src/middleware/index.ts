/*
Este es el Middleware.

Existen Middleware para autenticación o para subir archivos, etc.

Los Middleware siempre reciben los parámetros de 'req', 'res' y 'next'
*/
/*
'handleInputErrors' es un Middleware que verifica los errores de validación que el 
usuario ingreso.

Este Middleware se va a usar en el router (router.ts)
*/

import { Request, Response, NextFunction } from "express";
/* 
Con express validator podemos evitar que se ingresen campos vacios a nuestra base de datos. 
Para instalar express validator usamos el siguiente comando: npm i express-validator.

await check ===> Para validar un campo. Solo se utiliza en funciones asíncronas.
body ===> Es lo mismo que el check, pero se utliza en funciones que no son asíncronas,
            como en el router.
validationResult ===> Es el resultado de nuestra validación.

En el router (router.ts) se reciben los datos de la base de datos antes que en el handler (product.ts)

Entonces en el router (router.ts) se pueden validar los datos antes de que lleguen al 
handler (product.ts), o sea que se puede usar express-validator para ver que no hayan datos
con campos vacios.
*/
import { validationResult } from 'express-validator';

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {

    /* Para ver los mensajes de error, o ver la validación, vamos a usar validationResult */
    let errors = validationResult(req)

    /* Si errores no esta vacio, entonces significa que hay algo, o sea que existe un error */
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    /* Para agregar los datos a nuestra base de datos. */
    /* 
    Siempre lo que mandemos desde el body lo vamos a extraer con 'req.body' 
 
    'create' va a crear la instancia del objeto y de un solo lo va a guardar en la base
    de datos, todo en un solo paso.
    */
    /* 
    El next() significa que le dice al programa que ya termino con el Middleware,
    entonces que ahora pase a la siguiente función, que en el caso del router.ts,
    la siguiente función es createProduct.

    Como los Middleware tienen que ser reutilizables, entonces no le podemos poner
    el nombre específico de la siguiente función que queremos que se ejecute
    después de que el Middleware termina, por eso mejor ponemos el next()

    next() es una función dinámica que indica que se vaya a la siguiente función,
    o al siguiente Middleware.
    */
    next()
}