import { create } from "zustand";
import { CustomerType } from "../types";

type CustomerStore = {
  customer: CustomerType;
  addCustomerInfo: (partner: CustomerType) => void;
  customerInfo: () => CustomerType;
  removeCustomerInfo: () => void;
};

export const useCustomer = create<CustomerStore>((set, get) => ({
  customer: {
    id: "",
    isRef: 0,
    username: "",
    referralCode: "",
    email: "",
    fullName: "",
    lastName: "",
    firstName: "",
  },

  // 更新整个 customer 对象
  addCustomerInfo: (customer: CustomerType) =>
    set((state) => ({
      customer: {
        id: customer.id,
        isRef: customer.isRef,
        username: customer.username,
        referralCode: customer.referralCode,
        email: customer.email,
        fullName: customer.fullName,
        lastName: customer.lastName,
        firstName: customer.firstName,
      },
    })),

  // 返回整个 customer 对象
  customerInfo: () => get().customer,

  // 清空 customer 信息
  removeCustomerInfo: () => set({ customer: undefined }),
}));
