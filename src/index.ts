/* Este es nuestro archivo principal */

import server from "./server";
import colors from 'colors'

/*
Routing

Para comprobar que sí es cierto que nuestra aplicación esta en el puerto 4000

Una vez que hacemos el Deployment, nosotros no asignamos el puerto, si no que lo asigna nuestro
servidor, y lo hace por medio de una variable de entorno, la cual siempre se llama
'process.env.PORT'

const port = process.env.PORT || 3000  ===> Lo que significa esto es que si la variable
'process.env.PORT' existe, entonces que la asigne a la variable 'port', y si no existe,
entonces que a la variable 'port' se le asigne el valor de '3000'
*/
const port = process.env.PORT || 4000

/* Nuestra aplicación de express va a estar en el puerto 4000 */
server.listen(port, () => {
    console.log(colors.cyan.bold(`Rest API en el puerto ${port}`))
})
