/**
 * Razorpay SDK helper — server-side only.
 *
 * Required env vars:
 *   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxxx
 *   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
 *
 * Get them from: https://dashboard.razorpay.com/app/keys
 */
import "server-only";
import Razorpay from "razorpay";

let _instance = null;

export function getRazorpay() {
  if (_instance) return _instance;

  const key_id     = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay credentials missing. " +
      "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local. " +
      "Get them from https://dashboard.razorpay.com/app/keys"
    );
  }

  _instance = new Razorpay({ key_id, key_secret });
  return _instance;
}

export function isRazorpayConfigured() {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

/**
 * Verify Razorpay payment signature (HMAC-SHA256).
 * @param {string} orderId   — razorpay_order_id from client
 * @param {string} paymentId — razorpay_payment_id from client
 * @param {string} signature — razorpay_signature from client
 */
export function verifyPaymentSignature(orderId, paymentId, signature) {
  const crypto = require("crypto");
  const body   = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  return expected === signature;
}
