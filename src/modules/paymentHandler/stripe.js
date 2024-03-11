import Stripe from "stripe";
import Coupon from "../../../DB/models/coupon.model.js";

export const createCheckoutSession = async ({
  customer_email,
  metadata,
  discounts,
  line_items,
}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    customer_email,
    payment_method_types: ["card"],
    line_items,
    discounts,
    mode: "payment",
    metadata,
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL,
  });

  return session;
};

export const createStripeCoupon = async ({ name, amount_off, percent_off }) => {
  if (amount_off && percent_off) {
    throw new Error("amount_off or percent_off should be provided, not both.");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let coupon = {};
  if (amount_off) {
    coupon = {
      name,
      amount_off,
      currency: "egp",
      duration: "once",
    };
  }

  if (percent_off) {
    coupon = {
      name,
      percent_off,
      duration: "once",
    };
  }

  coupon = await stripe.coupons.create(coupon);

  return coupon;
};

export const craetePaymentMethod = async ({ token }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: {
      token,
    },
  });

  return paymentMethod;
};

export const createPaymentIntent = async (amount) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const paymentMethod = await craetePaymentMethod({ token: "tok_visa" });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "egp",
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
    payment_method: paymentMethod.id,
  });

  return paymentIntent;
};

export const retrievePaymentIntent = async ({ paymentIntentId }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent;
};

export const confirmPaymentIntent = async ({ paymentIntentId }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const paymentDetails = await retrievePaymentIntent({ paymentIntentId });

  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentDetails.payment_method,
  });
  return paymentIntent;
};

export const refundPaymentIntent = async ({ paymentIntentId }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
  });
  return refund;
};
