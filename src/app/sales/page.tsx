"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  price: number;
  dateAdded: string; // New field for the date the product was added
  productionCost: number; // New field for the production cost
};

const products: Product[] = [
  { id: 1, name: 'Burger', price: 5.99, dateAdded: '2025-04-01', productionCost: 2.5 },
  { id: 2, name: 'Pizza', price: 8.99, dateAdded: '2025-04-10', productionCost: 4.0 },
  { id: 3, name: 'Soda', price: 1.99, dateAdded: '2025-04-15', productionCost: 0.5 },
];

export default function Compras() {
  const [cart, setCart] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, unitCost?: number) => {
    const productToAdd = { ...product, productionCost: unitCost ?? product.productionCost };
    setCart([...cart, productToAdd]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  return (
    <main className={`min-h-screen p-6 bg-gradient-to-r from-[var(--background)] to-[var(--background)] text-[var(--foreground)] dark:from-[var(--background-dark)] dark:to-[var(--background-dark)]`}>
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-[var(--background-light)] text-[var(--foreground)] rounded shadow-lg hover:bg-[var(--background-hover)] hover:shadow-xl transition-all"
      >
        Voltar
      </button>
      <h1 className="text-2xl font-bold mb-4 text-[var(--foreground)]">
        Protótipo de Vendas
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 rounded shadow bg-[var(--background)] text-[var(--foreground)] hover:shadow-lg transition-all"
          >
            <h2 className="text-lg font-bold text-[var(--foreground)]">{product.name}</h2>
            <p className="text-[var(--foreground)]">Preço: ${product.price.toFixed(2)}</p>
            <p className="text-[var(--foreground)]">Adicionado em: {product.dateAdded}</p>
            <p className="text-[var(--foreground)]">Custo de Produção: ${product.productionCost.toFixed(2)}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded shadow-lg hover:bg-[var(--secondary)] hover:shadow-xl transition-all"
            >
              Comprar Agora
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold text-[var(--foreground)]">Carrinho</h2>
        {cart.length === 0 ? (
          <p className="text-[var(--foreground)]">Seu carrinho está vazio.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center text-[var(--foreground)]">
                {item.name} - ${item.price.toFixed(2)}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 px-2 py-1 bg-[var(--secondary)] text-[var(--background)] rounded hover:bg-[var(--primary)]"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}