"use client";

import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'chart.js/auto';
import useProducts from '@/hooks/useProducts';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';

// Configurar as fontes do pdfmake
if (typeof window !== 'undefined') {
  (pdfMake as any).vfs = pdfFonts;
}

const StatisticsPage = () => {
  const { 
    products, 
    getTotalTicketsSold,
    getTotalRaffleRevenue
  } = useProducts();
  
  const router = useRouter();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleProductSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = parseInt(e.target.value, 10);
    setSelectedProductId(productId || null);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const exportToPDF = () => {
    try {
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        header: {
          text: 'Relatório de Estatísticas de Vendas e Rifas',
          alignment: 'center',
          fontSize: 18,
          margin: [0, 20, 0, 20],
          color: '#2c3e50'
        },
        footer: {
          text: 'Gerado em ' + new Date().toLocaleDateString(),
          alignment: 'center',
          fontSize: 10,
          margin: [0, 20, 0, 0],
          color: '#7f8c8d'
        },
        content: [
          {
            text: 'Resumo Geral',
            style: 'sectionHeader',
            margin: [0, 0, 0, 10]
          },
          {
            table: {
              widths: ['*', 'auto'],
              body: [
                [
                  { text: 'Total de Produtos', style: 'totalLabel' },
                  { text: products.filter(p => p.type === 'product').length.toString(), style: 'totalValue' }
                ],
                [
                  { text: 'Total de Rifas', style: 'totalLabel' },
                  { text: products.filter(p => p.type === 'raffle').length.toString(), style: 'totalValue' }
                ],
                [
                  { text: 'Total de Vendas (Produtos)', style: 'totalLabel' },
                  { text: products.reduce((acc, p) => acc + (p.soldTickets || 0), 0).toString(), style: 'totalValue' }
                ],
                [
                  { text: 'Total de Bilhetes Vendidos', style: 'totalLabel' },
                  { text: getTotalTicketsSold().toString(), style: 'totalValue' }
                ],
                [
                  { text: 'Valor Total Bruto (Produtos)', style: 'totalLabel' },
                  { text: `R$ ${products.filter(p => p.type === 'product').reduce((acc, p) => acc + p.total, 0).toFixed(2)}`, style: 'totalValue' }
                ],
                [
                  { text: 'Valor Total Arrecadado (Rifas)', style: 'totalLabel' },
                  { text: `R$ ${getTotalRaffleRevenue().toFixed(2)}`, style: 'totalValue' }
                ]
              ]
            },
            layout: {
              fillColor: function(rowIndex: number) {
                return rowIndex % 2 === 0 ? '#f8f9fa' : null;
              },
              hLineWidth: function() {
                return 1;
              },
              vLineWidth: function() {
                return 1;
              },
              hLineColor: function() {
                return '#dee2e6';
              },
              vLineColor: function() {
                return '#dee2e6';
              },
              paddingLeft: function() {
                return 8;
              },
              paddingRight: function() {
                return 8;
              },
              paddingTop: function() {
                return 6;
              },
              paddingBottom: function() {
                return 6;
              }
            }
          },
          {
            text: 'Produtos',
            style: 'sectionHeader',
            margin: [0, 20, 0, 10]
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Produto', style: 'tableHeader' },
                  { text: 'Quantidade Total', style: 'tableHeader' },
                  { text: 'Vendido', style: 'tableHeader' },
                  { text: 'Em Estoque', style: 'tableHeader' },
                  { text: 'Valor Bruto', style: 'tableHeader' },
                  { text: 'Valor Líquido', style: 'tableHeader' }
                ],
                ...products.filter(p => p.type === 'product').map(product => [
                  { text: product.product, style: 'tableCell' },
                  { text: product.quantity.toString(), style: 'tableCell' },
                  { text: (product.soldTickets || 0).toString(), style: 'tableCell' },
                  { text: (product.quantity - (product.soldTickets || 0)).toString(), style: 'tableCell' },
                  { text: `R$ ${product.total.toFixed(2)}`, style: 'tableCell' },
                  { text: `R$ ${(product.total - (parseFloat(product.unitExpense || '0') * product.quantity)).toFixed(2)}`, style: 'tableCell' }
                ])
              ]
            },
            layout: {
              fillColor: function(rowIndex: number) {
                return rowIndex === 0 ? '#f8f9fa' : null;
              },
              hLineWidth: function(i: number) {
                return i === 0 || i === 1 ? 2 : 1;
              },
              vLineWidth: function() {
                return 1;
              },
              hLineColor: function() {
                return '#dee2e6';
              },
              vLineColor: function() {
                return '#dee2e6';
              },
              paddingLeft: function() {
                return 8;
              },
              paddingRight: function() {
                return 8;
              },
              paddingTop: function() {
                return 6;
              },
              paddingBottom: function() {
                return 6;
              }
            }
          },
          {
            text: 'Rifas',
            style: 'sectionHeader',
            margin: [0, 20, 0, 10]
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Rifa', style: 'tableHeader' },
                  { text: 'Prêmio', style: 'tableHeader' },
                  { text: 'Total de Bilhetes', style: 'tableHeader' },
                  { text: 'Bilhetes Vendidos', style: 'tableHeader' },
                  { text: 'Meta', style: 'tableHeader' },
                  { text: 'Arrecadado', style: 'tableHeader' }
                ],
                ...products.filter(p => p.type === 'raffle').map(raffle => [
                  { text: raffle.product, style: 'tableCell' },
                  { text: raffle.prize || '-', style: 'tableCell' },
                  { text: (raffle.totalTickets || 0).toString(), style: 'tableCell' },
                  { text: (raffle.soldTickets || 0).toString(), style: 'tableCell' },
                  { text: `R$ ${(raffle.target || 0).toFixed(2)}`, style: 'tableCell' },
                  { text: `R$ ${(raffle.currentAmount || 0).toFixed(2)}`, style: 'tableCell' }
                ])
              ]
            },
            layout: {
              fillColor: function(rowIndex: number) {
                return rowIndex === 0 ? '#f8f9fa' : null;
              },
              hLineWidth: function(i: number) {
                return i === 0 || i === 1 ? 2 : 1;
              },
              vLineWidth: function() {
                return 1;
              },
              hLineColor: function() {
                return '#dee2e6';
              },
              vLineColor: function() {
                return '#dee2e6';
              },
              paddingLeft: function() {
                return 8;
              },
              paddingRight: function() {
                return 8;
              },
              paddingTop: function() {
                return 6;
              },
              paddingBottom: function() {
                return 6;
              }
            }
          }
        ],
        styles: {
          sectionHeader: {
            fontSize: 14,
            bold: true,
            color: '#2c3e50',
            margin: [0, 10, 0, 5]
          },
          tableHeader: {
            bold: true,
            fontSize: 10,
            color: '#2c3e50',
            fillColor: '#f8f9fa'
          },
          tableCell: {
            fontSize: 10,
            color: '#2c3e50'
          },
          totalLabel: {
            fontSize: 10,
            bold: true,
            color: '#2c3e50'
          },
          totalValue: {
            fontSize: 10,
            color: '#2c3e50',
            alignment: 'right'
          }
        },
        defaultStyle: {
          font: 'Roboto'
        }
      } as any;

      pdfMake.createPdf(docDefinition).download('estatisticas_vendas_rifas.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    }
  };

  const exportToSpreadsheet = () => {
    const productRows = products
      .filter(p => p.type === 'product')
      .map((product) => [
        product.product,
        product.quantity,
        product.soldTickets || 0,
        product.quantity - (product.soldTickets || 0),
        product.total.toFixed(2),
        (product.total - (parseFloat(product.unitExpense || '0') * product.quantity)).toFixed(2),
      ]);

    const raffleRows = products
      .filter(p => p.type === 'raffle')
      .map((raffle) => [
        raffle.product,
        raffle.prize || '-',
        raffle.totalTickets || 0,
        raffle.soldTickets || 0,
        (raffle.target || 0).toFixed(2),
        (raffle.currentAmount || 0).toFixed(2),
      ]);

    const csvContent = [
      ['=== PRODUTOS ==='],
      ['Nome do Produto', 'Quantidade Total', 'Vendido', 'Em Estoque', 'Valor Bruto', 'Valor Líquido'],
      ...productRows,
      [''],
      ['=== RIFAS ==='],
      ['Nome da Rifa', 'Prêmio', 'Total de Bilhetes', 'Bilhetes Vendidos', 'Meta', 'Arrecadado'],
      ...raffleRows,
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'estatisticas_vendas_rifas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(product => {
    if (selectedProductId && product.id !== selectedProductId) return false;
    if (selectedStatus !== 'all' && product.status !== selectedStatus) return false;
    return true;
  });

  const chartData = {
    labels: filteredProducts.map((product) => product.product),
    datasets: [
      {
        label: 'Quantidade Vendida',
        data: filteredProducts.map((product) => product.type === 'product' ? product.quantity : product.soldTickets || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Valor Bruto/Arrecadado',
        data: filteredProducts.map((product) => product.type === 'product' ? product.total : product.currentAmount || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      }
    ],
  };

  const typeDistributionData = {
    labels: ['Produtos', 'Rifas'],
    datasets: [
      {
        data: [
          products.filter(p => p.type === 'product').length,
          products.filter(p => p.type === 'raffle').length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
      },
    ],
  };

  const statusDistributionData = {
    labels: ['Ativos', 'Inativos', 'Concluídos'],
    datasets: [
      {
        data: [
          products.filter(p => p.status === 'active').length,
          products.filter(p => p.status === 'inactive').length,
          products.filter(p => p.status === 'completed').length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-r from-[var(--background)] to-[var(--background-light)]">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => router.back()}
          className="btn btn-primary"
        >
          Voltar
        </Button>
        <Button
          onClick={exportToPDF}
          className="btn btn-secondary"
        >
          Gerar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Estatísticas de Produtos</h2>
          <div className="space-y-4">
            <div className="p-4 border border-[var(--border)] rounded-lg">
              <h3 className="font-semibold text-[var(--foreground)]">Total de Produtos</h3>
              <p className="text-2xl font-bold text-[var(--primary)]">{products.filter(p => p.type === 'product').length}</p>
            </div>
            <div className="p-4 border border-[var(--border)] rounded-lg">
              <h3 className="font-semibold text-[var(--foreground)]">Total Vendido</h3>
              <p className="text-2xl font-bold text-[var(--primary)]">R${products.reduce((acc, p) => acc + (p.soldTickets || 0), 0).toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="p-4 border border-[var(--border)] rounded-lg">
              <h3 className="font-semibold text-[var(--foreground)]">Lucro Total</h3>
              <p className="text-2xl font-bold text-[var(--primary)]">R${products.filter(p => p.type === 'product').reduce((acc, p) => acc + p.total, 0).toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Estatísticas de Rifas</h2>
          <div className="space-y-4">
            <div className="p-4 border border-[var(--border)] rounded-lg">
              <h3 className="font-semibold text-[var(--foreground)]">Total de Rifas</h3>
              <p className="text-2xl font-bold text-[var(--primary)]">{products.filter(p => p.type === 'raffle').length}</p>
            </div>
            <div className="p-4 border border-[var(--border)] rounded-lg">
              <h3 className="font-semibold text-[var(--foreground)]">Total de Bilhetes Vendidos</h3>
              <p className="text-2xl font-bold text-[var(--primary)]">{getTotalTicketsSold()}</p>
            </div>
            <div className="p-4 border border-[var(--border)] rounded-lg">
              <h3 className="font-semibold text-[var(--foreground)]">Receita Total das Rifas</h3>
              <p className="text-2xl font-bold text-[var(--primary)]">R${getTotalRaffleRevenue().toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Distribuição de Itens</h2>
          <div className="h-64">
            <Pie data={chartData} options={{ plugins: { legend: { labels: { color: 'black' } } } }} />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Status dos Itens</h2>
          <div className="h-64">
            <Pie data={statusDistributionData} options={{ plugins: { legend: { labels: { color: 'black' } } } }} />
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 bg-white shadow-md rounded-lg p-4 flex justify-between mt-8">
        <button
          onClick={exportToSpreadsheet}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Exportar para Planilha
        </button>
      </div>
    </main>
  );
};

export default StatisticsPage;