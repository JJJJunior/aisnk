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

export const SelectArea = () => {
  const [exchange, setExchange] = useState<ExchangeAndShippingType[]>([]);
  const [current, setCurrent] = useState<ExchangeAndShippingType | null>(null);

  const fetchExchangeAndShipping = async () => {
    try {
      const res = await axios.get("/api/exchange");
      setExchange(res.data.data);
    } catch (err) {
      // console.error(err);
    }
  };

  useEffect(() => {
    fetchExchangeAndShipping();

    // 从本地存储获取已选择的汇率
    const savedExchange = localStorage.getItem("selectedExchange");
    if (savedExchange) {
      try {
        setCurrent(JSON.parse(savedExchange));
      } catch (error) {
        setCurrent(null);
      }
    }
  }, []);

  useEffect(() => {
    // 如果本地没有存储汇率并且 exchange 数据已经加载完毕，选择美国的汇率作为默认值
    if (!localStorage.getItem("selectedExchange") && exchange.length > 0) {
      const defaultExchange = exchange.find((item) => item.courtyName === "美国");
      if (defaultExchange) {
        setCurrent(defaultExchange);
      }
    }
  }, [exchange]); // 只在 exchange 数据加载完成后运行

  const handleSelect = (value: string) => {
    if (!exchange) return;
    const selected = exchange.find((item) => item.id === Number(value)) || null;
    setCurrent(selected);
    window.location.reload();
  };

  useEffect(() => {
    // 保存选中的汇率到 localStorage
    if (current) {
      localStorage.setItem("selectedExchange", JSON.stringify(current));
    }
  }, [current]);

  return (
    <Select onValueChange={handleSelect} value={String(current?.id || "")}>
      <SelectTrigger className="w-[120px]">
        <SelectValue>
          {/* 如果 current 为空，显示占位符 */}
          {current?.id ? current.currencyCode : "Currency."}
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
