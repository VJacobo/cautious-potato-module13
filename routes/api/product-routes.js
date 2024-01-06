const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('./models');

// The `/api/products` endpoint

// get all products
router.get('/' , async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, { model: Tag, through: ProductTag }],
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: ' Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [ Category, { model: Tag, through: ProductTag }],
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found'});
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error'});
  }
});
  // find all products
  // be sure to include its associated Category and Tag data

  // be sure to include its associated Category and Tag data


// create new product
router.post('/', async (req,res) => {
  try {
    const { product_name, price, stock, tagIds } = req.body;
    const newProduct = await Product.creat({ product_name, price, stock });

    if (tagIds && tagIds.length) {
      const productTagPromises = tagIDs.map((tag_id) => {
        return ProductTag.findOrCreate({
          where: { product_id: newProduct.id, tag_id },
        });
      });
      await Promise.all(productTagPromises);
    }
    res.status(200).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json({ Message: 'Bad request', error: err });
  }
});
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
});

module.exports = router;
