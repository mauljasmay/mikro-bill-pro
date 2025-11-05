const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function hashPassword(password) {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const hashedPassword = await hashPassword('110519')

    const admin = await prisma.user.create({
      data: {
        username: 'maulmlj',
        name: 'Admin User',
        email: 'admin@mikrobill.com', // dummy email since it's now optional
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    })

    console.log('Admin user created successfully:', admin)
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
