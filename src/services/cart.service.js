const ApiError = require("../utils/apiError");
const { toCartResponse } = require("../models/cart.model");
const { toCartItemResponse, toCartItemDetailResponse } = require("../models/cartItem.model");
const {
  getProductById,
  getOrCreateDefaultVariantByProductId,
  getOrCreateCartByUserId,
  getCartItemByCartAndVariant,
  createCartItem,
  updateCartItemQuantity,
  getCartItemsByCartId,
  getCartItemByIdAndCartId,
  deleteCartItemById
} = require("../repositories/cart.repository");

const addItem = async ({ userId, productId, quantity }) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, "Not enough stock");
  }

  const cart = await getOrCreateCartByUserId(userId);
  const variantId = await getOrCreateDefaultVariantByProductId(productId);

  const existingItem = await getCartItemByCartAndVariant(cart.id, variantId);
  if (!existingItem) {
    const item = await createCartItem({ cartId: cart.id, variantId, quantity });
    return {
      cart: toCartResponse(cart),
      item: toCartItemResponse(item)
    };
  }

  const nextQuantity = existingItem.quantity + quantity;
  if (nextQuantity > product.stock) {
    throw new ApiError(400, "Cart quantity exceeds stock");
  }

  const item = await updateCartItemQuantity(existingItem.id, nextQuantity);
  return {
    cart: toCartResponse(cart),
    item: toCartItemResponse(item)
  };
};

const getMyCart = async (userId) => {
  const cart = await getOrCreateCartByUserId(userId);
  const items = await getCartItemsByCartId(cart.id);

  return {
    cart: toCartResponse(cart),
    items: items.map(toCartItemDetailResponse)
  };
};

const updateItemQuantity = async ({ userId, itemId, quantity }) => {
  const cart = await getOrCreateCartByUserId(userId);
  const item = await getCartItemByIdAndCartId(itemId, cart.id);

  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }

  if (quantity > item.product_stock) {
    throw new ApiError(400, "Cart quantity exceeds stock");
  }

  const updated = await updateCartItemQuantity(item.id, quantity);
  return toCartItemResponse(updated);
};

const removeItem = async ({ userId, itemId }) => {
  const cart = await getOrCreateCartByUserId(userId);
  const item = await getCartItemByIdAndCartId(itemId, cart.id);

  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }

  await deleteCartItemById(item.id);
};

module.exports = {
  addItem,
  getMyCart,
  updateItemQuantity,
  removeItem
};
