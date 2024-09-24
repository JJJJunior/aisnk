"use client";
import useCart from "@/app/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MinusCircle, PlusCircle, Trash2Icon } from "lucide-react";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { CartType, CustomerType } from "@/app/lib/types";
import useRefTracker from "@/app/lib/hooks/useRefTracker";
import { ExchangeAndShippingType } from "@/app/lib/types";
import { ImageType, ProductType } from "@/app/lib/types";

export function Cart() {
  const { user } = useUser();
  const router = useRouter();
  const { refId, removeRef } = useRefTracker();
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem } = useCart();
  //用于呈现购物车的商品价格，让客户知道本国货币大约多少钱
  const [exchangeRateAndShipping, setExchangeRateAndShipping] = useState<ExchangeAndShippingType | null>(null);
  const [isFake, setIsFake] = useState(0);
  const [loading, setLoading] = useState(false);

  const getWebSettings = async () => {
    const res = await axios.get("/api/web/settings/websettings");
    if (res.status === 200) {
      setIsFake(res.data.data.is_fake);
    }
  };
  // (cartItem.item.price ?? 0) * currentRate
  const total = cartItems.reduce((acc, cartItem) => {
    const price = cartItem.item.discount
      ? Math.ceil(
          cartItem.item.discount *
            (cartItem.item.price ?? 0) *
            (exchangeRateAndShipping && exchangeRateAndShipping.exchangeRate ? exchangeRateAndShipping.exchangeRate : 1)
        )
      : Math.ceil(
          (cartItem.item.price ?? 0) *
            (exchangeRateAndShipping && exchangeRateAndShipping.exchangeRate ? exchangeRateAndShipping.exchangeRate : 1)
        );
    return acc + price * cartItem.quantity;
  }, 0);

  //获取当前汇率(仅用于购物车显示)
  useEffect(() => {
    const savedExchange = localStorage.getItem("selectedExchange");
    if (savedExchange) {
      try {
        setExchangeRateAndShipping(JSON.parse(savedExchange)); // 解析 JSON 字符串为对象
      } catch (error) {
        console.error("Failed to parse saved exchange", error);
        setExchangeRateAndShipping(null); // 解析失败时，设置为 null
      }
    } else {
      setExchangeRateAndShipping(null); // 如果 localStorage 中没有数据，设置为 null
    }
    getWebSettings();
  }, []);

  //创建客户
  const createCustomer = async (user: CustomerType) => {
    try {
      const res = await axios.post("/api/web/customers", {
        ...user,
        referredById: refId ? refId : null,
      });
      if (res.status === 200) {
        if (refId) {
          removeRef();
        }
      }
      // console.log(res.data);
    } catch (err) {
      // console.log(err)
    }
  };

  const saveCartsToDB = async (carts: CartType[], customerId: string) => {
    try {
      await axios.post("/api/web/carts", {
        cartItems: carts,
        customerId: customerId,
      });
    } catch (err) {
      // console.log(err);
    }
  };

  // 获取用户信息加载到state
  useEffect(() => {
    if (user) {
      setCustomer({
        id: user.id,
        username: user.username ? user.username : "",
        email: user.emailAddresses[0].emailAddress ? user.emailAddresses[0].emailAddress : "",
        firstName: user.firstName ? user.firstName : "",
        lastName: user.lastName ? user.lastName : "",
        createdAt: user.createdAt ? user.createdAt : null,
        lastSignInAt: user.lastSignInAt ? user.lastSignInAt : null,
        fullName: user.fullName ? user.fullName : "",
      });
    }
  }, [user]);

  //处理付款（目前只能收美元、港币、需要按照网站后台登记的汇率进行结算）
  const handlePayment = async () => {
    setLoading(true);
    // console.log(customer);
    try {
      if (!user) {
        router.push("/sign-in");
      }
      if (!exchangeRateAndShipping) return;
      const payData = JSON.stringify({
        cartItems: cartItems,
        customer,
        exchangeRateAndShipping,
      });
      // console.log(payData);
      const res = await axios.post(`/api/web/checkout`, payData);
      const data = await res.data;
      window.location.href = data.url;
    } catch (err) {
      console.log("[checkout_POST]", err);
    } finally {
      setLoading(false);
    }
  };

  //将购物车数据保存在数据库
  useEffect(() => {
    if (cartItems.length > 0 && user) {
      createCustomer({
        id: user.id,
        username: user.username ? user.username : "",
        email: user.emailAddresses[0].emailAddress ? user.emailAddresses[0].emailAddress : "",
        firstName: user.firstName ? user.firstName : "",
        lastName: user.lastName ? user.lastName : "",
        createdAt: user.createdAt ? user.createdAt : null,
        lastSignInAt: user.lastSignInAt ? user.lastSignInAt : null,
      });
    }
    if (customer) {
      saveCartsToDB(cartItems, customer.id);
    }
    // console.log("Success createCustomer saveCartsToDB");
  }, [cartItems.length, customer]);

  // 这里可以加上运费以及税率
  const subtotalRounded = parseFloat(total.toFixed(2));

  //显示伪造数据
  const ImageUrl = (images: ImageType[]) => {
    let url;
    if (isFake === 1) {
      url = `/api/images?file=${images[images.length - 1].url}`;
    } else {
      url = `/api/images?file=${images[0].url}`;
    }
    return url;
  };

  //显示伪造数据
  const ProductShowTitle = (product: ProductType) => {
    let showTitle;
    if (isFake === 1) {
      if (product.alias_title && product.alias_title.length > 0) {
        showTitle = product.alias_title;
      } else {
        showTitle =
          product.title &&
          product.title
            .split(" ")
            .slice(product.title.split(" ").length - 3, product.title.split(" ").length)
            .join(" ");
      }
    } else {
      showTitle = product.title;
    }
    return showTitle;
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="hover:text-gray-400">
          <ShoppingCart size={30} />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {!user && (
            <div className="flex gap-4 items-center text-md mb-2">
              <p>Please login and checkout.</p>
              <Button onClick={() => router.push("/web/sign-in")} className="bg-blue-600 hover:bg-blue-400">
                Sign In
              </Button>
            </div>
          )}
          <div className="flex flex-col h-72 md:h-96 overflow-auto scrollbar scrollbar-thumb-blue-600 scrollbar-track-gray-100 items-center gap-4">
            {cartItems &&
              cartItems.length > 0 &&
              cartItems.map((cartItem, index) => {
                let price;
                let discount;
                // 根据汇率显示价格,基础价格参考人民币
                if (cartItem && cartItem.item.price) {
                  price = Math.ceil(
                    cartItem.item.price *
                      (exchangeRateAndShipping?.exchangeRate ? exchangeRateAndShipping?.exchangeRate : 1)
                  );
                  discount = Math.ceil(
                    cartItem.item.price *
                      (cartItem.item.discount ? cartItem.item.discount : 1) *
                      (exchangeRateAndShipping?.exchangeRate ? exchangeRateAndShipping?.exchangeRate : 1)
                  );
                }
                return (
                  <div key={index} className="flex gap-4">
                    <Image
                      src={ImageUrl(
                        cartItem.item.images && cartItem.item.images.length > 0 ? cartItem.item.images : []
                      )}
                      width={100}
                      height={100}
                      alt={cartItem.item.title ? cartItem.item.title : ""}
                    />
                    <div className="flex flex-col gap-2">
                      <p className="text-xs w-[180px]">{ProductShowTitle(cartItem.item)}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <MinusCircle
                            className="hover:cursor-pointer"
                            size={18}
                            onClick={() => cartItem.quantity > 1 && decreaseQuantity(cartItem.item.id as number)}
                          />
                          <p className="text-sm">{cartItem.quantity}</p>
                          <PlusCircle
                            className="hover:cursor-pointer"
                            size={18}
                            onClick={() => increaseQuantity(cartItem.item.id as number)}
                          />
                        </div>
                        <Trash2Icon
                          size={18}
                          className="hover:text-red-1 cursor-pointer"
                          onClick={() => removeItem(cartItem.item.id as number)}
                        />
                      </div>
                      <div className="flex gap-1">
                        {cartItem.item.discount && cartItem.item.discount < 1 && (
                          <p className="line-through text-gray-400">$ {price}</p>
                        )}
                        <p className={cartItem.item.discount && cartItem.item.discount < 1 ? "text-red-600" : ""}>
                          $ {discount ? discount : price}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="grid grid-cols-4 items-center gap-4"></div>
        </div>
        <SheetFooter>
          <div className="flex flex-col w-full gap-2">
            <div>
              <p className="text-heading4-bold pb-4">
                Summary <span>{`(${cartItems.length} ${cartItems.length > 1 ? "items" : "item"})`}</span>
              </p>
              <div className="flex justify-between text-body-semibold">
                <span>Total</span>
                <div>
                  <span>${subtotalRounded}</span>
                  <span className="mx-2">{exchangeRateAndShipping?.currencyCode}</span>
                </div>
              </div>
            </div>
            <Button
              disabled={cartItems.length === 0 || loading} // 禁用提交按钮
              onClick={handlePayment}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-400"
            >
              {loading ? "loading..." : "Checkout"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
