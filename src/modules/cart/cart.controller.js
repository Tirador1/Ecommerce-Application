import Cart from "../../../DB/models/cart.model.js";
import Product from "../../../DB/models/product.model.js";

export const addtoCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const { _id } = req.user;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).send({ error: "product not found" });

  if (quantity > product.quantity)
    return res.status(400).send({ error: "quantity is greater than stock" });

  const isCartExist = await Cart.findOne({ userId: _id });
  if (isCartExist) {
    const isProductExist = isCartExist.products.find(
      (item) => item.productId.toString() === productId
    );
    if (isProductExist) {
      isProductExist.quantity = quantity;
      isProductExist.finalPrice = product.price * quantity;
    } else {
      isCartExist.products.push({
        productId,
        title: product.title,
        quantity,
        price: product.price,
        finalPrice: product.price * quantity,
      });
    }
    let subTotal = 0;
    for (const product of isCartExist.products) {
      subTotal += product.finalPrice;
    }
    isCartExist.subTotal = subTotal;
    await isCartExist.save();
    return res
      .status(201)
      .json({ message: "product added to cart", isCartExist });
  }

  const newCart = await Cart.create({
    userId: _id,
    products: [
      {
        productId,
        title: product.title,
        quantity,
        price: product.price,
        finalPrice: product.price * quantity,
      },
    ],
    subTotal: product.price * quantity,
  });
  return res.status(201).json({ message: "product added to cart", newCart });
};

export const removeFromCart = async (req, res, next) => {
  const { productId } = req.body;
  const { _id } = req.user;

  const isCartExist = await Cart.findOne({ userId: _id });
  if (!isCartExist) return next({ cause: 404, message: "Cart not found" });

  const isProductExist = isCartExist.products.find(
    (item) => item.productId.toString() === productId
  );
  if (!isProductExist)
    return next({ cause: 404, message: "Product not found in cart" });

  isCartExist.products = isCartExist.products.filter(
    (item) => item.productId.toString() !== productId
  );

  let subTotal = 0;
  for (const product of isCartExist.products) {
    subTotal += product.finalPrice;
  }
  isCartExist.subTotal = subTotal;
  await isCartExist.save();

  if (isCartExist.products.length === 0) {
    await Cart.findByIdAndDelete(isCartExist._id);
  }

  res.status(200).json({ message: "Product removed from cart" });
};

export const getCart = async (req, res) => {
  const { _id } = req.user;

  const cart = await Cart.findOne({ userId: _id });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  res.status(200).json({ cart });
};
