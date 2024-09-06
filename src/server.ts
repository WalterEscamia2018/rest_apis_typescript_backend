/* Aquí vamos a tener la configuración del servidor. */

import express from "express";
/* Instalamos el paquete colors para ver los mensajes de la consola por colores. */
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";
import router from "./router";
import db from "./config/db";

/* Para conectarnos a nuestra base de datos de render.com importamos db desde el archivo db.ts
en este archivo. */
export async function connectDB() {
  try {
    /* Esperamos y nos autenticamos a nuestra base de datos. */
    await db.authenticate();
    /* 
            El sync() lo que va a hacer es que en el caso que vayamos creando nuevos modelos,
            nuevas columnas en nuestra base de datos, las va a ir agregando. 
    
            Por medio del sync() vamos a sincronizar los modelos que tengamos en nuestra base
            de datos.
            */
    db.sync();
    //console.log(colors.blue("Conexión exitosa a la base de datos"));
  } catch (error) {
    //console.log(error)
    console.log(colors.red.bold("Hubo un error al conectar a la BD"));
  }
}

connectDB();

/* Instancia de express */
/* En este server vamos a agregar toda la configuración de nuestro proyecto. */
const server = express();

/*------------------------------------------------------------------------------------*/
/* Para permitir conexiones con CORS */
const corsOptions: CorsOptions = {
  /* 
  El 'origin' es quien me está enviando la petición. 

  El 'callback' me va permitir el aceptar o negar una conexión.

  Ya a partir de aquí vamos a poder insertar datos en nuestra base de datos.
  */
  origin: function (origin, callback) {
    /* Ponemos el URL del FRONTEND en nuestras variables de entorno porque vamos a tener
    una URL local, y después una URL de producción. */
    if (origin === process.env.FRONTEND_URL) {
      /* 
      'callback' toma dos parámetros:
      1. El primero es si hay un error, solo que en este caso es 'null' porque vamos a permitir
         la conexión.
      2. El segundo es si queremos permitir la conexión, en este caso como la vamos a permitri,
         entonces le ponemos true.
     */
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
};

/* Este 'server' se va a ejecutar para las peticiones de tipo PATCH, PUT, POST ó
DELETE. Lo ponemos para que se ejecuten nuestros CORES. */
server.use(cors(corsOptions));
/*------------------------------------------------------------------------------------*/
/* Usamos Morgan para el loggin en el Backend */
/*
Morgan nos devuelve lo siguiente: 
POST /api/products 201 2918.621 ms - 137

POST ===> Endpoint usado
/api/products ===> URL usada
201 ===> Código obtenido de la consulta
2918.621 ms ===> Tiempo de espera de la respuesta
*/

server.use(morgan("dev"));
/*------------------------------------------------------------------------------------*/
/* Para leer datos de formularios */
/* 
'express.json()' me va a permitir leer los JSON que se envian al 'POST'. Así se 
habilita la lectura de los JSON. 

Este de abajo es un Middleware
*/
server.use(express.json());

/* 
El método use se ejecuta en cada uno de los verbos HTTP (GET, POST, PATCH) de router.ts

'/' es la URL

Con el método use podemos cambiar todas las rutas, solo cambiando la URL, así:
server.use('/api', router) ===> Ahora todos los métodos funcionarian con 'http://localhost:4000/api'
*/
server.use("/api/products", router);
/*------------------------------------------------------------------------------------*/
/*
Documentación de nuestra Rest API

Swagger nos va a crear un cliente en una URL en donde nosotros vamos a ver la documentación 
de nuestra Rest API
*/
/*
Con 'swaggerUi.serve' vamos a tener el cliente de express, y nos va a dar una 'url'

Con 'swaggerUi.setup(swaggerSpec)' le pasamos todo lo que tenemos configurado como
información de nuestra API en el archivo 'swagger.ts'

La URL que vamos a visitar es la siguiente: http://localhost:4000/docs/
*/
server.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
