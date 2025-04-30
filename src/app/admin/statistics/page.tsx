"use client";

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import 'chart.js/auto';

interface Product {
  product: string;
  quantity: number;
  total: number;
}

const StatisticsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const validProducts = storedProducts.map((product: Product) => ({
      ...product,
      quantity: product.quantity || 0,
      total: product.total || 0,
    }));
    setProducts(validProducts);
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Estatísticas de Produtos', 10, 10);

    let y = 20;
    products.forEach((product, index) => {
      doc.text(`${index + 1}. Produto: ${product.product}, Quantidade: ${product.quantity}, Receita: R$${product.total}`, 10, y);
      y += 10;
    });

    doc.save('estatisticas.pdf');
  };

  const chartData = {
    labels: products.map((product) => product.product),
    datasets: [
      {
        label: 'Quantidade Vendida',
        data: products.map((product) => product.quantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Receita Total',
        data: products.map((product) => product.total),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Estatísticas de Produtos</h1>
      <div className="mb-6">
        <Bar data={chartData} />
      </div>
      <button
        onClick={exportToPDF}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Exportar para PDF
      </button>
    </div>
  );
};

export default StatisticsPage;