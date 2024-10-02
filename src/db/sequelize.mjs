import { Sequelize, DataTypes } from "sequelize";
import { ProductModel } from "../models/products.mjs";
import { UserModel } from "../models/user.mjs";
import { products } from "./mock-product.mjs";
import bcrypt from "bcrypt";

const sequelize = new Sequelize("db_products", "root", "root", {
  host: "localhost",
  port: "6033",
  dialect: "mysql",
  logging: false,
});

const Product = ProductModel(sequelize, DataTypes);

const User = UserModel(sequelize, DataTypes);

let initDb = () => {
  return sequelize.sync({ force: true }).then((_) => {
    importProducts();
    importUsers();
    console.log("La base de données db_products a bien été synchronisée");
  });
};

const importProducts = () => {
  products.map((product) => {
    Product.create({
      name: product.name,
      price: product.price,
    }).then((product) => console.log(product.toJSON()));
  });
};

const importUsers = () => {
  bcrypt
    .hash("etml", 10)
    .then((hash) =>
      User.create({
        username: "etml",
        password: hash,
      })
    )
    .then((user) => console.log(user.toJSON()));
};

export { sequelize, initDb, Product, User };
