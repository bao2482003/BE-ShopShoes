const userService = require("../services/user.service");

const list = async (req, res, next) => {
  try {
    const data = await userService.getAllUsers();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await userService.createByAdmin(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await userService.updateByAdmin(Number(req.params.id), req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await userService.removeByAdmin(Number(req.params.id), req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
  create,
  update,
  remove
};
