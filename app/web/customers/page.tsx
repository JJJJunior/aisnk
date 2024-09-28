"use client";
import Loader from "@/app/components/Loader";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatToLocalTime } from "@/app/lib/localDate";
import { OrderStateZHEN } from "@/app/lib/orders";
import { useCustomer } from "@/app/lib/hooks/useCustomer";

const Customers = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userId } = useAuth();
  const { customer } = useCustomer();

  useEffect(() => {
    if (userId) {
      setLoading(false);
    }
  }, [userId]);

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
    <div className="mx-4 h-full mt-6 md:mx-16 md:mt-12">
      <div className="p-4 text-xs h-auto w-full md:h-auto shadow-lg rounded-lg text-gray-600 mb-6">
        <div className="font-semibold text-gray-600">Your Purchase Orders:</div>
        <div>
          {customer.Orders &&
            customer.Orders.length > 0 &&
            customer.Orders.map((order) => (
              <div className="rounded-lg h-auto my-2 border-b" key={order.id}>
                <div className="text-xs flex gap-4">
                  <div className="font-semibold text-gray-600">Order ID:</div>
                  <div>{order.id}</div>
                  <div className="font-semibold text-gray-600">Total：$ {order.totalAmount}</div>
                  <div className="font-semibold text-gray-600">Time: {formatToLocalTime(order.createdAt)}</div>
                  <div className="font-semibold text-green-500">
                    Status: {OrderStateZHEN(order.status ? order.status : "")}
                  </div>
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
                          src={`/api/images?file=${
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
    </div>
  );
};

export default Customers;
