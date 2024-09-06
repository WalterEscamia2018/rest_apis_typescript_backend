/*
Vamos a importar nuestros decoredores de Sequelize para nuestras tablas.

En este archivo vamos a definir los modelos para nuestras bases de datos
*/
import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({
  tableName: "products",
})

/*
Con 'extends' vamos a heredar todas las funcionalidades de Model

En el modelo definimos los atributos que va a tener 'Product'

El 'id' no lo vamos a definir, porque ese lo genera la base de datos.
*/
class Product extends Model {
  /* Así definimos una columna en nuestra base de datos y se genera en la base
    de datos */
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;

  @Column({
    type: DataType.FLOAT,
  })
  declare price: number;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare availability: boolean;
}

export default Product;
