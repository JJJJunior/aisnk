import { nanoid } from "nanoid";

export const OrderStateZHEN = (status: string) => {
  if (status === "待支付") return "Pending";
  if (status === "已支付") return "Paid";
  if (status === "处理中") return "Processing";
  if (status === "已发货") return "Shipped";
  if (status === "已送达") return "Delivered";
  if (status === "已发货") return "Shipped";
  if (status === "已取消") return "Cancelled";
  if (status === "退货处理中") return "Return Processing";
  if (status === "已退货") return "Returned";
  if (status === "已退款") return "Refunded";
  if (status === "失败") return "Failed";
  return "Null";
};

// 创建自定义订单 ID 生成方法
export function generateOrderId() {
  // 获取当前时间并格式化为 'YYYYMMDDHHmm'
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  // 生成订单 ID，格式为 'YYYYMMDDHHmm+nanoid(6)'
  const orderId = `${year}${month}${day}${hours}${minutes}${nanoid(6)}`;

  return orderId;
}
