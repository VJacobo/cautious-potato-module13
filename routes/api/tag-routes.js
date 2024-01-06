const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll ({
      include: [{ model: Product, through: ProductTag, as: 'products'}],
    });
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'products'}],
    });

    if (!tag) {
      return res.status(404).json({ message: ' Tag not found' });
    }
    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    res.json(newTag);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updatedTag = await Tag.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updatedTag[0]) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json({ message: 'Tag updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deletedTag = await Tag.destroy({
      where: { id: req.params.id },
    });
    if (!deletedTag) {
      return res.status(404).json({ message: ' Tag not found' });
    }
    res.json.status(404).json({ message: ' Tag deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
