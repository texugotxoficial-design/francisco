export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients?: string[];
  featured?: boolean;
  badge?: string;
  is_available?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  items: any[];
  total_price: number;
  status: 'pendente' | 'concluído' | 'cancelado';
  whatsapp_link: string;
}
