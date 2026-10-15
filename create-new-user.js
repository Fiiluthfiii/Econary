const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createNewUser() {
  try {
    console.log('\n🚀 Membuat User Baru untuk Econary\n');

    const name = await question('Nama Lengkap: ');
    const email = await question('Email: ');
    const password = await question('Password (min 6 karakter): ');

    if (!name || !email || !password) {
      console.log('❌ Semua field harus diisi!');
      rl.close();
      return;
    }

    if (password.length < 6) {
      console.log('❌ Password minimal 6 karakter!');
      rl.close();
      return;
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      console.log('❌ Email sudah terdaftar!');
      rl.close();
      return;
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        currency: 'IDR',
        theme: 'light',
      },
    });

    // Create default wallet
    await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Dompet Utama',
        type: 'cash',
        balance: 0,
      },
    });

    console.log('\n✅ User berhasil dibuat!');
    console.log('\n📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('\n💡 Silakan login dengan kredensial di atas\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createNewUser();
