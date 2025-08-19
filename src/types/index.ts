
export interface Product {
  id: string;
  name: string;
  isOutOfStock: boolean;
  imageUrl: string;
}

export interface Customer {
  name:string;
  phone: string;
  email: string;
}

export interface OrderDetails {
  category: string;
  quantity: number;
  status: 'pending' | 'accepted';
  timestamp: string;
}

export interface Order {
  id: string;
  customer: Customer;
  order: OrderDetails;
  lastReminderSent?: string;
}

export interface Subscriber {
  id: string;
  name: string;
  phone: string;
  email: string;
  timestamp: string;
}
