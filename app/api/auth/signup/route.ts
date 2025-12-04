import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Signup request:', body)
    
    const { name, username, email, password, isCreator } = body

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? 'Email already exists' : 'Username already taken' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        isCreator: isCreator || false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        isCreator: true,
        avatar: true
      }
    })

    console.log('User created successfully:', user.username)

    return NextResponse.json({
      user,
      message: 'Account created successfully'
    })
  } catch (error: any) {
    console.error('Signup error details:', error)
    return NextResponse.json(
      { error: error.message || 'Signup failed. Please try again.' },
      { status: 500 }
    )
  }
}
