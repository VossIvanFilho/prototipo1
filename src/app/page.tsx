"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-6">Bem-vindo ao Aplicativo de Vendas</h1>
      <div className="flex space-x-4">
        <Link href="/sales">
          <span className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Comprar Agora</span>
        </Link>
        <Link href="/admin">
          <span className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Painel Administrativo</span>
        </Link>
      </div>
    </main>
  );
}
