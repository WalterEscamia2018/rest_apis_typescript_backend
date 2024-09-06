/* 
En este archivo vamos a conectar nuestra base de datos de PostgreSQL de render.com, con 
el ORM que se llama Sequelize.

Para instalar Sequelize usamos los siguientes comandos:
1) npm install --save sequelize
2) npm install --save pg pg-hstore
3) npm i sequelize-typescript
*/

import { Sequelize } from "sequelize-typescript";
/* Instalamos dotenv para utilizar las variables de entorno para proteger nuestra
External Database URL. */
import dotenv from "dotenv";

dotenv.config();

/* 
La External Database URL la copiamos desde render.com 

IMPORTANTE: Hay que agregarle lo siguiente a la External Database URL: ?ssl=true
*/
const db = new Sequelize(process.env.DATABASE_URL!, {
  /* 
    Aqui le especificamos en que directorio va a encontrar los modelos para
    generar las columnas.

    'models' va a ser siempre un arreglo ([])

    Siempre va a a ir el '__dirname' dentro del arreglo
    */
  models: [__dirname + "/../models/**/*"],
  logging: false,
});

export default db;
