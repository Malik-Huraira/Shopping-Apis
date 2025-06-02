const Order = require("../models/orderModel");
const Product = require("../models/productModels");

// Create a new order with products and calculate total price
const createOrder = async (userId, products) => {
  let totalPrice = 0;
  const orderItems = [];

  for (const item of products) {
    const product = await Product.findById(item.product_id);
    if (!product) throw new Error(`Product ID ${item.product_id} not found`);

    const itemTotal = product.price * item.quantity;
    totalPrice += itemTotal;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const order = new Order({
    user: userId,
    total_price: totalPrice,
    items: orderItems,
  });

  const savedOrder = await order.save();
  return savedOrder._id;
};

// Get order by ID with populated user and product details
const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate("user")
    .populate("items.product");
  return order;
};

// Get all orders for a user with populated product details
const getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId }).populate("items.product");
  return orders;
};

// Update order status (pending, shipped, delivered, cancelled)
const updateOrderStatus = async (id, status) => {
  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
  const lowerStatus = status.toLowerCase();

  if (!validStatuses.includes(lowerStatus)) {
    throw new Error(`Invalid status. Allowed: ${validStatuses.join(", ")}`);
  }

  const result = await Order.findByIdAndUpdate(
    id,
    { status: lowerStatus },
    { new: true }
  );
  return result ? 1 : 0;
};

// Delete an order by ID
const deleteOrder = async (id) => {
  const result = await Order.findByIdAndDelete(id);
  return result ? 1 : 0;
};

// Get paginated orders for a user
const getPaginatedUserOrders = async (userId, limit, offset) => {
  const orders = await Order.find({ user: userId })
    .skip(offset)
    .limit(limit)
    .populate("items.product");
  return orders;
};

// Get total number of orders for a user
const getTotalUserOrdersCount = async (userId) => {
  const count = await Order.countDocuments({ user: userId });
  return count;
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
  getPaginatedUserOrders,
  getTotalUserOrdersCount,
};
