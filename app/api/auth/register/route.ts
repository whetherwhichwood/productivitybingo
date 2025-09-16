import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password, accountName, userName } = await request.json()

    // Validate required fields
    if (!email || !password || !userName) {
      return NextResponse.json(
        { message: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if account already exists
    const existingAccount = await prisma.account.findUnique({
      where: { email }
    })

    if (existingAccount) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create account and user
    const account = await prisma.account.create({
      data: {
        email,
        password: hashedPassword,
        name: accountName || null,
        users: {
          create: {
            name: userName,
            email: email
          }
        }
      },
      include: {
        users: true
      }
    })

    // Return success (don't return password)
    const { password: _, ...accountWithoutPassword } = account
    return NextResponse.json({
      message: 'Account created successfully',
      account: accountWithoutPassword
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
