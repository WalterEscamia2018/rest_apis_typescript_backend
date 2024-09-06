/*
                    Probando el Endpoint para Crear el Producto

Aquí en la carpeta del handler va a ir la prueba para probar el código para cuando creamos
un Producto.

Va a estar en la carpeta '__tests__' para que Jest encuentre sus archivos.
*/
import request from "supertest";
import server from "../../server";

/* Primero vamos a probar la creación de un producto */
describe("POST /api/products", () => {
    /* También vamos a probar la validación al crear un producto en nuestro código,
      o sea cuando creamos un producto vacio.
      Esta prueba la ponemos antes, porque se va a ejecutar antes de crear un producto.
      En el send lo envío vacio, ya que así simulo que no envío nada.
      */
    it("should display validation errors", async () => {
        const response = await request(server).post("/api/products").send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        /* Al crear un producto se tienen 4 propiedades (id, name, price y availability),
            entonces al crear un formulario vacio espero tener un arreglo de 4 valores. */
        expect(response.body.errors).toHaveLength(4);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(2);
    });

    /* Ahora vamos a validar que el precio sea mayor que cero */
    it("should validate that the price is greater than 0", async () => {
        const response = await request(server).post("/api/products").send({
            name: "Monitor Curvo",
            price: 0,
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        /*
    
            Si queremos crear un producto con el precio igual a cero en el Endpoint 'POST':
            {
            "name": "Monitor Curvo",
            "price": 0 
            }
            
            Este es el error que nos aparece si queremos crear un producto con precio igual a cero
    
            {
            "errors": [
                {
                "type": "field",
                "value": 0,
                "msg": "Precio no válido",
                "path": "price",
                "location": "body"
                }
            ]
            }
    
            El único error que nos aparece es el del precio, o sea la longitud del arreglo errors
            es 1.
            */
        expect(response.body.errors).toHaveLength(1);
        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(2);
    });

    /* Ahora vamos a validar que el precio sea un número y mayor que cero */
    it("should validate that the price is a number and greater than 0", async () => {
        const response = await request(server).post("/api/products").send({
            name: "Monitor Curvo",
            price: "Hola",
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        /*
    
            Si queremos crear un producto con el precio igual a cero en el Endpoint 'POST':
            {
            "name": "Monitor Curvo",
            "price": "Hola" 
            }
            
            Este es el error que nos aparece si queremos crear un producto con precio igual a cero
    
            {
            "errors": [
                {
                "type": "field",
                "value": "Hola",
                "msg": "Valor no valido",
                "path": "price",
                "location": "body"
                },
                {
                "type": "field",
                "value": "Hola",
                "msg": "Precio no válido",
                "path": "price",
                "location": "body"
                }
             ]
            }
    
            Vamos a tener dos errores, que corresponden a dos objetos.
            */
        expect(response.body.errors).toHaveLength(2);
        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(4);
    });

    it("should create a new product", async () => {
        /* 
                El 'send' es lo que vamos a pasarle a ese Endpoint 
            
                Este producto va a ser insertado via testing
                */
        const response = await request(server).post("/api/products").send({
            name: "Mouse - Testing",
            price: 50,
        });
        /* Al crear un nuevo producto, nosotros esperamos que el código que se reciba sea el
            201, ya que ese código es el que se utiliza al crear un nuevo producto. 
            Si nos retorna el código 201, significa que se creó exitosamente un nuevo producto.
            */
        expect(response.status).toBe(201);
        /* Si se creó un producto se espera que tenga la propiedad de data. */
        expect(response.body).toHaveProperty("data");
        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty("error");
    });
});

/* 
                Para probar la url de los productos 

1. Al hacer la solicitud a: http://localhost:4000/api/products/ 

2. Status: 200 OK

3. Esto es lo que nos sale en los Headers:

Header                      Value
x-powered-by                Express
content-type                application/json; charset=utf-8
content-length              153
etag                        W/"99-r0ACAs8FXSXuKsXZheWfAN5pcj4"
date                        Tue, 27 Aug 2024 17:26:24 GMT
connection                  close

4. Y esto es lo que nos aparece en el Response:
{
  "data": [
    {
      "id": 1,
      "name": "Mouse - Testing",
      "price": 50,
      "availability": true,
      "createdAt": "2024-08-27T17:19:17.746Z",
      "updatedAt": "2024-08-27T17:19:17.746Z"
    }
  ]
}

4. Entonces en base al punto 2, 3 y 4 podemos crear nuestras pruebas.

*/
describe("GET /api/products", () => {
    /* 1. Primero revisamos que la url exista */
    it("should check if api/products url exists", async () => {
        const response = await request(server).get("/api/products");
        expect(response.status).not.toBe(404);
    });

    /* 2. Después revisamos que recibimos una respuesta JSON con productos */
    it("GET a JSON response with products", async () => {
        const response = await request(server).get("/api/products");
        expect(response.status).toBe(200);
        /* Lo que esperamos es un JSON */
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toHaveProperty("data");
        /* Solo esperamos un producto */
        expect(response.body.data).toHaveLength(1);
        expect(response.body).not.toHaveProperty("errors");
    });
});

/*
A. Al solicitar un producto por medio de un id que no existe, por medio del Endpoint GET:
http://localhost:4000/api/products/2000

1. El status es 404

2. Esto es lo que nos aparece en el response:
{
  "error": "Producto No Encontrado"
}
*/

/*
B. Si le paso un string, en vez de un id, al solicitar un producto, por medio del Endpoint
GET: http://localhost:4000/api/products/hola

1. El status es 400

2. La respuesta que recibimos es la siguiente:
{
  "errors": [
    {
      "type": "field",
      "value": "hola",
      "msg": "ID no válido",
      "path": "id",
      "location": "params"
    }
  ]
}
*/
/*
C. También vamos a revisar si estamos obteniendo un producto, al colocar la id igual a 1:
http://localhost:4000/api/products/1

1. El status es 200

2. La respuesta que recibimos es la siguiente:
{
  "data": {
    "id": 1,
    "name": "Mouse - Testing",
    "price": 50,
    "availability": true,
    "createdAt": "2024-08-27T18:42:58.464Z",
    "updatedAt": "2024-08-27T18:42:58.464Z"
  }
}
*/
describe("GET /api/products/:id", () => {
    /*A. Al solicitar un producto por medio de un id que no existe, por medio del Endpoint GET */
    it("Should return a 404 response for a non-existent product", async () => {
        /* Primero voy a crear un id que yo sé que no va a existir. */
        const productId = 2000;
        const response = await request(server).get(`/api/products/${productId}`);
        /* Esperamos una respuesta 404 porque el id no va a existir. */
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Producto No Encontrado");
    });

    /*Si le paso un string, en vez de un id, al solicitar un producto, por medio del Endpoint
      GET*/
    it("should check a valid ID in the URL", async () => {
        const response = await request(server).get("/api/products/not-valid-url");
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        /* Solo vamos a obtener un mensaje de error */
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe("ID no válido");
    });

    /* Ahora vamos a revisar si estamos obteniendo un producto. Agregamos un producto con id
    igual a 1, ya que esa id siempre va a existir. */
    it("get a JSON response for a single product", async () => {
        const response = await request(server).get("/api/products/1");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
    });
});

/*
A. Si queremos actualizar un producto con una URL incorrecta:
http://localhost:4000/api/products/hola

1. Mandamos el siguiente JSON correcto en el body:
{
  "name": "Monitor Curvo",
  "availability": true,
  "price": 300
}

2. El Status es 400.

3. La respuesta que recibimos es la siguiente:
{
  "errors": [
    {
      "type": "field",
      "value": "hola",
      "msg": "ID no válido",
      "path": "id",
      "location": "params"
    }
  ]
}
*/
/*
B. Si mandamos una solicitur vacia al id igual a 1 para el Endpoint PUT:
http://localhost:4000/api/products/1

1. El status es 400.

2. La respuesta que recibimos es la siguiente:
{
  "errors": [
    {
      "type": "field",
      "msg": "El nombre del Producto no puede ir vacio",
      "path": "name",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "Valor no valido",
      "path": "price",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "El precio del Producto no puede ir vacio",
      "path": "price",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "Precio no válido",
      "path": "price",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "Valor para disponibilidad no válido",
      "path": "availability",
      "location": "body"
    }
  ]
}
*/
/*
C. Si queremos actualizar un producto con un precio negativo:

1. Mandamos el siguiente JSON en el body:
{
  "name": "Monitor Curvo",
  "availability": true,
  "price":-300
}

2. El Status es 400.

3. La respuesta que recibimos es la siguiente:
{
  "errors": [
    {
      "type": "field",
      "value": -300,
      "msg": "Precio no válido",
      "path": "price",
      "location": "body"
    }
  ]
}
*/
describe("PUT /api/products/:id", () => {
    /* A. Si queremos actualizar un producto con una URL incorrecta */
    it("should check a valid ID in the URL", async () => {
        const response = await request(server)
            .put("/api/products/not-valid-url")
            .send({
                name: "Monitor Curvo",
                availability: true,
                price: 300,
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        /* Solo vamos a obtener un mensaje de error */
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe("ID no válido");
    });

    /* B. Si mandamos una solicitur vacia al id igual a 1 para el Endpoint PUT */
    it("should display validation error messages when updating a product", async () => {
        const response = await request(server).put("/api/products/1").send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(5);
    });

    /* C. Si queremos actualizar un producto con un precio negativo */
    it("should validate that the price is greater than 0", async () => {
        const response = await request(server).put("/api/products/1").send({
            name: "Monitor Curvo",
            availability: true,
            price: 0,
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe("Precio no válido");

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty("data");
    });

    /* Para comprobar si un producto existe */
    it("should return a 404 response for a non-existent product", async () => {
        const productId = 2000;
        const response = await request(server)
            .put(`/api/products/${productId}`)
            .send({
                name: "Monitor Curvo",
                availability: true,
                price: 300,
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Producto No Encontrado");

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty("data");
    });

    /* Para actualizar un producto */
    it("should update an existing product with valid data", async () => {
        const response = await request(server).put("/api/products/1").send({
            name: "Monitor Curvo",
            availability: true,
            price: 300,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");

        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty("errors");
    });
});

/*
A. Cuando queremos actualizar un producto que no existe en la URL, por medio de una id que no existe:
http://localhost:4000/api/products/2000

1. El Status es 404

2. La respuesta que obtenemos es: 
{
  "error": "Producto No Encontrado"
}
*/
/*
B. Cuando queremos actualizar la disponibilidad del producto con id igual a 2:
http://localhost:4000/api/products/2

1. El Status es 200
2. La respuesta que obtenemos es la siguiente:
{
  "data": {
    "id": 2,
    "name": "Monitor Curvo",
    "price": 300,
    "availability": false,
    "createdAt": "2024-08-28T02:00:25.549Z",
    "updatedAt": "2024-08-28T02:00:50.812Z"
  }
}
*/
describe("PATCH /api/products/:id", () => {
    /* A. Cuando queremos actualizar un producto que no existe */
    it('should return a 404 response for a non-existing product', async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto No Encontrado')
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    /* B. Cuando queremos actualizar la disponibilidad del producto con id igual a 2 */
    it('should update the product availability', async () => {
        const response = await request(server).patch(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })

})

/*
A. Si queremos mandar una id no valida como la siguiente: http://localhost:4000/api/products/hola

1. El Status es 400.

2. La respuesta que obtenemos es la siguiente:
{
  "errors": [
    {
      "type": "field",
      "value": "hola",
      "msg": "ID no válido",
      "path": "id",
      "location": "params"
    }
  ]
}
*/
/*
B. Si queremos comprobar que un producto no exista, entonces para eso tenemos que pasarle un id 
no válido.

1. Le pasamos un id no válido a la URL: http://localhost:4000/api/products/2000

2. El Status es 404

3. La respuesta que obtenemos es la siguiente:
{
  "error": "Producto No Encontrado"
}
*/
/* 
C. Finalmente eliminamos el producto, con una id que sí exista 

1. Le pasamos una id válida del producto que queremos eliminar a la URL:
http://localhost:4000/api/products/1

2. El Status es 200

3. La respuesta que recibimos es la siguiente:
{
  "data": "Producto Eliminado"
}

*/
describe("DELETE /api/products/:id", () => {
    /* A. Si queremos mandar una id no valida como la siguiente: http://localhost:4000/api/products/hola */
    it("should check a valid ID", async () => {
        const response = await request(server).delete("/api/products/not-valid");
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors[0].msg).toBe("ID no válido");
    });

    /* B. Si queremos comprobar que un producto no exista, entonces para eso tenemos que pasarle un id 
    no válido. */
    it("should return a 404 response for a non-existent product", async () => {
        const productId = 2000;
        const response = await request(server).delete(`/api/products/${productId}`);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Producto No Encontrado");
        expect(response.status).not.toBe(200);
    });

    /* C. Finalmente eliminamos el producto, con una id que sí exista */
    it("should delete a product", async () => {
        /* Le pasamos una id valida, o sea una que sí exista. */
        const response = await request(server).delete("/api/products/1");
        expect(response.status).toBe(200);
        /* Esta es la respuesta que nos sale cuando eliminamos correctamente un producto. */
        expect(response.body.data).toBe("Producto Eliminado");

        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(400);
    });
});
