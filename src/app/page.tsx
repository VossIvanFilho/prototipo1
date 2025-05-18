"use client";

import Link from 'next/link';
import { Button } from '@/components/Button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--background)] to-[var(--background-light)]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--primary)] opacity-20"></div>
          <p className="text-[var(--foreground)] opacity-60">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--background)] to-[var(--background-light)] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card p-8 sm:p-12 animate-fade-in">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold">
              Bem-vindo ao Aplicativo de Vendas
            </h1>
            <p className="text-lg sm:text-xl text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
              Gerencie suas vendas e rifas de forma simples e eficiente. Uma plataforma completa para impulsionar seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="card p-6 hover:scale-105 transition-transform">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Comprar Agora</h3>
                <p className="text-[var(--foreground)] opacity-70">
                  Acesse nossa loja e encontre as melhores ofertas
                </p>
                <Link href="/sales" className="block">
                  <Button className="btn btn-primary w-full">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Ir para Loja
                  </Button>
                </Link>
              </div>
            </div>

            <div className="card p-6 hover:scale-105 transition-transform">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Painel Administrativo</h3>
                <p className="text-[var(--foreground)] opacity-70">
                  Gerencie suas vendas, produtos e configurações
                </p>
                <Link href="/admin" className="block">
                  <Button className="btn btn-secondary w-full">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Acessar Painel
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-[var(--foreground)] opacity-60">
            <p>© 2024 Aplicativo de Vendas. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
