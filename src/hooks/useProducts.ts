import { useState, useEffect } from 'react';

export interface Product {
  id: number;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  unitExpense?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  type: 'product' | 'raffle';
  prize?: string;
  prizeImageUrl?: string;
  ticketNumbers?: number[];
  totalTickets?: number;
  soldTickets?: number;
  status: 'active' | 'inactive' | 'completed';
  target?: number;
  currentAmount?: number;
  imageUrl?: string;
}

const STORAGE_KEY = 'admin_products';

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // Carrega produtos do localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedProducts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const validProducts = storedProducts.map((product: Product) => ({
          ...product,
          quantity: Number(product.quantity) || 0,
          total: Number(product.total) || 0,
          type: product.type || 'product',
          status: product.status || 'active',
          soldTickets: Number(product.soldTickets) || 0,
          currentAmount: Number(product.currentAmount) || 0,
          unitPrice: Number(product.unitPrice) || 0
        }));
        setProducts(validProducts);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setProducts([]);
    }
  }, []);

  // Salva produtos no localStorage
  useEffect(() => {
    try {
      if (products.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      }
    } catch (error) {
      console.error('Erro ao salvar produtos:', error);
    }
  }, [products]);

  const validateProduct = (product: Product): boolean => {
    if (!product.product?.trim()) {
      throw new Error('O nome do produto/rifa é obrigatório');
    }

    if (product.type === 'product') {
      if (product.quantity <= 0) {
        throw new Error('A quantidade deve ser maior que zero');
      }
    } else if (product.type === 'raffle') {
      if (!product.prize?.trim()) {
        throw new Error('O prêmio da rifa é obrigatório');
      }
      if (!product.totalTickets || product.totalTickets <= 0) {
        throw new Error('O número total de bilhetes deve ser maior que zero');
      }
    }

    if (product.unitPrice <= 0) {
      throw new Error('O preço unitário deve ser maior que zero');
    }

    return true;
  };

  const saveProducts = (newProducts: Product[]) => {
    try {
      const validatedProducts = newProducts.map(product => ({
        ...product,
        quantity: Number(product.quantity) || 0,
        total: Number(product.total) || 0,
        type: product.type || 'product',
        status: product.status || 'active',
        soldTickets: Number(product.soldTickets) || 0,
        currentAmount: Number(product.currentAmount) || 0,
        unitPrice: Number(product.unitPrice) || 0
      }));
      setProducts(validatedProducts);
    } catch (error) {
      console.error('Erro ao salvar produtos:', error);
      throw error;
    }
  };

  const getTotalTicketsSold = (): number => {
    return products
      .filter(product => product.type === 'raffle')
      .reduce((acc, product) => acc + (Number(product.soldTickets) || 0), 0);
  };

  const getTotalRaffleRevenue = (): number => {
    return products
      .filter(product => product.type === 'raffle')
      .reduce((acc, product) => acc + (Number(product.currentAmount) || 0), 0);
  };

  return {
    products,
    saveProducts,
    validateProduct,
    getTotalTicketsSold,
    getTotalRaffleRevenue
  };
};

export default useProducts;