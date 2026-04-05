const brandService = require("../services/brand.service");

const list = async (req, res, next) => {
  try {
    const data = await brandService.getAllBrands();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const data = await brandService.getById(Number(req.params.id));
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await brandService.createByAdmin(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await brandService.updateByAdmin(Number(req.params.id), req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await brandService.removeByAdmin(Number(req.params.id));
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
