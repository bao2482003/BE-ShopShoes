const productService = require("../services/product.service");

const list = async (req, res, next) => {
  try {
    const data = await productService.listProducts();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const data = await productService.getById(Number(req.params.id));
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const data = await productService.create({ ...req.body, imageUrl });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const data = await productService.update(Number(req.params.id), { ...req.body, imageUrl });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await productService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
  getOne,
  create,
  update,
  remove
};
