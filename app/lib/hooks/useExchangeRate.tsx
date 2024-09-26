import { create } from "zustand";
import { ExchangeAndShippingType } from "../types";

type ExchangeAndShippingStore = {
  exchangeAndShipping: ExchangeAndShippingType;
  addExchangeAndShipping: (shipping: ExchangeAndShippingType) => void;
  exchangeShippingInfo: () => ExchangeAndShippingType;
  removeExchangeAndShipping: () => void;
};

export const useExchangeAndShipping = create<ExchangeAndShippingStore>((set, get) => ({
  exchangeAndShipping: {
    id: 0,
    code: "",
    currency: "",
    courtryName: "",
    currencyCode: "",
    exchangeRate: 0,
    shippingCodeInStripe: "",
    englishCoutryName: "",
    shippingCodeDesInStripe: "",
    paymentTypeInStripe: "",
    allowedCountries: "",
    toUSDRate: 0,
  },
  addExchangeAndShipping: (shipping: ExchangeAndShippingType) =>
    set((state) => ({
      exchangeAndShipping: {
        id: shipping.id,
        code: shipping.code,
        currency: shipping.currency,
        courtyName: shipping.courtryName,
        currencyCode: shipping.currencyCode,
        exchangeRate: shipping.exchangeRate,
        shippingCodeInStripe: shipping.shippingCodeInStripe,
        englishCoutryName: shipping.englishCoutryName,
        shippingCodeDesInStripe: shipping.shippingCodeDesInStripe,
        paymentTypeInStripe: shipping.paymentTypeInStripe,
        allowedCountries: shipping.allowedCountries,
        toUSDRate: shipping.toUSDRate,
      },
    })),
  exchangeShippingInfo: () => get().exchangeAndShipping,
  removeExchangeAndShipping: () => set({ exchangeAndShipping: undefined }),
}));
