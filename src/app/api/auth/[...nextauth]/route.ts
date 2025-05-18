import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        console.log('Tentativa de login:', { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Credenciais faltando');
          return null;
        }

        // Usuário admin fixo
        if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
          console.log('Login bem sucedido');
          return {
            id: '1',
            email: 'admin@example.com',
            name: 'Administrador',
            role: 'admin'
          };
        }

        console.log('Login falhou');
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: 'chave-super-secreta-para-desenvolvimento-local',
  debug: true
});

export { handler as GET, handler as POST }; 