const Product = require('../model/product'); // Adjust path if needed

// 🔻 Decrease stock (called on 'order.placed')
const updateStock = async (items) => {
    for (const item of items) {
        const product = await Product.findByPk(item.product_id);
        if (!product) {
            console.warn(`⚠️ Product with ID ${item.product_id} not found.`);
            continue;
        }

        if (product.stock < item.quantity) {
            console.warn(`⚠️ Not enough stock for product ID ${item.product_id}`);
            continue;
        }

        await product.update({ stock: product.stock - item.quantity });
    }
};

// 🔁 Restore stock (called on 'order.deleted')
const restoreStock = async (items) => {
    for (const item of items) {
        const product = await Product.findByPk(item.product_id);
        if (!product) {
            console.warn(`⚠️ Product with ID ${item.product_id} not found.`);
            continue;
        }

        await product.update({ stock: product.stock + item.quantity });
    }
};

module.exports = {
    updateStock,
    restoreStock,
};
