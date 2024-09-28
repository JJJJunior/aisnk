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
    username: "",
    email_stripe: "",
    email: "",
    firstName: "",
    lastName: "",
    is_partner: 0,
    name: "",
    createdAt: null,
    lastSignInAt: null,
    phone: "",
    Orders: [],
  },

  // 更新整个 customer 对象
  addCustomerInfo: (customer: CustomerType) =>
    set((state) => ({
      customer: {
        id: customer.id,
        username: customer.username,
        email_stripe: customer.email_stripe,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        is_partner: customer.is_partner,
        name: customer.name,
        createdAt: customer.createdAt,
        lastSignInAt: customer.lastSignInAt,
        phone: customer.phone,
        Orders: customer.Orders,
      },
    })),

  // 返回整个 customer 对象
  customerInfo: () => get().customer,

  // 清空 customer 信息
  removeCustomerInfo: () => set({ customer: undefined }),
}));
