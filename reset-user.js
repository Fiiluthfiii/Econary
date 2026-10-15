const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetUser() {
  try {
    console.log('🔄 Resetting demo user...');

    // Delete existing demo user and related data
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@pocket.com' }
    });

    if (existingUser) {
      console.log('🗑️  Deleting existing user...');
      await prisma.user.delete({
        where: { email: 'demo@pocket.com' }
      });
    }

    // Create new demo user with fresh password
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    console.log('👤 Creating new demo user...');
    const demoUser = await prisma.user.create({
      data: {
        name: 'Demo User',
        email: 'demo@pocket.com',
        password: hashedPassword,
        currency: 'IDR',
        theme: 'light',
      },
    });

    console.log('✅ Demo user created successfully!');
    console.log('');
    console.log('📧 Email: demo@pocket.com');
    console.log('🔑 Password: demo123');
    console.log('');
    console.log('💡 You can now login with these credentials');

    // Create default wallet
    console.log('💰 Creating default wallet...');
    await prisma.wallet.create({
      data: {
        userId: demoUser.id,
        name: 'Dompet Utama',
        type: 'cash',
        balance: 15000000,
      },
    });

    // Get default categories
    const foodCategory = await prisma.category.findFirst({
      where: { name: 'Makanan & Minuman', isDefault: true },
    });
    const salaryCategory = await prisma.category.findFirst({
      where: { name: 'Gaji', isDefault: true },
    });

    if (foodCategory && salaryCategory) {
      console.log('📝 Creating sample transactions...');
      const wallet = await prisma.wallet.findFirst({
        where: { userId: demoUser.id }
      });

      const now = new Date();
      
      // Create some transactions
      await prisma.transaction.create({
        data: {
          userId: demoUser.id,
          walletId: wallet.id,
          categoryId: salaryCategory.id,
          type: 'income',
          amount: 18500000,
          note: 'Gaji Project Freelance',
          date: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      });

      await prisma.transaction.create({
        data: {
          userId: demoUser.id,
          walletId: wallet.id,
          categoryId: foodCategory.id,
          type: 'expense',
          amount: 3650000,
          note: 'Makan & Groceries',
          date: new Date(now.getFullYear(), now.getMonth(), 5),
        },
      });
    }

    console.log('✅ All done! Try logging in now.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetUser();
