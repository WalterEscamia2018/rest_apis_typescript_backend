/*
En la carpeta de __test__ es donde Jest va a encontrar sus archivos
*/

/*
'describe' sirve para agrupar una serie de pruebas que esten relacionadas, por
ejemplo para probar la conexión a la base de datos.

Si queremos probar otra cosa, entonces tenemos que hacer otro 'describe'
*/
import { connectDB } from "../server";
import db from "../config/db";

/*
Vamos a usar un Mock para forzar un error de forma virtual en el archivo 'server.ts'. En la parte 
del try catch al conectar a la base de datos.

Queremos probar la linea 26 del archivo server.ts, que se encuentra dentro del catch, la que dice
lo siguiente: console.log(colors.red.bold("Hubo un error al conectar a la BD"));

Queremos que nos mande directamente al catch.

Al mock le pasamos la ubicación de la configuración a nuestra base de datos: ../config/db"
*/
jest.mock("../config/db");

describe("connectDB", () => {
    it("should handle database conection error", async () => {
        /* 
        Lo que hace 'spyOn' es crear una función en el ambiente de este mock 
    
        Yo quiero ver el comportamiento de 'db.authenticate()' que se encuentra en el 'server.ts'
        
        Al 'spyOn' le pasamos la base de datos: db
        
        Y también le pasamos el método al que queremos observar su comportamiento: authenticate
    
        Con 'mockRejectedValueOnce' lanzamos una excepción para que se vaya directamente al catch.
        */
        jest
            /* El espia va a esperar a que se ejecute 'db.authenticate()' en el try del archivo 'server.ts' */
            .spyOn(db, "authenticate")
            /* Aquí simulamos la conexión a la base de datos */
            .mockRejectedValueOnce(new Error("Hubo un error al conectar a la BD"));
        /* Este es el segundo espía, el espía de la consola. */
        const consoleSpy = jest.spyOn(console, "log");

        /* Esto lo que hace es la conexión, pero ya la voy a estar espiando para cuando se autentique. */
        await connectDB();

        expect(consoleSpy).toHaveBeenCalledWith(
            /* Queremos probar que tenga el mismo texto que se encuentra en el console log del catch */
            expect.stringContaining("Hubo un error al conectar a la BD")
        );
    });
});
