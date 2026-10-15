import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Registration request received:', { ...body, password: '***' });
    
    const { name, email, password } = body;

    // Validasi input
    if (!name || !email || !password) {
      console.log('Validation failed: missing fields');
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('Validation failed: password too short');
      return NextResponse.json(
        { message: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    console.log('Checking if email exists:', email);
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('Email already registered');
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Buat user baru
    console.log('Creating new user...');
    const user = await createUser(name, email, password);
    console.log('User created successfully:', user.id);

    return NextResponse.json(
      {
        message: 'Registrasi berhasil',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error details:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}
