"use client";
import React, { useEffect, useState } from "react";
import { useCustomer } from "@/app/lib/hooks/useCustomer";
import { PartnerType } from "@/app/lib/types";
import QrcodePage from "@/app/components/Qrcode";

const Partners = () => {
  const { customer } = useCustomer();
  if (customer.is_partner === false) return null;
  const [partner, setPartner] = useState<PartnerType | null>(null);
  const getPartner = async () => {
    try {
      const res = await fetch(`/api/web/partners/${customer.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setPartner(data);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  // console.log(partner);

  useEffect(() => {
    if (customer.id) {
      getPartner();
    }
  }, [customer.id]);

  return (
    <div className="w-full mx-auto px-2 md:px-12">
      {customer.is_partner === true && (
        <div>
          <div className="flex flex-col lg:flex lg:flex-row gap-12 h-[400]px p-4 rounded-lg my-6">
            <div>
              <div className="flex flex-col items-center gap-6">
                <div className="w-full md:w-[600px] text-sm md:text-xl">
                  <span className="text-md font-semibold text-blue-600">Congratulations on becoming a partner!</span>
                  <p className="text-sm">
                    Below is your promotional QR code and website referral link. Both the QR code and the referral link
                    serve the same purpose.Users invited through your referral link or QR code will earn you a
                    percentage of their transactions, which will be credited to your account. You can withdraw these
                    earnings or use them as discounts on future purchases.
                  </p>
                </div>
                <div className="flex flex-col">
                  <h1>Promotional QR Code:</h1>
                  <QrcodePage
                    url={`${window.location.href.split("/").slice(0, 3).join("/")}/web?ref=${partner?.code}`}
                  />
                </div>
                <div className="flex flex-col">
                  <h1>Promotional URL:</h1>
                  <div className="text-green-600">{`${window.location.href.split("/").slice(0, 3).join("/")}/web?ref=${
                    partner?.code
                  }`}</div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 flex-1 gap-6">
              <div className="text-gray-600 h-[200px] p-4 font-semibold shadow-lg rounded-lg flex flex-col justify-center items-center">
                <div className="text-3xl"> {partner?.customers?.length}</div>
                <p className="text-xs">Total Recommended</p>
              </div>
              <div className="text-gray-600 h-[200px] p-4 font-semibold shadow-lg rounded-lg flex flex-col justify-center items-center">
                <div className="text-3xl">
                  {/* 返回确认后的佣金总额 */}$
                  {partner?.customers?.reduce((acc, customer) => {
                    const customerTotal =
                      customer.Orders?.reduce(
                        (orderAcc, order) =>
                          orderAcc + (order.confirmed === 1 && order.commission ? order.commission : 0),
                        0
                      ) || 0;
                    return acc + customerTotal;
                  }, 0)}
                </div>
                <p className="text-xs">Commission Earned</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partners;
