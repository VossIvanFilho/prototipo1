"use client";

import { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  startDate?: string | null;
  endDate?: string | null;
}

interface EditProduct extends Product {}

interface ConfirmDelete {
  show: boolean;
  productId: number | null;
}

const initialSalesData: Product[] = [
  { id: 1, product: 'Hambúrguer', quantity: 10, unitPrice: 5.99, total: 59.9 },
  { id: 2, product: 'Pizza', quantity: 5, unitPrice: 8.99, total: 44.95 },
  { id: 3, product: 'Refrigerante', quantity: 20, unitPrice: 1.99, total: 39.8 },
];

export default function AdminPanel() {
  const router = useRouter();
  const [data, setData] = useState<Product[]>(initialSalesData);
  const [newProduct, setNewProduct] = useState<Product>({
    product: '',
    quantity: 0,
    unitPrice: 0,
    startDate: '',
    endDate: '',
    total: 0,
    id: 0,
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState<ConfirmDelete>({ show: false, productId: null });
  const [editProduct, setEditProduct] = useState<EditProduct | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    // Save products to localStorage whenever they change
    localStorage.setItem('products', JSON.stringify(data.map((item) => item.product)));
  }, [data]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return !prev;
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.product || !newProduct.quantity) {
      alert('Produto e quantidade são obrigatórios!');
      return;
    }

    const quantity = parseInt(newProduct.quantity.toString(), 10);
    const unitPrice = parseFloat(newProduct.unitPrice.toString().replace(',', '.')) || 0; // Default to 0 if not provided
    const total = quantity * unitPrice;

    setData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1,
        product: newProduct.product,
        quantity,
        unitPrice,
        total,
        startDate: newProduct.startDate || null,
        endDate: newProduct.endDate || null,
      },
    ]);

    setNewProduct({ product: '', quantity: 0, unitPrice: 0, startDate: '', endDate: '', total: 0, id: 0 });

    // Save updated data to localStorage
    localStorage.setItem('products', JSON.stringify([...data, newProduct]));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteProduct = (productId: number) => {
    setData((prevData) => prevData.filter((item) => item.id !== productId));
    setShowConfirmDelete({ show: false, productId: null });
  };

  const handleEditProduct = (product: EditProduct) => {
    setEditProduct(product);
  };

  const handleSaveEdit = () => {
    if (editProduct) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === editProduct.id
            ? { ...editProduct, total: editProduct.quantity * editProduct.unitPrice }
            : item
        )
      );
      setEditProduct(null);
    }
  };

  return (
    <main className={`min-h-screen p-6 bg-gradient-to-r from-[var(--background)] to-[var(--background)] text-[var(--foreground)] dark:from-[var(--background-dark)] dark:to-[var(--background-dark)]`}>
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-[var(--background-light)] text-[var(--foreground)] rounded hover:bg-[var(--background-hover)]"
      >
        Voltar
      </button>
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 bg-[var(--background-light)] dark:bg-[var(--background-dark)] p-2 rounded-full shadow-md hover:bg-[var(--background-hover)] dark:hover:bg-[var(--background-hover-dark)]"
        aria-label="Alternar tema"
      >
        {/* Removed sun and moon icons */}
      </button>
      <button
        onClick={() => router.push('/admin/statistics')}
        className="bg-[var(--primary)] text-[var(--background)] px-4 py-2 rounded shadow hover:bg-[var(--secondary)] transition mb-4"
      >
        Ver Estatísticas em Tempo Real
      </button>
      <h1 className="text-3xl font-extrabold text-[var(--primary)] mb-6 text-center">Painel Administrativo</h1>
      <p className="text-center text-[var(--foreground)] mb-8">Gerencie suas vendas e visualize estatísticas detalhadas de forma simples e intuitiva.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[var(--background)] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Adicionar Produto</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-[var(--foreground)]">Produto:</label>
              <input
                type="text"
                name="product"
                value={newProduct.product}
                onChange={handleInputChange}
                className="border border-[var(--border)] p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] bg-[var(--background)]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--foreground)]">Quantidade:</label>
              <input
                type="number"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleInputChange}
                className="border border-[var(--border)] p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] bg-[var(--background)]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--foreground)]">Preço Unitário:</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--foreground)]">R$</span>
                <input
                  type="text"
                  name="unitPrice"
                  value={newProduct.unitPrice.toString()}
                  onChange={(e) => handleInputChange(e)}
                  className="border border-[var(--border)] p-2 pl-8 w-full rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] bg-[var(--background)]"
                  placeholder="Ex: 5,99"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-[var(--foreground)]">Data de Início (opcional):</label>
              <input
                type="date"
                name="startDate"
                value={newProduct.startDate || ''}
                onChange={handleInputChange}
                className="border border-[var(--border)] p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] bg-[var(--background)]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--foreground)]">Data de Fim (opcional):</label>
              <input
                type="date"
                name="endDate"
                value={newProduct.endDate || ''}
                onChange={handleInputChange}
                className="border border-[var(--border)] p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] bg-[var(--background)]"
              />
            </div>
            <button
              onClick={handleAddProduct}
              className="bg-[var(--primary)] text-[var(--background)] px-4 py-2 rounded shadow hover:bg-[var(--secondary)] transition"
            >
              Adicionar Produto
            </button>
          </div>
        </div>

        <div className="bg-[var(--background)] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Estatísticas de Vendas</h2>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--background-light)]">
                <th className="px-4 py-2 border-b-2 border-[var(--border)] text-[var(--foreground)]">Produto</th>
                <th className="px-4 py-2 border-b-2 border-[var(--border)] text-[var(--foreground)]">Quantidade Vendida</th>
                <th className="px-4 py-2 border-b-2 border-[var(--border)] text-[var(--foreground)]">Preço Unitário</th>
                <th className="px-4 py-2 border-b-2 border-[var(--border)] text-[var(--foreground)]">Receita Total</th>
                <th className="px-4 py-2 border-b-2 border-[var(--border)]">Data de Início</th>
                <th className="px-4 py-2 border-b-2 border-[var(--border)]">Data de Fim</th>
                <th className="px-4 py-2 border-b-2 border-[var(--border)]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--background-hover)]">
                  <td className="px-4 py-2 border-b border-[var(--border)]">{item.product}</td>
                  <td className="px-4 py-2 border-b border-[var(--border)]">{item.quantity}</td>
                  <td className="px-4 py-2 border-b border-[var(--border)]">R${item.unitPrice.toFixed(2).replace('.', ',')}</td>
                  <td className="px-4 py-2 border-b border-[var(--border)]">R${item.total.toFixed(2).replace('.', ',')}</td>
                  <td className="px-4 py-2 border-b border-[var(--border)]">{item.startDate || '-'}</td>
                  <td className="px-4 py-2 border-b border-[var(--border)]">{item.endDate || '-'}</td>
                  <td className="px-4 py-2 border-b border-[var(--border)]">
                    <button
                      onClick={() => handleEditProduct(item)}
                      className="text-[var(--primary)] hover:text-[var(--secondary)] mr-2"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete({ show: true, productId: item.id })}
                      className="text-[var(--danger)] hover:text-[var(--danger-hover)]"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirmDelete.show && (
        <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center">
          <div className="bg-[var(--background)] p-6 rounded shadow-md text-center">
            <p className="mb-4">Tem certeza que deseja excluir este produto?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleDeleteProduct(showConfirmDelete.productId!)}
                className="bg-[var(--danger)] text-[var(--background)] px-4 py-2 rounded hover:bg-[var(--danger-hover)]"
              >
                Sim
              </button>
              <button
                onClick={() => setShowConfirmDelete({ show: false, productId: null })}
                className="bg-[var(--background-light)] text-[var(--foreground)] px-4 py-2 rounded hover:bg-[var(--background-hover)]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {editProduct && (
        <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center">
          <div className="bg-[var(--background)] p-6 rounded shadow-md text-center">
            <h3 className="mb-4">Editar Produto</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-[var(--foreground)]">Produto:</label>
                <input
                  type="text"
                  value={editProduct.product}
                  onChange={(e) => setEditProduct({ ...editProduct, product: e.target.value })}
                  className="border border-[var(--border)] p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] bg-[var(--background)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--foreground)]">Quantidade:</label>
                <input
                  type="number"
                  value={editProduct.quantity}
                  onChange={(e) => setEditProduct({ ...editProduct, quantity: parseInt(e.target.value, 10) })}
                  className="border border-[var(--border)] p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] bg-[var(--background)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--foreground)]">Preço Unitário:</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--foreground)]">R$</span>
                  <input
                    type="text"
                    value={editProduct.unitPrice.toFixed(2).replace('.', ',')}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9,]/g, '').replace(',', '.');
                      setEditProduct({ ...editProduct, unitPrice: parseFloat(value) });
                    }}
                    className="border border-[var(--border)] p-2 pl-8 w-full rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] bg-[var(--background)]"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handleSaveEdit}
                className="bg-[var(--primary)] text-[var(--background)] px-4 py-2 rounded hover:bg-[var(--secondary)]"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditProduct(null)}
                className="bg-[var(--background-light)] text-[var(--foreground)] px-4 py-2 rounded hover:bg-[var(--background-hover)]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}