const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected!\n');

    // Check if tables exist
    console.log('📊 Checking tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('Tables found:', tables.length);
    tables.forEach(t => console.log('  -', t.table_name));
    console.log('');

    // Check if User table exists
    const userTableExists = tables.some(t => t.table_name === 'User');
    
    if (!userTableExists) {
      console.log('❌ User table does not exist!');
      console.log('⚠️  Running prisma db push to create tables...\n');
      return;
    }

    console.log('✅ User table exists!\n');

    // Try to find or create demo user
    console.log('👤 Checking for demo user...');
    
    let demoUser = await prisma.user.findUnique({
      where: { email: 'demo@pocket.com' }
    });

    if (demoUser) {
      console.log('✅ Demo user exists!');
      console.log('   ID:', demoUser.id);
      console.log('   Email:', demoUser.email);
      console.log('   Name:', demoUser.name);
    } else {
      console.log('⚠️  Demo user not found. Creating...');
      
      const hashedPassword = await bcrypt.hash('demo123', 10);
      
      demoUser = await prisma.user.create({
        data: {
          name: 'Demo User',
          email: 'demo@pocket.com',
          password: hashedPassword,
          currency: 'IDR',
          theme: 'light',
        },
      });

      console.log('✅ Demo user created!');
      console.log('   ID:', demoUser.id);
      console.log('   Email:', demoUser.email);

      // Create wallet
      await prisma.wallet.create({
        data: {
          userId: demoUser.id,
          name: 'Dompet Utama',
          type: 'cash',
          balance: 15000000,
        },
      });
      console.log('✅ Wallet created!');
    }

    console.log('\n✅ DATABASE TEST PASSED!');
    console.log('\n📧 Login credentials:');
    console.log('   Email: demo@pocket.com');
    console.log('   Password: demo123\n');

  } catch (error) {
    console.error('\n❌ DATABASE TEST FAILED!');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
