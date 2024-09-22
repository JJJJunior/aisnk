"use client";
import Loader from "@/app/components/Loader";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { CustomerType, OrderType } from "@/app/lib/types";
import QrcodePage from "@/app/components/Qrcode";
import Image from "next/image";

const Customers = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const [referralsCount, setReferralsCount] = useState(0);
  const [myOrders, setMyOrders] = useState<OrderType[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      setLoading(false);
      getCustomer();
      getReferesCount();
    }
  }, [userId]);

  const getCustomer = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/api/web/customers/${userId}`);
      if (res.status === 200) {
        setCustomer(res.data.data);
      }
    } catch (err) {
      //   console.log(err);
    }
  };

  const getMyOrders = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/api/web/customers/${userId}/orders`);
      if (res.status === 200) {
        setMyOrders(res.data.data);
      }
    } catch (err) {
      //   console.log(err);
    }
  };
  console.log(myOrders);
  useEffect(() => {
    getMyOrders();
  }, []);

  const getReferesCount = async () => {
    try {
      if (!useId) return;
      const res = await axios.get(`/api/web/customers/${useId}/referrals/`);
      if (res.status === 200) {
        setReferralsCount(res.data.data);
      }
    } catch (err) {
      //   console.log(err);
    }
  };

  if (!useId) {
    return (
      <div className="flex gap-6 h-96 justify-center items-center">
        <div className="text-xl">Please login to visit the user page.</div>
        <Button onClick={() => router.push("/web/sign-in")}>Login</Button>
      </div>
    );
  }
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-4 mt-6 md:mx-16 md:mt-12">
      <div className="p-4 text-xs h-auto w-full md:h-auto shadow-lg rounded-lg text-gray-600 mb-6">
        <div className="font-semibold text-gray-600">Your Purchase Orders:</div>
        <div>
          {myOrders &&
            myOrders.length > 0 &&
            myOrders.map((order) => (
              <div className="rounded-lg h-auto my-2 border-b" key={order.id}>
                <div className="text-xs flex gap-4">
                  <div className="font-semibold text-gray-600">Order ID:</div>
                  <div>{order.id}</div>
                  <div className="font-semibold text-gray-600">Total：$ {order.totalAmount}</div>
                  <div className="font-semibold text-gray-600">Time: {order.createdAt}/</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4">
                  {order.products &&
                    order.products.length > 0 &&
                    order.products.map((productOnOrder, index) => (
                      <div key={index} className="flex gap-4">
                        <Image
                          alt="pic"
                          width={50}
                          height={50}
                          src={`${process.env.NEXT_PUBLIC_IMAGE_SERVER}${
                            productOnOrder.product.images && productOnOrder.product.images[0].url
                          }`}
                        />
                        <div className="flex flex-col gap-2">
                          <div className="w-[200px]">{productOnOrder.title}</div>
                          <div className="flex gap-2">
                            <div>x {productOnOrder.quantity}</div>
                            <div>{productOnOrder.color}</div>
                            <div>{(productOnOrder.amountSubtotal / 100).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      {customer?.isRef && (
        <div className="flex flex-col lg:flex lg:flex-row gap-12 h-[400]px p-4 shadow-lg rounded-lg my-6">
          <div>
            <div className="flex flex-col items-center gap-6">
              <div className="w-full md:w-[600px] text-sm md:text-xl">
                <span className="text-md font-semibold text-blue-600">Congratulations on becoming a partner!</span>
                <p className="text-sm">
                  Below is your promotional QR code and website referral link. Both the QR code and the referral link
                  serve the same purpose.Users invited through your referral link or QR code will earn you a percentage
                  of their transactions, which will be credited to your account. You can withdraw these earnings or use
                  them as discounts on future purchases.
                </p>
              </div>
              <div className="flex flex-col">
                <h1>Promotional QR Code:</h1>
                <QrcodePage
                  url={`${window.location.href.split("/").slice(0, 3).join("/")}/web?ref=${customer.referralCode}`}
                />
              </div>
              <div className="flex flex-col">
                <h1>Promotional URL:</h1>
                <div className="text-green-600">{`${window.location.href.split("/").slice(0, 3).join("/")}/web?ref=${
                  customer.referralCode
                }`}</div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 flex-1 gap-6">
            <div className="text-gray-600 h-[200px] p-4 font-semibold shadow-lg rounded-lg flex flex-col justify-center items-center">
              <div className="text-3xl"> {referralsCount}</div>
              <p className="text-xs">Total Recommended</p>
            </div>
            <div className="text-gray-600 h-[200px] p-4 font-semibold shadow-lg rounded-lg flex flex-col justify-center items-center">
              <div className="text-3xl"> $ 0</div>
              <p className="text-xs">Orders Facilitated</p>
            </div>
            <div className="text-gray-600 h-[200px] p-4 font-semibold shadow-lg rounded-lg flex flex-col justify-center items-center">
              <div className="text-3xl"> $ 0</div>
              <p className="text-xs">Commission Earned</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
