const ApiError = require("../utils/apiError");
const { toBrandResponse } = require("../models/brand.model");
const {
  listBrands,
  getBrandById,
  findBrandByName,
  createBrand,
  updateBrand,
  deleteBrand
} = require("../repositories/brand.repository");

const getAllBrands = async () => {
  const rows = await listBrands();
  return rows.map(toBrandResponse);
};

const getById = async (id) => {
  const row = await getBrandById(id);
  if (!row) {
    throw new ApiError(404, "Brand not found");
  }

  return toBrandResponse(row);
};

const createByAdmin = async ({ name }) => {
  const normalizedName = String(name || "").trim();
  const conflict = await findBrandByName(normalizedName);
  if (conflict) {
    throw new ApiError(409, "Brand already exists");
  }

  const row = await createBrand(normalizedName);
  return toBrandResponse(row);
};

const updateByAdmin = async (id, { name }) => {
  const existing = await getBrandById(id);
  if (!existing) {
    throw new ApiError(404, "Brand not found");
  }

  const normalizedName = String(name || "").trim();
  if (normalizedName !== existing.name) {
    const conflict = await findBrandByName(normalizedName);
    if (conflict && conflict.id !== id) {
      throw new ApiError(409, "Brand already exists");
    }
  }

  const row = await updateBrand(id, normalizedName);
  return toBrandResponse(row);
};

const removeByAdmin = async (id) => {
  const existing = await getBrandById(id);
  if (!existing) {
    throw new ApiError(404, "Brand not found");
  }

  try {
    await deleteBrand(id);
  } catch (error) {
    if (error && (error.errno === 1451 || error.code === "ER_ROW_IS_REFERENCED_2")) {
      throw new ApiError(400, "Cannot delete brand because it is being used by products");
    }

    throw error;
  }
};

module.exports = {
  getAllBrands,
  getById,
  createByAdmin,
  updateByAdmin,
  removeByAdmin
};
