import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Hash fixo para a senha 'admin123'
const ADMIN_PASSWORD = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Verificar se é o usuário admin
    if (email === 'admin@example.com') {
      const isValid = await bcrypt.compare(password, ADMIN_PASSWORD);
      
      return NextResponse.json({
        success: true,
        email: email,
        passwordMatch: isValid,
        isAdmin: true
      });
    }
    
    return NextResponse.json({
      success: true,
      email: email,
      passwordMatch: false,
      isAdmin: false
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
} 