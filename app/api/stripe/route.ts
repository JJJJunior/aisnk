import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/prisma/db";
import { generateOrderId } from "@/app/lib/orders";

//   创建 Stripe 实例
export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const POST = async (req: NextRequest) => {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("Stripe-signature") as string;
    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // console.log("[webhooks_POST]", session);

      // 客户信息
      const customerInfo = {
        id: session.client_reference_id || "",
        name: session.customer_details?.name || "",
        email_stripe: session.customer_details?.email || "",
        phone: session.customer_details?.phone || "",
      };

      // 配送信息
      const shippingAddress = {
        streetNumber: session.shipping_details?.address?.line1 || "",
        streetName: session.shipping_details?.address?.line2 || "",
        city: session.shipping_details?.address?.city || "",
        state: session.shipping_details?.address?.state || "",
        postalCode: session.shipping_details?.address?.postal_code || "",
        country: session.shipping_details?.address?.country || "",
      };

      // console.log("[shippingAddress]", shippingAddress)
      // 物品信息
      const retrieveSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items.data.price.product"],
      });

      // console.log("[retrieveSession......]", retrieveSession);

      const lineItems = await retrieveSession?.line_items?.data;

      // console.log("[lineItems............]", lineItems)

      //   订单信息
      const orderItems =
        lineItems?.map((item: any) => {
          return {
            product: item.price.product.metadata.productId,
            title: item.description,
            currency: item.currency,
            amountDiscount: item.amount_discount,
            amountSubtotal: item.amount_subtotal,
            amountTax: item.amount_tax,
            amountTotal: item.amount_total,
            color: item.price.product.metadata.color || "N/A",
            size: item.price.product.metadata.size || "N/A",
            quantity: item.quantity,
          };
        }) || [];

      // 创建订单
      const newOrder = {
        customerId: customerInfo.id,
        products: orderItems,
        shippingAddress: {
          streetNumber: shippingAddress.streetNumber,
          streetName: shippingAddress.streetName,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        shippingRate: session.shipping_cost ? session.shipping_cost.shipping_rate : "",
        totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      };

      // console.log("[newOrder]", newOrder)

      //save order
      await prisma.order.create({
        data: {
          id: generateOrderId(), //生成订单id
          products: {
            create: newOrder.products.map((item) => ({
              product: {
                connect: {
                  id: Number(item.product),
                },
              },
              title: item.title,
              currency: item.currency,
              amountDiscount: item.amountDiscount,
              amountSubtotal: item.amountSubtotal,
              amountTax: item.amountTax,
              amountTotal: item.amountTotal,
              color: item.color,
              size: item.size,
              quantity: item.quantity,
            })),
          },
          shippingAddress: {
            create: {
              streetNumber: newOrder.shippingAddress.streetNumber,
              streetName: newOrder.shippingAddress.streetName,
              city: newOrder.shippingAddress.city,
              state: newOrder.shippingAddress.state,
              postalCode: newOrder.shippingAddress.postalCode,
              country: newOrder.shippingAddress.country,
            },
          },
          shippingRate: newOrder.shippingRate as string,
          customer: {
            connectOrCreate: {
              create: {
                id: customerInfo.id,
                name: customerInfo.name,
                email_stripe: customerInfo.email_stripe,
                phone: customerInfo.phone,
              },
              where: {
                id: customerInfo.id,
              },
            },
          },
          totalAmount: newOrder.totalAmount,
          status: "已支付",
        },
      });
      //   发送 email/SMS/push notification
    }
    return new NextResponse("success", { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse("Failed to create the order", { status: 500 });
  }
};
