"use client";

import useProducts, { Product } from '@/hooks/useProducts';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/Button";

const SalesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { products, saveProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityToSell, setQuantityToSell] = useState(0);
  const [selectedTicketNumbers, setSelectedTicketNumbers] = useState<number[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Record<number, number>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showTicketNumbers, setShowTicketNumbers] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSellProduct = () => {
    try {
      if (!selectedProduct) {
        throw new Error('Selecione um produto ou rifa!');
      }

      if (selectedProduct.type === 'product') {
        if (quantityToSell <= 0) {
          throw new Error('Insira uma quantidade válida!');
        }

        if (selectedProduct.quantity < quantityToSell) {
          throw new Error('Quantidade insuficiente em estoque!');
        }

        const updatedProducts = products.map((product) => {
          if (product.id === selectedProduct.id) {
            return {
              ...product,
              quantity: product.quantity - quantityToSell,
              sold: (product.sold || 0) + quantityToSell,
            };
          }
          return product;
        });

        saveProducts(updatedProducts);
        setSelectedProduct(null);
        setQuantityToSell(0);
        setSelectedProducts({});
        setSelectedTicketNumbers([]);
        setShowAlert(true);
        setAlertType('alert-success');
        setAlertMessage('Venda realizada com sucesso!');
      } else {
        if (selectedTicketNumbers.length === 0) {
          throw new Error('Selecione pelo menos um número de bilhete!');
        }

        if (selectedProduct.totalTickets && selectedProduct.soldTickets && 
            selectedProduct.soldTickets + selectedTicketNumbers.length > selectedProduct.totalTickets) {
          throw new Error('Quantidade de bilhetes excede o total disponível!');
        }

        const updatedProducts = products.map((product) => {
          if (product.id === selectedProduct.id) {
            const newSoldTickets = (product.soldTickets || 0) + selectedTicketNumbers.length;
            const newCurrentAmount = (product.currentAmount || 0) + (selectedTicketNumbers.length * product.unitPrice);
            const newStatus = newSoldTickets === product.totalTickets ? 'completed' : product.status;
            
            return {
              ...product,
              soldTickets: newSoldTickets,
              currentAmount: newCurrentAmount,
              status: newStatus,
              ticketNumbers: [...(product.ticketNumbers || []), ...selectedTicketNumbers]
            };
          }
          return product;
        });

        saveProducts(updatedProducts);
        setSelectedProduct(null);
        setSelectedTicketNumbers([]);
        setSelectedProducts({});
        setShowAlert(true);
        setAlertType('alert-success');
        setAlertMessage('Venda de bilhetes realizada com sucesso!');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao realizar venda');
      setShowAlert(true);
      setAlertType('alert-danger');
      setAlertMessage(error instanceof Error ? error.message : 'Erro ao realizar venda');
    }
  };

  const handleProductSelect = (productId: number, quantity: number) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const handleTicketNumberSelect = (number: number) => {
    setSelectedTicketNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      }
      return [...prev, number];
    });
  };

  const formatCurrency = (value: number): string => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
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
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Produtos Disponíveis</h2>
          <div className="space-y-4">
            {products
              .filter((item) => item.type === 'product' && item.status === 'active')
              .map((item) => (
                <div key={item.id} className="p-4 border border-[var(--border)] rounded-lg">
                  <div className="flex items-start space-x-4">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.product}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        🛍️
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--foreground)]">{item.product}</h3>
                      <p className="text-[var(--foreground)]">Quantidade em Estoque: {item.quantity}</p>
                      <p className="text-[var(--foreground)]">Preço Unitário: {formatCurrency(item.unitPrice)}</p>
                      <div className="mt-2">
                        <label className="block text-sm text-[var(--foreground)]">Quantidade:</label>
                        <input
                          type="number"
                          min="1"
                          max={item.quantity}
                          value={selectedProducts[item.id] || ''}
                          onChange={(e) => handleProductSelect(item.id, parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Rifas Disponíveis</h2>
          <div className="space-y-4">
            {products
              .filter((item) => item.type === 'raffle' && item.status === 'active')
              .map((item) => (
                <div key={item.id} className="p-4 border border-[var(--border)] rounded-lg">
                  <div className="flex items-start space-x-4">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.product}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        🎟️
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--foreground)]">{item.product}</h3>
                      <p className="text-[var(--foreground)]">Prêmio: {item.prize}</p>
                      <p className="text-[var(--foreground)]">Preço do Bilhete: {formatCurrency(item.unitPrice)}</p>
                      <p className="text-[var(--foreground)]">
                        Bilhetes Disponíveis: {(item.totalTickets || 0) - (item.soldTickets || 0)}
                      </p>
                      <div className="mt-2">
                        <Button
                          onClick={() => setShowTicketNumbers(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className="btn btn-secondary"
                        >
                          {showTicketNumbers[item.id] ? 'Ocultar Números' : 'Selecionar Números'}
                        </Button>
                      </div>
                      {showTicketNumbers[item.id] && (
                        <div className="mt-4 grid grid-cols-5 gap-2">
                          {Array.from({ length: item.totalTickets || 0 }, (_, i) => i + 1)
                            .filter(num => !item.ticketNumbers?.includes(num))
                            .map(num => (
                              <button
                                key={num}
                                onClick={() => handleTicketNumberSelect(num)}
                                className={`p-2 text-center rounded ${
                                  selectedTicketNumbers.includes(num)
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleSellProduct}
          className="btn btn-primary"
          disabled={!selectedProduct && selectedTicketNumbers.length === 0}
        >
          Realizar Venda
        </Button>
      </div>

      {showAlert && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg ${alertType}`}>
          {alertMessage}
        </div>
      )}
    </main>
  );
};

export default SalesPage;