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
    success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: process.env.STRIPE_CANCEL_URL,
  });

  return session;
};
