const ApiError = require("../utils/apiError");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../repositories/product.repository");
const { toProductResponse } = require("../models/product.model");

const listProducts = async () => {
  const rows = await getAllProducts();
  return rows.map(toProductResponse);
};

const getById = async (id) => {
  const row = await getProductById(id);
  if (!row) {
    throw new ApiError(404, "Product not found");
  }
  return toProductResponse(row);
};

const create = async (payload) => {
  const row = await createProduct(payload);
  return toProductResponse(row);
};

const update = async (id, payload) => {
  const exists = await getProductById(id);
  if (!exists) {
    throw new ApiError(404, "Product not found");
  }

  const mapped = {
    name: payload.name,
    brand: payload.brand,
    price: payload.price,
    stock: payload.stock,
    description: payload.description,
    image_url: payload.imageUrl
  };

  const row = await updateProduct(id, mapped);
  return toProductResponse(row);
};

const remove = async (id) => {
  const deleted = await deleteProduct(id);
  if (!deleted) {
    throw new ApiError(404, "Product not found");
  }
};

module.exports = {
  listProducts,
  getById,
  create,
  update,
  remove
};
