/* En este archivo vamos a colocar la información general de nuestra API. */

/*
Este archivo es importado en el archivo 'server.ts'.

Para ver la documentación que definimos en este archivo, lo hacemos a traves
del siguiente enlace: http://localhost:4000/docs/
*/

import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    /* Esta es la versión de openapi, openapi es la que nos da los lineamientos
        de nuesta REST API */
    openapi: "3.0.2",
    tags: [
      {
        /* En esta API vamos a documentar los productos de nuestra REST API */
        name: "Products",
        description: "API operations related to products",
      },
    ],
    /* Esta es la información general de nuestra REST API */
    info: {
      title: "REST API Node.js / Express / TypeScript",
      version: "1.0.0",
      description: "API Docs for Products",
    },
  },
  /* 'apis' es el lugar en donde va a encontrar los Endpoints que nosotros queremos
    documentar. Nuestros Endpoints están en el archivo 'router.ts' */
  apis: ["./src/router.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

/* Para cambiar el logo de Swagger */
const swaggerUiOptions: SwaggerUiOptions = {
  customCss: `
  .topbar-wrapper .link {
  content: url('https://lh3.googleusercontent.com/a/ACg8ocLkOQtJ5NbiGU7nSbQwvGTkPEQA66mHFS2ZrrsBItV1KuXNaDAh=s288-c-no');
  height: 300px;
  width: auto;
  }

  .swagger-ui .topbar {
    background-color: #2b3b45;
  }
  `,
  customSiteTitle: "Documentacion Rest API Express / TypeScript",
};

export default swaggerSpec;
export { swaggerUiOptions };
