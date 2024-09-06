/* Este es el Handler, y es todo estamos manejando todo. 

El handler se utiliza solo para crear el producto.
*/

/* Podemos asignarle un DataType a 'req' y 'res' para tener un buen autocompletado. */
import { Request, Response } from "express";
import Product from "../models/Product.model";

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll({
    /* 'order' es para ordernar los precios de los productos en forma descendente */
    order: [["id", "DESC"]],
    /* 
        Con 'exclude' vamos a quitar los campos que no queremos que se muestren al hacer
        la solicitud 'GET' 

        attributes: { exclude: ['createdAt', 'updatedAt', 'availability'] }
        */
  });
  /* 'data' nos devuelve un arreglo de objetos. */
  res.json({ data: products });
};

/* La URL va a ser dinámica para obtener el Id de cada producto */
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  /* 'findByPk()' es para encontrar el producto por llave primaria. */
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      error: "Producto No Encontrado",
    });
  }

  /* A 'data' le pasamo el 'product' */
  res.json({ data: product });
};

/* 
La función tiene que ser asincrona porque al traer los datos desde la base de datos va a
tardar un poco. 

Y al ser una función asíncrona lo que sucede es que nos aseguramos que el código detenga
su ejecución, hasta que obtengamos resultados.
*/
/* 
Al asignarle un type a 'req' y 'res' vamos a tener autocompletado con todas
las funciones de 'Request' y 'Response' 
*/
export const createProduct = async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  /* Al crear un producto, vamos a retornar el código 201, ya que ese código se
    utiliza cuando creamos algo. */
  res.status(201).json({ data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  /* 'findByPk()' es para encontrar el producto por llave primaria. */
  const product = await Product.findByPk(id);

  /* Antes de actualizar un producto, debemos de verificar que este exista en la base
    de datos. */
  if (!product) {
    return res.status(404).json({
      error: "Producto No Encontrado",
    });
  }

  /* 
    Despues de verificar que el producto existe, entonces vamos a actualizar. 
    
    Para recuperar los datos mediante el 'POST' o un 'PUT', siempre recuperamos con
    'req.body' lo que estamos enviando.

    La función 'update' solo actualiza el campo que le pasamos, no todos.
    */
  await product.update(req.body);
  await product.save();

  /* Mediante el 'res.json' nosotros retornamos nuestro producto */
  res.json({ data: product });
};

export const updateAvailability = async (req: Request, res: Response) => {
  const { id } = req.params;
  /* 'findByPk()' es para encontrar el producto por llave primaria. */
  const product = await Product.findByPk(id);

  /* Antes de actualizar un producto, debemos de verificar que este exista en la base
    de datos. */
  if (!product) {
    return res.status(404).json({
      error: "Producto No Encontrado",
    });
  }

  // Actualizar
  /* 
    Despues de verificar que el producto existe, entonces vamos a actualizar. 
    
    Para recuperar los datos mediante el 'POST' o un 'PUT', siempre recuperamos con
    'req.body' lo que estamos enviando.

    Cuando trabajamos con 'PUT' se actualizan todos los campos al mismo tiempo, entonces
    si le pasamos solo un campo para que lo actualice, entonces va a colocar como vacios
    los demás campos.

    La función 'update' solo actualiza el campo que le pasamos, no todos. Entonces la
    función 'update' evita que el verbo HTTP 'update' deje en vacio los demás campos.

    Con 'product.dataValues' puedo acceder a los datos que están en la base de datos.

    Con '!product.dataValues.availability' cada vez que llamemos al endpoint PATCH,
    sin especificarle nada en el body, va a cambiar la disponibilidad (availability)
    al estado contrario.
    */
  product.availability = !product.dataValues.availability;
  await product.save();

  /* Mediante el 'res.json' nosotros retornamos nuestro producto */
  res.json({ data: product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  /* Primero tenemos que leer el 'id' */
  const { id } = req.params;
  /* 'findByPk()' es para encontrar el producto por llave primaria, o sea por el 'id' */
  const product = await Product.findByPk(id);

  /* Antes de actualizar un producto, debemos de verificar que este exista en la base
    de datos. */
  if (!product) {
    return res.status(404).json({
      error: "Producto No Encontrado",
    });
  }

  await product.destroy();

  res.json({ data: "Producto Eliminado" });
};
