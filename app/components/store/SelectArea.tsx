"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { ExchangeAndShippingType } from "@/app/lib/types";
import Image from "next/image";
import { useExchangeAndShipping } from "@/app/lib/hooks/useExchangeRate";

export const SelectArea = () => {
  const [exchange, setExchange] = useState<ExchangeAndShippingType[]>([]);
  const { exchangeAndShipping, addExchangeAndShipping } = useExchangeAndShipping();

  //初始化默认显示的汇率
  const fetchExchangeAndShipping = async () => {
    try {
      const res = await axios.get("/api/exchange");
      setExchange(res.data.data);
      addExchangeAndShipping(res.data.data.find((item: ExchangeAndShippingType) => item.courtryName === "default"));
    } catch (err) {
      // console.error(err);
    }
  };

  // console.log(exchangeAndShipping);

  useEffect(() => {
    fetchExchangeAndShipping();
  }, []);

  const handleSelect = (value: string) => {
    if (!exchange) return;
    const selected = exchange.find((item) => item.id === Number(value));
    if (!selected) return;
    addExchangeAndShipping(selected);
  };

  return (
    <Select onValueChange={handleSelect} value={String(exchangeAndShipping?.id || "")}>
      <SelectTrigger className="w-[120px]">
        <SelectValue>
          {/* 如果 current 为空，显示占位符 */}
          {exchangeAndShipping?.id ? exchangeAndShipping.currencyCode : "Currency."}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel></SelectLabel>
          {exchange &&
            exchange.length > 0 &&
            exchange.map((item) => (
              <SelectItem value={String(item.id)} key={item.id}>
                <div className="flex gap-4 justify-center items-center">
                  <div>{item.currencyCode}</div>
                  <Image
                    height={20}
                    width={30}
                    src={`/${item.code}.png`}
                    alt={item.currencyCode ? item.currencyCode : "pic"}
                  />
                </div>
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
