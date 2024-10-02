import express from "express";
import { Product } from "../db/sequelize.mjs";
import { sucess } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const productsRouter = express();
/**
 * @swagger
 * /api/products/:
 *  get:
 *    tags: [Products]
 *    security :
 *      - bearerAuth: []
 *    summary: Retrieve all products.
 *    description: Retrieve all products. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: All products
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  propreties:
 *                    id:
 *                      type: integer
 *                      description: The product ID.
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: The product's name
 *                      example: Big Mac
 *                    price:
 *                      type: number
 *                      description: The product's price
 *                      example: 5.99
 */
productsRouter.get("/", auth, (req, res) => {
  if (req.query.name) {
    if (req.query.name.length < 2) {
      const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
      return res.status(400).json({ message });
    }
    let limit = 3;
    if (req.query.limit) {
      limit = parseInt(req.query.limit, 10);
    }
    return Product.findAll({
      where: { name: { [Op.like]: `%${req.query.name}%` } },
      order: ["name"],
      limit: limit,
    }).then((products) => {
      const message = `Il y a ${products.count} produit qui correspondant au treme de la recherche`;
      res.json(sucess(message, products));
    });
  }
  Product.findAll({ order: ["name"] })
    .then((products) => {
      const message = "La liste des produits a bien été récupérée. ";
      res.json(sucess(message, products));
    })
    .catch((error) => {
      const message =
        "La liste des produits n'a pas été récupérée. Merci de réessayer dans quelque instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/products/:id:
 *  get:
 *    tags: [Products]
 *    security :
 *      - bearerAuth: []
 *    summary: Retrieve one products via a id pass in the browser.
 *    description: Retrieve one products via a id pass in the browser. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: One Product
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  propreties:
 *                    id:
 *                      type: integer
 *                      description: The product ID.
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: The product's name
 *                      example: Big Mac
 *                    price:
 *                      type: number
 *                      description: The product's price
 *                      example: 5.99
 */
productsRouter.get("/:id", auth, (req, res) => {
  Product.findByPk(req.params.id)
    .then((product) => {
      if (product === null) {
        const message =
          "Le produit demandé n'existe pas. Merci de réessayer avec une autre identifiant.";
        return res.status(404).json({ message });
      }
      const message = `Le produit dont l'id vaut ${product.id} a bien été récupérée`;
      res.json(sucess(message, product));
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/products/:id:
 *  post:
 *    tags: [Products]
 *    security :
 *      - bearerAuth: []
 *    summary: Add a product into the db.
 *    description: Add a product into the db. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: One product.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  propreties:
 *                    id:
 *                      type: integer
 *                      description: The product ID.
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: The product's name
 *                      example: Big Mac
 *                    price:
 *                      type: number
 *                      description: The product's price
 *                      example: 5.99
 */
productsRouter.post("/", auth, (req, res) => {
  Product.create(req.body)
    .then((createdProduct) => {
      const message = `Le produit ${createdProduct.name} a bien été crée !`;
      res.json(sucess(message, createdProduct));
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      const message =
        "Le produit n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/products/:id:
 *  put:
 *    tags: [Products]
 *    security :
 *      - bearerAuth: []
 *    summary. Change a product into the db.
 *    description: change a product into the db. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: One product.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  propreties:
 *                    id:
 *                      type: integer
 *                      description: The product ID.
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: The product's name
 *                      example: Big Mac
 *                    price:
 *                      type: number
 *                      description: The product's price
 *                      example: 5.99
 */
productsRouter.put("/:id", auth, (req, res) => {
  const productId = req.params.id;
  Product.update(req.body, { where: { id: productId } })
    .then((_) => {
      return Product.findByPk(productId).then((updateProduct) => {
        if (updateProduct === null) {
          const message =
            "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
          return res.status(404).json({ message });
        }
        const message = `Le produit ${updateProduct.name} a bien été modifié`;
        res.json(sucess(message, updateProduct));
      });
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

productsRouter.delete("/:id", auth, (req, res) => {
  Product.findByPk(req.params.id)
    .then((deleteProduct) => {
      if (deleteProduct == null) {
        const message =
          "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant";
        return res.status(404).json({ message });
      }
      return Product.destroy({
        where: { id: deleteProduct.id },
      }).then((_) => {
        const message = `Le produit ${deleteProduct.name} a bien été supprimé`;
        res.json(sucess(message, deleteProduct));
      });
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

export { productsRouter };
