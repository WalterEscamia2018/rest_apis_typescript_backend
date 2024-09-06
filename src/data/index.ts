/*
Aquí vamos a colocar un código que va a limpiar nuestra base de datos cada vez que finalicen nuestras
pruebas con Jest
*/

/* 'exit' lo que va a hacer es detener la ejecución de un código de Node JS */
import { exit } from "node:process";
/* Importamos bd porque requerimos la isntancia de Sequelize */
import db from "../config/db";

/* Esta función va a ser asíncrona porque no sabemos cuanto tiempo le va a costar limpiar la base de
datos. */
const clearDB = async () => {
  try {
    /* Con 'sync({ force: true })' lo que va a hacer es eliminar todos los datos de la base de datos. */
    await db.sync({ force: true });
    console.log("Datos eliminados correctamente");
    /* exit(0) ===> Significa que el programa terminó correctamente. */
    exit(0);
  } catch (error) {
    console.log(error);
    /* 
    Terminamos el programa con 'exit(1)' para indicar que finalizó con errores.
    exit(0) ===> El programa finalizó bien.
    exit(1) ===> El programa finalizó con errores.
    */
  }
};

/*
'process.argv[2]' ===> Es un código que se ejecuta desde el Command Line de Node JS, y 2 es la 
                       posición.

En el archivo 'package.json' agregamos lo siguiente a los scripts:
"pretest": "ts-node ./src/data"

process.argv[0] = ts-node
process.argv[1] = .src/data ===> Este es el archivo
process.argv[2] = --clear ===> Esta es la bandera
*/
if (process.argv[2] === "--clear") {
  clearDB();
}

console.log(process.argv);
