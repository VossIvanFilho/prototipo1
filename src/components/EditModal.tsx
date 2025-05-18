import { Product } from '@/hooks/useProducts';
import { Button } from './Button';

interface EditModalProps {
  editProduct: Product | null;
  setEditProduct: (product: Product | null) => void;
  handleSaveEdit: () => void;
  handleEditImageUpload: (e: React.ChangeEvent<HTMLInputElement>, isPrizeImage?: boolean) => void;
  parseCurrency: (value: string) => number;
}

export function EditModal({
  editProduct,
  setEditProduct,
  handleSaveEdit,
  handleEditImageUpload,
  parseCurrency,
}: EditModalProps) {
  if (!editProduct) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out shadow-xl animate-slideIn">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Editar {editProduct.type === 'product' ? 'Produto' : 'Rifa'}
          </h3>
          <button
            onClick={() => setEditProduct(null)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna da Esquerda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome do {editProduct.type === 'product' ? 'Produto' : 'Prêmio'}
              </label>
              <input
                type="text"
                value={editProduct.product}
                onChange={(e) => setEditProduct({ ...editProduct, product: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {editProduct.type === 'product' ? 'Quantidade' : 'Total de Bilhetes'}
              </label>
              <input
                type="number"
                value={editProduct.type === 'product' ? editProduct.quantity : editProduct.totalTickets}
                onChange={(e) => setEditProduct({
                  ...editProduct,
                  [editProduct.type === 'product' ? 'quantity' : 'totalTickets']: Number(e.target.value)
                })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preço Unitário
              </label>
              <input
                type="text"
                value={editProduct.unitPrice}
                onChange={(e) => setEditProduct({ ...editProduct, unitPrice: parseCurrency(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Despesa Unitária
              </label>
              <input
                type="text"
                value={editProduct.unitExpense || ''}
                onChange={(e) => setEditProduct({ ...editProduct, unitExpense: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          {/* Coluna da Direita */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                value={editProduct.startDate || ''}
                onChange={(e) => setEditProduct({ ...editProduct, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data de Término
              </label>
              <input
                type="date"
                value={editProduct.endDate || ''}
                onChange={(e) => setEditProduct({ ...editProduct, endDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {/* Campo de imagem: só mostra um conforme o tipo */}
            {editProduct.type === 'product' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Imagem do Produto
                </label>
                <div className="flex flex-col space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleEditImageUpload(e, false)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {editProduct.imageUrl && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                      <img
                        src={editProduct.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            {editProduct.type === 'raffle' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Imagem do Prêmio
                </label>
                <div className="flex flex-col space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleEditImageUpload(e, true)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {editProduct.prizeImageUrl && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                      <img
                        src={editProduct.prizeImageUrl}
                        alt="Preview do Prêmio"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <Button
            onClick={() => setEditProduct(null)}
            className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEdit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
} 