/* 
OJO IMPORTANTE: Para el Backend se utiliza el 'router' de 'EXPRESS', para el Frontend se utiliza
el 'router' de 'react-router-dom'

En este archivo vamos a colocar todos los verbos HTTP. 

En el router se reciben los datos de la base de datos antes que en el handler (product.ts)

Entonces aquí en el router se pueden validar los datos antes de que lleguen al handler (product.ts),
o sea que se puede usar express-validator para ver que no hayan datos con campos vacios.

Vamos a poner las validaciones aquí para que el handler quede más limpio.
*/
/* 
Los otros tres métodos HTTP los podemos hacer mediante alguna herramienta, como POSTMAN o
ThunderClient

ThunderClient y POSTMAN son herramientas que me permiten probar mis REST API.

ThunderClient es tomar POSTMAN desde Visual Studio Code.

ThunderClient es una extensión de Visual Studio Code.
*/

import { Router } from "express";
/* 
Con express validator podemos evitar que se ingresen campos vacios a nuestra base de datos. 
Para instalar express validator usamos el siguiente comando: npm i express-validator.

await check ===> Para validar un campo. Solo se utiliza en funciones asíncronas.
body ===> Es lo mismo que el check, pero se utliza en funciones que no son asíncronas,
          como en el router.
validationResult ===> Es el resultado de nuestra validación.

En el router (router.ts) se reciben los datos de la base de datos antes que en el handler (product.ts)

Entonces en el router (router.ts) se pueden validar los datos antes de que lleguen aquí al 
handler (product.ts), o sea que se puede usar express-validator para ver que no hayan datos
con campos vacios.
*/
import { body, param } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { handleInputErrors } from "./middleware";

const router = Router();

/* 
Documentación de nuestra Rest API

También tenemos que definir un Schema para nuestra API.
Tenemos que definir los diferentes atributos de nuestro Schema.
*/
/**
 * @swagger
 * components:
 *       schemas:
 *           Product:
 *               type: object
 *               properties:
 *                   id:
 *                       type: integer
 *                       description: The Product ID
 *                       example: 1
 *                   name:
 *                       type: string
 *                       description: The Product name
 *                       example: Monitor Curvo de 49 pulgadas
 *                   price:
 *                       type: number
 *                       description: The Product price
 *                       example: 300
 *                   availability:
 *                       type: boolean
 *                       description: The Product availability
 *                       example: true
 */

/*
'req': es lo que yo envío, como los datos de un formulario, o una API KEY para ganar acceso,
entre otras cosas. Siempre que visitamos una página, estoy enviando un request de la página
que estamos queriendo visitar.

'res': El response (res) es la respuesta que obtenemos cuando enviamos el request, o sea 
que puede ser que nos envian de respuesta, una consulta para una base de datos con los
productos.
*/

/* Para obtener todos los productos, usamos el Endpoint 'get' */
/*
Documentación de nuestra API

Vamos a documentar para el Endpoint GET, del cual obtenemos todos los productos.
*/
/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      aplication/json:
 *                         schema:
 *                             type: array
 *                             items:
 *                                 $ref: '#/components/schemas/Product'
 */
router.get("/", getProducts);

/*
Vamos a hacer la documentación del otro Endpoint GET, del cual obtenemos los productos
por su 'id'.
*/
/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags:
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Not found
 *          400:
 *              description: Bad Request - Invalid ID
 */
/* 
La URL va a ser dinámica para obtener el Id de cada producto.

El nombre del routing dinámico va a ser 'id', y mediante ese nombre vamos a acceder a él en
'req.params.id' en en Handler (product.ts)
 */
router.get(
  "/:id",
  /* La función 'isInt()' es para comprobar que el 'id' ingresado en un número entero. */
  param("id").isInt().withMessage("ID no válido"),
  /* Si falla la validación de arriba, entonces los errores se le pasan al Middleware. */
  handleInputErrors,
  getProductById
);

