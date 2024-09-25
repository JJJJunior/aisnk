import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const OPTIONS = () => {
  return NextResponse.json({});
};

export const POST = async (req: NextRequest) => {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { cartItems, customer, exchangeRateAndShipping } = await req.json();
    if (!cartItems || !customer || !exchangeRateAndShipping) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }
    //付款信息交互
    const session = await stripe.checkout.sessions.create({
      payment_method_types: exchangeRateAndShipping.paymentTypeInStripe.split(","),
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: exchangeRateAndShipping.allowedCountries.split(","),
      },
      shipping_options: [{ shipping_rate: exchangeRateAndShipping.shippingCodeInStripe.trim() }],
      line_items: cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: cartItem.item.title,
            metadata: {
              productId: cartItem.item.id,
              ...(cartItem.size && { size: cartItem.size }),
              ...(cartItem.color && { color: cartItem.color }),
            },
          },
          // 如果有打折就算折扣,选择不同国家，加入购物车前RBM价格，放入购物车后本国价格，结算按照USD结算
          unit_amount: cartItem.item.discount
            ? Math.ceil(
                cartItem.item.discount *
                  cartItem.item.price *
                  exchangeRateAndShipping.exchangeRate *
                  exchangeRateAndShipping.toUSDRate
              ) * 100
            : Math.ceil(
                cartItem.item.price * exchangeRateAndShipping.exchangeRate * exchangeRateAndShipping.toUSDRate
              ) * 100,
        },
        quantity: cartItem.quantity,
      })),
      client_reference_id: customer.id,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/web/payment_success`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/web`,
    });
    return NextResponse.json(session);
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
