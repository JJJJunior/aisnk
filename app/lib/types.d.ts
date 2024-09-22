export interface JWTPlayloadType {
  user: number;
  username: string;
  role: string;
  expires: Date;
}

export interface LogType {
  user?: string;
  type?: string;
  info?: string;
  ip?: string;
  country_name?: string;
  city?: string;
}

export interface ParentType {
  id: number;
  name: string;
  collections?: CollectionType[];
}

export interface UserType {
  id: number;
  username: string;
  password: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface CollectionStatusType {
  id: number;
  status?: string;
}

export interface ProductCollectionType {
  collectionId?: number;
  collection?: CollectionType;
  productId?: number;
  product?: ProductType;
  assignedAt?: Date;
  assignedBy?: string;
  products?: ProductType[];
}

export interface CollectionType {
  id?: number;
  title?: string;
  order_index?: number;
  description?: string;
  status?: string;
  alias_title?: string | null;
  alias_description?: string | null;
  products?: ProductCollection[];
  images?: ImageType[];
  parent?: ParentType;
  parentId?: number | null | undefined;
  created_at?: Date; // ISO Date string
  updated_at?: Date; // ISO Date string
}

export interface ProductStatusType {
  id: number;
  status: string;
}

export interface ProductType {
  id?: number;
  title?: string;
  code?: string;
  description?: string;
  category?: string;
  tags?: string | null;
  status?: string | null | undefined;
  sizes?: string | null | undefined;
  colors?: string | null;
  price?: number | null;
  expense?: number | null;
  cost?: number | null;
  shipping?: number | null;
  commission?: number | null;
  discount?: number | null;
  size_image?: string | null;
  alias_title?: string | null;
  alias_description?: string | null;
  is_recommended?: number;
  created_at?: Date; // ISO Date string
  updated_at?: Date; // ISO Date string
  stock?: number | null;
  images?: ImageType[];
  productStatus?: ProductStatusType;
  collections?: ProductCollection[];
}

export interface ImageType {
  id: string; // UUID
  url: string; //
  order_index?: number | null; // 允许 null
  collectionId?: number | null;
  productId?: number | null;
}

export interface OrderStatusType {
  id: string; // UUID
  status?: string;
}
//购物车里的类型
export interface CartItemType {
  item: ProductType;
  quantity: number;
  color?: string;
  size?: string;
}
export interface OrderType {
  id: string; // UUID
  shippingRate?: string;
  totalAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  customer: CustomerType;
  commission?: number;
  confirmed?: number;
  partner?: string;
  customerId?: string;
  products: ProductsOnOderType[];
  status?: string;
}

export interface ProductsOnOderType {
  product: ProductType;
  productId: number;
  order: OrderType;
  orderId: string;
  title: string;
  color: string;
  size: string;
  currency: string;
  amountDiscount: number;
  amountSubtotal: number;
  amountTax: number;
  amountTotal: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistType {
  id: string; // UUID
  customer: CustomerType;
  product: ProductType;
  created_at: string; // ISO Date string
}

export interface ExchangeAndShippingType {
  id: number;
  code?: string;
  currency?: string;
  courtyName?: string;
  currencyCode?: string;
  exchangeRate?: number;
  shippingCodeInStripe?: string;
  englishCoutryName?: string;
  shippingCodeDesInStripe?: string;
  paymentTypeInStripe?: string;
  allowedCountries?: string;
}

export interface ShippingAddressType {
  id: string; // UUID
  streetNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  order: OrderType;
}

export interface DBIPType {
  ipAddress?: string;
  continentCode?: string;
  continentName?: string;
  countryCode?: string;
  countryName?: string;
  city?: string;
}

export interface CustomerType {
  id: string;
  username?: string;
  fullName?: string;
  name?: string;
  email_stripe?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: Date | null;
  lastSignInAt?: Date | null;
  referralCode?: string;
  referredById?: string;
  isRef?: number;
  cart?: Cart[];
}

export interface PartnerType {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  referralCode?: string;
  referredById?: string;
  refCount?: number;
  orderAmount?: number;
  isRef?: number;
}

export interface CartType {
  id?: number;
  quantity?: number;
  item?: ProductType;
  color?: string;
  size?: string;
}
export interface QAType {
  id: number;
  title: string;
  question: string;
  answer: string;
}

export interface SettingsType {
  is_fake?: number;
}
