import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10)

  // Create demo users
  const creator = await prisma.user.upsert({
    where: { email: 'creator@reeled.com' },
    update: {},
    create: {
      id: 'demo-creator',
      email: 'creator@reeled.com',
      username: 'sarahjohnson',
      name: 'Sarah Johnson',
      password: hashedPassword,
      isCreator: true,
      bio: 'Tech educator & developer 👩‍💻 | Teaching React, Python & Design',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      followers: 1250,
      following: 340
    }
  })

  const learner = await prisma.user.upsert({
    where: { email: 'learner@reeled.com' },
    update: {},
    create: {
      id: 'demo-user',
      email: 'learner@reeled.com',
      username: 'alexsmith',
      name: 'Alex Smith',
      password: hashedPassword,
      isCreator: false,
      bio: 'Learning something new every day 📚',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      followers: 45,
      following: 120
    }
  })

  // Create demo courses
  const reactCourse = await prisma.course.create({
    data: {
      creatorId: creator.id,
      title: 'Master React Hooks in 5 Minutes',
      description: 'Learn useState, useEffect, and custom hooks through bite-sized lessons',
      price: 0,
      tags: 'react,javascript,hooks',
      reels: {
        create: [
          {
            index: 0,
            title: 'Introduction to React Hooks',
            mediaUrl: '/videos/react-intro.mp4',
            microAction: 'Think about a component you want to build',
            duration: 45
          },
          {
            index: 1,
            title: 'useState Explained',
            mediaUrl: '/videos/react-usestate.mp4',
            microAction: 'Create a counter component using useState',
            duration: 60
          },
          {
            index: 2,
            title: 'useEffect for Side Effects',
            mediaUrl: '/videos/react-useeffect.mp4',
            microAction: 'Add a document title update to your component',
            duration: 75
          },
          {
            index: 3,
            title: 'Custom Hooks Pattern',
            mediaUrl: '/videos/react-custom.mp4',
            microAction: 'Extract logic into a custom hook',
            duration: 60
          },
          {
            index: 4,
            title: 'Assessment: Build a Todo App',
            mediaUrl: '/videos/react-assessment.mp4',
            microAction: 'Complete the coding challenge',
            duration: 90
          }
        ]
      },
      assessments: {
        create: {
          type: 'code',
          config: JSON.stringify({
            question: 'Create a custom hook called useTodo that manages todo state',
            requiredKeyword: 'useState'
          })
        }
      }
    }
  })

  const pythonCourse = await prisma.course.create({
    data: {
      creatorId: creator.id,
      title: 'Python Data Structures Crash Course',
      description: 'Master lists, dicts, sets, and tuples with practical examples',
      price: 0,
      tags: 'python,data-structures,beginner',
      reels: {
        create: [
          {
            index: 0,
            title: 'Why Data Structures Matter',
            mediaUrl: '/videos/python-intro.mp4',
            microAction: 'List 3 data structures you already know',
            duration: 40
          },
          {
            index: 1,
            title: 'Lists: Your Dynamic Array',
            mediaUrl: '/videos/python-lists.mp4',
            microAction: 'Create a list and use append, pop, and slice',
            duration: 70
          },
          {
            index: 2,
            title: 'Dictionaries: Key-Value Power',
            mediaUrl: '/videos/python-dicts.mp4',
            microAction: 'Build a simple contact book with dict',
            duration: 65
          },
          {
            index: 3,
            title: 'Sets and Tuples',
            mediaUrl: '/videos/python-sets.mp4',
            microAction: 'Find unique items in a list using sets',
            duration: 55
          }
        ]
      }
    }
  })

  const designCourse = await prisma.course.create({
    data: {
      creatorId: creator.id,
      title: 'UI Design Principles in 3 Minutes',
      description: 'Learn contrast, alignment, repetition, and proximity',
      price: 0,
      tags: 'design,ui,principles',
      reels: {
        create: [
          {
            index: 0,
            title: 'The 4 Core Principles',
            mediaUrl: '/videos/design-intro.mp4',
            microAction: 'Identify bad design in your daily apps',
            duration: 50
          },
          {
            index: 1,
            title: 'Contrast Creates Hierarchy',
            mediaUrl: '/videos/design-contrast.mp4',
            microAction: 'Redesign a button with better contrast',
            duration: 60
          },
          {
            index: 2,
            title: 'Alignment Brings Order',
            mediaUrl: '/videos/design-alignment.mp4',
            microAction: 'Fix alignment issues in a mockup',
            duration: 55
          },
          {
            index: 3,
            title: 'Repetition & Proximity',
            mediaUrl: '/videos/design-final.mp4',
            microAction: 'Apply all principles to a card design',
            duration: 70
          }
        ]
      }
    }
  })

  console.log('✅ Seed data created successfully!')
  console.log(`Created ${3} courses with multiple reels`)
  console.log(`Creator: ${creator.email}`)
  console.log(`Learner: ${learner.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
