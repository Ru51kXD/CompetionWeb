import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean the database
  await prisma.entry.deleteMany({})
  await prisma.competition.deleteMany({})
  await prisma.team.deleteMany({})
  await prisma.user.deleteMany({})

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Администратор',
      email: 'admin@example.com',
      password: 'admin123', // В реальном проекте пароли должны быть хешированы
      role: 'ADMIN',
    },
  })

  const organizer = await prisma.user.create({
    data: {
      name: 'Организатор',
      email: 'organizer@example.com',
      password: 'organizer123',
      role: 'ORGANIZER',
    },
  })

  const user1 = await prisma.user.create({
    data: {
      name: 'Иван Петров',
      email: 'ivan@example.com',
      password: 'user123',
      role: 'USER',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Анна Иванова',
      email: 'anna@example.com',
      password: 'user123',
      role: 'USER',
    },
  })

  // Create teams
  const team1 = await prisma.team.create({
    data: {
      name: 'Команда Альфа',
      description: 'Сильнейшая команда по шахматам в городе',
      owner: {
        connect: { id: user1.id }
      },
      members: {
        connect: [{ id: user1.id }, { id: user2.id }]
      }
    }
  })

  const team2 = await prisma.team.create({
    data: {
      name: 'Футбольная команда "Молния"',
      description: 'Школьная футбольная команда',
      owner: {
        connect: { id: user2.id }
      },
      members: {
        connect: [{ id: user2.id }]
      }
    }
  })

  // Create competitions
  const competition1 = await prisma.competition.create({
    data: {
      title: 'Городской турнир по шахматам',
      description: 'Ежегодный турнир по шахматам среди любителей и профессионалов всех возрастов.',
      type: 'INTELLECTUAL',
      startDate: new Date('2023-12-15'),
      endDate: new Date('2023-12-17'),
      location: 'Городской шахматный клуб',
      image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2071',
      rules: `
        1. Соревнования проводятся по правилам ФИДЕ.
        2. Контроль времени: 15 минут + 10 секунд на ход каждому участнику.
        3. Турнир проводится по швейцарской системе в 9 туров.
        4. Определение победителей по наибольшему количеству набранных очков.
        5. При равенстве очков места определяются по дополнительным показателям.
      `,
    }
  })

  const competition2 = await prisma.competition.create({
    data: {
      title: 'Межшкольные соревнования по футболу',
      description: 'Футбольные матчи между командами школ города. Присоединяйтесь к спортивному празднику!',
      type: 'SPORTS',
      startDate: new Date('2023-12-20'),
      endDate: new Date('2023-12-25'),
      location: 'Центральный стадион',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2034',
      rules: `
        1. Матчи проводятся по правилам FIFA с адаптацией для школьных команд.
        2. Состав команды: 11 основных игроков + 5 запасных.
        3. Продолжительность матча: 2 тайма по 35 минут с 15-минутным перерывом.
        4. Групповой этап, затем плей-офф для определения победителя.
        5. В случае ничьей в плей-офф - серия пенальти.
      `,
    }
  })

  const competition3 = await prisma.competition.create({
    data: {
      title: 'Конкурс молодых художников',
      description: 'Открытый конкурс для художников до 25 лет. Покажите свой талант и выиграйте ценные призы!',
      type: 'CREATIVE',
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-01-20'),
      location: 'Городская галерея искусств',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071',
      rules: `
        1. К участию приглашаются художники в возрасте до 25 лет.
        2. Работы принимаются в следующих категориях: живопись, графика, скульптура, цифровое искусство.
        3. Каждый участник может представить не более 3 работ.
        4. Работы должны быть созданы не ранее чем за 1 год до даты конкурса.
        5. Жюри оценивает оригинальность, технику исполнения и художественную ценность.
      `,
    }
  })

  // Create entries
  await prisma.entry.create({
    data: {
      competition: { connect: { id: competition1.id } },
      user: { connect: { id: user1.id } },
      status: 'APPROVED',
    }
  })

  await prisma.entry.create({
    data: {
      competition: { connect: { id: competition2.id } },
      team: { connect: { id: team2.id } },
      status: 'APPROVED',
    }
  })

  console.log('База данных успешно заполнена')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 