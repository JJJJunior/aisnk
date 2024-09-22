import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const OPTIONS = () => {
  return NextResponse.json({});
};

export const POST = async (req: NextRequest) => {
  try {
    const { cartItems, customer, exchangeRate } = await req.json();
    if (!cartItems || !customer || !exchangeRate) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }

    //付款信息交互
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "alipay"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "AU", "CA", "DE"],
      },
      shipping_options: [{ shipping_rate: "shr_1Q1McqBmoK3h4yLlHo32pF7q" }],
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
          // 如果有打折就算折扣
          unit_amount: cartItem.item.discount
            ? Math.ceil(cartItem.item.discount * cartItem.item.price * exchangeRate) * 100
            : Math.ceil(cartItem.item.price * exchangeRate) * 100,
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