/*
Vamos a hacer la documentación para el Endpoint POST, por medio del cual creamos los
productos.

'required: true' ===> Significa que el contenido es obligatorio.
'aplication/json' ===> Significa que el contenido tenemos que pasarlo como json.
*/

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags:
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo 49 Pulgadas"
 *                          price:
 *                               type: number
 *                               example: 399
 *      responses:
 *          201:
 *              description: Successfull response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - invalid input data
 */

/* 
El navegador solo soporta los métodos siguientes métodos HTTP: 
1. GET
2. POST.

El método POST se utliza cuando enviamos un formulario.
*/
router.post(
  "/",
  // Validación
  /* 
      Para la validación de los datos ingresados, o sea que no se ingresen campos vacios. 
      Por medio del request (req) vamos a ver los campos que hemos ingresado.
      */
  body("name")
    .notEmpty()
    .withMessage("El nombre del Producto no puede ir vacio"),
  /* 
      Con isNumeric() verifica que el valor ingresado sea un número 
  
      Con custom() podemos personalizar nuestra reglas, como hacer que el valor sea obligatoriamente
      mayor que cero (value > 0)
      */
  body("price")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio del Producto no puede ir vacio")
    .custom((value) => value > 0)
    .withMessage("Precio no válido"),
  /* 'handleInputErrors' es un Middleware que verifica los errores en los datos ingresados por el
      usuario. Esta es una función intermedia que se ejecuta entre la validación de express-validator,
      y la función de createProduct. */
  handleInputErrors,
  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags:
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo 49 Pulgadas"
 *                          price:
 *                               type: number
 *                               example: 399
 *                          availability:
 *                               type: booelan
 *                               example: true
 *      responses:
 *          200:
 *              description: Successfull response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Product Not Found
 */

/* 
Cuando trabajamos con 'PUT' se actualizan todos los campos al mismo tiempo. O sea que reemplaza el
elemento que queremos editar con lo que le enviemos, o sea que si sólo queremos actualizar un campo,
entonces borra todos los otros campos, y los deja vacios.
*/
router.put(
  "/:id",
  // Validación
  param("id").isInt().withMessage("ID no válido"),
  /* 
      Para la validación de los datos ingresados, o sea que no se ingresen campos vacios. 
      Por medio del request (req) vamos a ver los campos que hemos ingresado.
      */
  body("name")
    .notEmpty()
    .withMessage("El nombre del Producto no puede ir vacio"),
  /* 
      Con isNumeric() verifica que el valor ingresado sea un número 
  
      Con custom() podemos personalizar nuestra reglas, como hacer que el valor sea obligatoriamente
      mayor que cero (value > 0)
      */
  body("price")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio del Producto no puede ir vacio")
    .custom((value) => value > 0)
    .withMessage("Precio no válido"),
  /* 'handleInputErrors' es un Middleware que verifica los errores en los datos ingresados por el
      usuario. Esta es una función intermedia que se ejecuta entre la validación de express-validator,
      y la función de createProduct. */
  body("availability")
    .isBoolean()
    .withMessage("Valor para disponibilidad no válido"),
  handleInputErrors,
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update Product availability
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successfull response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found
 */

/* PATCH reemplaza unicamente solo el campo que nosotros le estamos enviando. O sea que mantiene los
valores de los otros campos sin modificar. O sea que al contrario de PUT, no va a dejar vacios los
otros campos.  */
router.patch(
  "/:id",
  param("id").isInt().withMessage("ID no válido"),
  handleInputErrors,
  updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Deletes a product by a given ID
 *      tags:
 *          - Products
 *      description: Returns a confirmation message
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to delete
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successfull response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Producto Eliminado'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found
 */
router.delete(
  "/:id",
  param("id").isInt().withMessage("ID no válido"),
  handleInputErrors,
  deleteProduct
);

export default router;
