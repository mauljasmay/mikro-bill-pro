const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function initializeMikrotikConfig() {
  try {
    console.log('🔧 Initializing default Mikrotik configuration...')

    // Check if any config already exists
    const existingConfig = await prisma.mikrotikConfig.findFirst()

    if (existingConfig) {
      console.log('✅ Mikrotik configuration already exists. Skipping initialization.')
      return
    }

    // Create default configuration
    const defaultConfig = await prisma.mikrotikConfig.create({
      data: {
        name: 'Default Mikrotik',
        host: 'mikrotik.yourdomain.com',
        port: 8729,
        username: 'admin',
        password: 'admin',
        useSSL: true,
        isActive: true
      }
    })

    console.log('✅ Default Mikrotik configuration created successfully!')
    console.log('📋 Configuration Details:')
    console.log(`   Host: ${defaultConfig.host}`)
    console.log(`   Port: ${defaultConfig.port}`)
    console.log(`   Username: ${defaultConfig.username}`)
    console.log(`   SSL: ${defaultConfig.useSSL ? 'Enabled' : 'Disabled'}`)
    console.log('')
    console.log('⚠️  IMPORTANT: Update this configuration with your actual Mikrotik details in the admin panel!')
    console.log('   Go to /admin and navigate to Mikrotik settings.')

  } catch (error) {
    console.error('❌ Error initializing Mikrotik configuration:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the initialization
initializeMikrotikConfig()
