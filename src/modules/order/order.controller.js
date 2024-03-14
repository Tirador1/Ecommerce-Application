import { DateTime } from "luxon";

import Order from "../../../DB/models/order.model.js";
import Product from "../../../DB/models/product.model.js";
import Coupon from "../../../DB/models/coupon.model.js";
import Cart from "../../../DB/models/cart.model.js";
import couponUsersModel from "../../../DB/models/coupon-users.model.js";
import {
  createCheckoutSession,
  createStripeCoupon,
  createPaymentIntent,
  confirmPaymentIntent,
  refundPaymentIntent,
} from "../paymentHandler/stripe.js";

export const createOrder = async (req, res, next) => {
  const {
    product,
    quantity,
    shippingAddress,
    couponId,
    paymentMethod,
    phoneNumbers,
  } = req.body;

  const { _id } = req.user;

  const isProductExist = await Product.findOne({
    _id: product,
    quantity: { $gte: quantity },
  });
  if (!isProductExist) {
    return next({
      cause: 404,
      message: "Product not found or quantity is less than the required",
    });
  }
  let totalPrice = isProductExist.price * quantity;

  if (
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    return next({
      cause: 400,
      message: "shipping address is required",
    });
  }

  if (!phoneNumbers.length) {
    return next({
      cause: 400,
      message: "phone numbers are required",
    });
  }

  let shippingPrice = totalPrice * 0.05;
  if (shippingPrice < 20) {
    shippingPrice = 20;
  }

  totalPrice += shippingPrice;

  if (couponId) {
    const isCouponExist = await Coupon.findOne({
      _id: couponId,
      couponStatus: "active",
    });
    if (!isCouponExist) {
      return next({
        cause: 404,
        message: "Coupon not found",
      });
    }

    const isCouponValidNow = isCouponExist.validTill > DateTime.now();
    if (!isCouponValidNow) {
      return next({
        cause: 400,
        message: "Coupon is expired",
      });
    }

    if (isCouponExist.isFixed) {
      totalPrice -= isCouponExist.discount;
    } else if (isCouponExist.isPercentage) {
      if (
        totalPrice >
        isCouponExist.maxDiscount * (1 / isCouponExist.discount)
      ) {
        totalPrice -= isCouponExist.maxDiscount;
      } else {
        totalPrice -= totalPrice * isCouponExist.discount;
      }
    }
    if (totalPrice < 0) {
      totalPrice = 0;
    }

    await couponUsersModel.findOneAndUpdate(
      {
        userId: _id,
        couponId,
      },
      { $inc: { usedCount: 1 } }
    );
  }

  const newOrder = await Order.create({
    user: _id,
    products: [
      {
        product: isProductExist._id,
        title: isProductExist.title,
        quantity: quantity,
        price: isProductExist.price,
      },
    ],
    shippingAddress,
    phoneNumbers,
    shippingPrice,
    coupon: couponId,
    totalPrice,
    paymentMethod,
  });

  return res
    .status(201)
    .json({ message: "Order created successfully", newOrder });
};

export const convertCartToOrder = async (req, res, next) => {
  const { shippingAddress, couponId, paymentMethod, phoneNumbers } = req.body;

  const { _id } = req.user;

  const isCartExist = await Cart.findOne({ userId: _id });
  if (!isCartExist) {
    return next({ cause: 404, message: "Cart not found" });
  }

  let totalPrice = isCartExist.subTotal;

  if (
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    return next({
      cause: 400,
      message: "shipping address is required",
    });
  }

  if (!phoneNumbers.length) {
    return next({
      cause: 400,
      message: "phone numbers are required",
    });
  }

  let shippingPrice = totalPrice * 0.05;

  if (shippingPrice < 20) {
    shippingPrice = 20;
  }

  totalPrice += shippingPrice;

  if (couponId) {
    const isCouponExist = await Coupon.findOne({
      _id: couponId,
      couponStatus: "active",
    });
    if (!isCouponExist) {
      return next({
        cause: 404,
        message: "Coupon not found",
      });
    }

    const isCouponValidNow = isCouponExist.validTill > DateTime.now();
    if (!isCouponValidNow) {
      return next({
        cause: 400,
        message: "Coupon is expired",
      });
    }

    if (isCouponExist.isFixed) {
      totalPrice -= isCouponExist.discount;
    } else if (isCouponExist.isPercentage) {
      if (
        totalPrice >
        isCouponExist.maxDiscount * (1 / isCouponExist.discount)
      ) {
        totalPrice -= isCouponExist.maxDiscount;
      } else {
        totalPrice -= totalPrice * isCouponExist.discount;
      }
    }
    if (totalPrice < 0) {
      totalPrice = 0;
    }

    await couponUsersModel.findOneAndUpdate(
      {
        userId: _id,
        couponId,
      },
      { $inc: { usedCount: 1 } }
    );
  }

  let products = [];
  for (const product of isCartExist.products) {
    const isProductExist = await Product.findOne({
      _id: product.productId,
      quantity: { $gte: product.quantity },
    });
    if (!isProductExist) {
      return next({
        cause: 404,
        message: "Product not found or quantity is less than the required",
      });
    }
    products.push({
      product: isProductExist._id,
      title: isProductExist.title,
      quantity: product.quantity,
      price: isProductExist.price,
    });
  }

  const newOrder = await Order.create({
    user: _id,
    products: products,
    shippingAddress,
    phoneNumbers,
    shippingPrice,
    coupon: couponId,
    totalPrice,
    paymentMethod,
  });

  await Cart.findOneAndDelete({ userId: _id });

  return res
    .status(201)
    .json({ message: "Order created successfully", newOrder });
};

