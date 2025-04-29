"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const BarChart = dynamic(() => import('./BarChart'), { ssr: false });
const PieChart = dynamic(() => import('./PieChart'), { ssr: false });

export default function Statistics() {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch products from localStorage or an API
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  const handleChartTypeChange = (type: 'bar' | 'pie') => {
    setChartType(type);
  };

  const handleProductSelection = (product: string) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-r from-[var(--background)] to-[var(--background)] text-[var(--foreground)] dark:from-[var(--background-dark)] dark:to-[var(--background-dark)]">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-[var(--background-light)] text-[var(--foreground)] rounded shadow-lg hover:bg-[var(--background-hover)] hover:shadow-xl transition-all"
      >
        Voltar
      </button>
      <h1 className="text-2xl font-bold mb-4 text-[var(--foreground)]">Estatísticas em Tempo Real</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Selecione os produtos:</h2>
        <div className="flex flex-wrap gap-2">
          {products.map((product) => (
            <button
              key={product}
              onClick={() => handleProductSelection(product)}
              className={`px-4 py-2 rounded ${selectedProducts.includes(product) ? 'bg-[var(--primary)] text-[var(--background)]' : 'bg-[var(--background-light)] text-[var(--foreground)]'} hover:bg-[var(--secondary)] transition`}
            >
              {product}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => handleChartTypeChange('bar')}
          className={`px-4 py-2 rounded ${chartType === 'bar' ? 'bg-[var(--primary)] text-[var(--background)]' : 'bg-[var(--background-light)] text-[var(--foreground)]'} hover:bg-[var(--secondary)] transition`}
        >
          Gráfico de Barras
        </button>
        <button
          onClick={() => handleChartTypeChange('pie')}
          className={`px-4 py-2 rounded ${chartType === 'pie' ? 'bg-[var(--primary)] text-[var(--background)]' : 'bg-[var(--background-light)] text-[var(--foreground)]'} hover:bg-[var(--secondary)] transition`}
        >
          Gráfico de Pizza
        </button>
      </div>

      <div className="chart-container">
        {selectedProducts.length > 0 ? (
          chartType === 'bar' ? <BarChart selectedProducts={selectedProducts} /> : <PieChart selectedProducts={selectedProducts} />
        ) : (
          <p className="text-center text-[var(--foreground)]">Selecione pelo menos um produto para visualizar as estatísticas.</p>
        )}
      </div>
    </main>
  );
}