const cartService = require("../services/cart.service");

const addItem = async (req, res, next) => {
  try {
    const data = await cartService.addItem({
      userId: req.user.id,
      productId: Number(req.body.productId),
      quantity: Number(req.body.quantity || 1)
    });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const getMine = async (req, res, next) => {
  try {
    const data = await cartService.getMyCart(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const data = await cartService.updateItemQuantity({
      userId: req.user.id,
      itemId: Number(req.params.itemId),
      quantity: Number(req.body.quantity)
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    await cartService.removeItem({
      userId: req.user.id,
      itemId: Number(req.params.itemId)
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addItem,
  getMine,
  updateItem,
  removeItem
};