export const getOrders = async (req, res, next) => {
  const { _id } = req.user;

  const orders = await Order.find({ user: _id });
  if (!orders.length) {
    return next({ cause: 404, message: "Orders not found" });
  }

  return res.status(200).json({ orders });
};

export const getOrder = async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    return next({ cause: 404, message: "Order not found" });
  }

  return res.status(200).json({ order });
};

export const deleverOrder = async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findOne({
    _id: orderId,
    orderStatus: { $in: ["Paid", "Placed"] },
  });
  if (!order) {
    return next({ cause: 404, message: "Order not found" });
  }

  if (order.isDelivered) {
    return next({ cause: 400, message: "Order already delevered" });
  }

  order.isDelivered = true;
  order.deliveredAt = DateTime.now();
  order.status = "Delivered";
  order.deliveredBy = req.user._id;

  await order.save();

  return res.status(200).json({ message: "Order delevered successfully" });
};

export const payStripe = async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findOne({
    _id: orderId,
    orederStatus: "Pending",
  });
  if (!order) {
    return next({ cause: 404, message: "Order not found" });
  }

  let line_items = [];
  for (const product of order.products) {
    line_items.push({
      price_data: {
        currency: "egp",
        product_data: {
          name: product.title,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    });
  }

  const sessionObject = {
    customer_email: req.user.email,
    metadata: { orderId: order._id.toString() },
    discounts: [],
    line_items,
  };

  if (order.coupon) {
    const coupon = await Coupon.findById(order.coupon);
    let couponApplied;
    if (coupon.isFixed) {
      couponApplied = await createStripeCoupon({
        name: coupon.name,
        amount_off: coupon.discount * 100,
      });
    } else if (coupon.isPercentage) {
      if (order.totalPrice > coupon.maxDiscount * (1 / coupon.discount)) {
        couponApplied = await createStripeCoupon({
          name: coupon.name,
          amount_off: coupon.maxDiscount * 100,
        });
      } else {
        couponApplied = await createStripeCoupon({
          name: coupon.name,
          percent_off: coupon.discount * 100,
        });
      }
    }

    sessionObject.discounts.push({ coupon: couponApplied.id });
  }

  const session = await createCheckoutSession(sessionObject);

  const paymentIntent = await createPaymentIntent(order.totalPrice);

  order.paymentIntentId = paymentIntent.id;
  await order.save();

  return res.status(200).json({ session });
};

export const stripeWebhook = async (req, res, next) => {
  const orderId = req.body.data.object.metadata.orderId;

  const confirmedOrder = await Order.findById(orderId);
  if (!confirmedOrder) return next({ message: "Order not found", cause: 404 });

  await confirmPaymentIntent({
    paymentIntentId: confirmedOrder.paymentIntentId,
  });

  confirmedOrder.orederStatus = "Paid";
  confirmedOrder.paymentMethod = "stripe";
  confirmedOrder.paidAt = DateTime.now();
  confirmedOrder.isPaid = true;
  await confirmedOrder.save();

  return res.status(200).json({ message: "Webhook received" });
};

export const refundOrder = async (req, res, next) => {
  const { orderId } = req.params;

  const findOrder = await Order.findOne({ _id: orderId, orederStatus: "Paid" });
  if (!findOrder)
    return next({
      message: "Order not found or cannot be refunded",
      cause: 404,
    });

  const refund = await refundPaymentIntent({
    paymentIntentId: findOrder.paymentIntentId,
  });

  findOrder.orederStatus = "Refunded";
  await findOrder.save();

  res
    .status(200)
    .json({ message: "Order refunded successfully", order: refund });
};

export const cancelOrder = async (req, res, next) => {
  const { orderId } = req.params;

  const findOrder = await Order.findOne({
    _id: orderId,
    orederStatus: { $in: ["Pending", "Paid"] },
  });
  if (!findOrder)
    return next({
      message: "Order not found or cannot be cancelled",
      cause: 404,
    });

  if (findOrder.paidAt < DateTime.now().minus({ days: 1 }).toJSDate()) {
    return next({
      message: "Order cannot be cancelled after 24 hours of payment",
      cause: 400,
    });
  }

  if (findOrder.isPaid) {
    const refund = await refundPaymentIntent({
      paymentIntentId: findOrder.paymentIntentId,
    });

    findOrder.orederStatus = "Refunded";
    findOrder.isRefunded = true;
    findOrder.refundedAt = DateTime.now();
    findOrder.refundedBy = req.user._id;

    await findOrder.save();

    return res.status(200).json({
      message: "Order cancelled and refunded successfully",
      order: refund,
    });
  }

  findOrder.orederStatus = "Cancelled";
  findOrder.cancelledAt = DateTime.now();
  findOrder.cancelledBy = req.user._id;

  await findOrder.save();

  res.status(200).json({ message: "Order cancelled successfully" });
};
