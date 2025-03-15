import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing todos (if any)
  await prisma.todo.deleteMany()
  
  // Create sample todos with varying states
  const todos = [
    {
      title: 'Complete project documentation',
      description: 'Finish writing API docs and deployment guide',
      completed: true,
      createdAt: new Date('2025-02-20'),
      updatedAt: new Date('2025-02-20')
    },
    {
      title: 'Implement authentication',
      description: 'Add JWT and session management',
      completed: false,
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-01')
    },
    {
      title: 'Fix critical bug #123',
      description: 'Memory leak causing server crashes',
      completed: true,
      createdAt: new Date('2025-02-25'),
      updatedAt: new Date('2025-02-25')
    },
    {
      title: 'Review PRs',
      description: 'Check pending pull requests from team members',
      completed: false,
      createdAt: new Date('2025-03-04'),
      updatedAt: new Date('2025-03-04')
    },
    {
      title: 'Update dependencies',
      description: 'Run npm audit and update vulnerable packages',
      completed: false,
      createdAt: new Date('2025-03-03'),
      updatedAt: new Date('2025-03-03')
    }
  ]

  // Create todos in database
  for (const todo of todos) {
    await prisma.todo.create({
      data: todo
    })
    console.log(`Created todo: ${todo.title}`)
  }

  const count = await prisma.todo.count()
  console.log(`\nTotal todos in database: ${count}`)

  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })