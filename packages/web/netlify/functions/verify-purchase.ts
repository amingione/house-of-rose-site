import Stripe from 'stripe';
import { sanity, json } from './_lib/cart';
import {
  scheduleOpenAIAdsConversion,
  type OpenAIAdsNetlifyContext,
} from './_lib/server/openai-ads';

interface VerifiedOrder {
  _id: string;
  orderNumber: string;
  status: string;
  email?: string;
  phone?: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  inventoryDecrementedAt?: string;
  measurementConsent?: {
    ad_storage?: string;
    ad_user_data?: string;
    ad_personalization?: string;
  };
  items: Array<{
    sku?: string;
    title: string;
    quantity: number;
    unitPrice: number;
    product?: {
      _id?: string;
      sku?: string;
      brand?: string;
      brandRef?: { title?: string };
      category?: string;
    };
  }>;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export default async function handler(
  request: Request,
  context: OpenAIAdsNetlifyContext,
): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!process.env.STRIPE_SECRET_KEY) return json({ error: 'Purchase verification is unavailable.' }, 503);

  let clientSecret: string;
  let sourceUrl: string | undefined;
  try {
    const body = (await request.json()) as { clientSecret?: unknown; sourceUrl?: unknown };
    clientSecret = typeof body.clientSecret === 'string' ? body.clientSecret.trim() : '';
    sourceUrl = typeof body.sourceUrl === 'string' ? body.sourceUrl : undefined;
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (!clientSecret || !clientSecret.includes('_secret_')) {
    return json({ error: 'A valid payment credential is required.' }, 400);
  }

  try {
    const paymentIntentId = clientSecret.split('_secret_')[0];
    if (!paymentIntentId?.startsWith('pi_')) return json({ error: 'Invalid payment credential.' }, 400);
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId, { client_secret: clientSecret });
    const order = await sanity.fetch<VerifiedOrder | null>(
      `*[_type == "order" && stripePaymentIntentId == $paymentIntentId][0]{
        _id, orderNumber, status, email, phone, subtotal, shippingCost, tax, total,
        inventoryDecrementedAt,
        measurementConsent,
        items[]{
          sku, title, quantity, unitPrice,
          "product": product->{ _id, sku, brand, "brandRef": brandRef->{ title }, category }
        }
      }`,
      { paymentIntentId: intent.id },
    );
    if (!order || intent.metadata?.sanityOrderId !== order._id) {
      return json({ error: 'The payment does not match a saved order.' }, 404);
    }

    if (intent.status === 'processing') {
      return json({ paymentStatus: 'processing', orderNumber: order.orderNumber });
    }
    if (intent.status !== 'succeeded') {
      return json({ paymentStatus: 'failed', orderNumber: order.orderNumber });
    }
    if (order.status !== 'paid' && order.status !== 'readyToShip' && order.status !== 'shipped') {
      return json({ paymentStatus: 'processing', orderNumber: order.orderNumber });
    }
    if (intent.amount_received !== order.total || intent.currency !== 'usd') {
      return json({ error: 'Paid amount does not match the order.' }, 409);
    }

    const enhancedConversionsAllowed =
      order.measurementConsent?.ad_storage === 'granted' &&
      order.measurementConsent?.ad_user_data === 'granted';

    scheduleOpenAIAdsConversion(context, () => ({
      id: order.orderNumber,
      type: 'order_created',
      request,
      sourceUrl,
      fallbackPath: '/order-confirmed/',
      email: order.email,
      timestampMs: order.inventoryDecrementedAt
        ? Date.parse(order.inventoryDecrementedAt)
        : undefined,
      consent: {
        adStorage: order.measurementConsent?.ad_storage,
        adUserData: order.measurementConsent?.ad_user_data,
        adPersonalization: order.measurementConsent?.ad_personalization,
      },
      data: {
        type: 'contents',
        amount: order.total,
        currency: 'USD',
        contents: order.items.map((item) => ({
          id: item.sku ?? item.product?.sku ?? item.product?._id ?? item.title,
          name: item.title,
          content_type: 'product',
          quantity: item.quantity,
          amount: item.unitPrice,
          currency: 'USD',
        })),
      },
    }));

    return json({
      paymentStatus: 'succeeded',
      transactionId: order.orderNumber,
      orderNumber: order.orderNumber,
      currency: 'USD',
      value: order.total / 100,
      subtotal: order.subtotal / 100,
      shipping: order.shippingCost / 100,
      tax: order.tax / 100,
      discount: 0,
      items: order.items.map((item) => ({
        item_id: item.sku ?? item.product?.sku ?? item.product?._id,
        item_name: item.title,
        item_brand: item.product?.brandRef?.title ?? item.product?.brand,
        item_category: item.product?.category,
        price: item.unitPrice / 100,
        quantity: item.quantity,
      })),
      ...(enhancedConversionsAllowed
        ? {
            enhancedConversionData: {
              email: order.email?.trim().toLowerCase(),
              phone_number: order.phone?.replace(/[^\d+]/g, ''),
            },
          }
        : {}),
    });
  } catch (error) {
    console.error('[verify-purchase]', error);
    return json({ error: 'Purchase verification failed.' }, 502);
  }
}
