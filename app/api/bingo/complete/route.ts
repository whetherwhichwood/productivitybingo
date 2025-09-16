import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { squareId, bingoBoardId } = await request.json()

    if (!squareId || !bingoBoardId) {
      return NextResponse.json(
        { message: 'Square ID and Board ID are required' },
        { status: 400 }
      )
    }

    // Update the square as completed
    const updatedSquare = await prisma.bingoSquare.update({
      where: { id: squareId },
      data: {
        isCompleted: true,
        completedAt: new Date()
      }
    })

    // Get the board to check for bingos
    const board = await prisma.bingoBoard.findUnique({
      where: { id: bingoBoardId },
      include: {
        squares: true
      }
    })

    if (!board) {
      return NextResponse.json(
        { message: 'Board not found' },
        { status: 404 }
      )
    }

    // Check for new bingos
    const bingos = await checkForBingos(board.squares, board.size, bingoBoardId)

    return NextResponse.json({
      message: 'Square completed successfully',
      square: updatedSquare,
      bingos: bingos
    })

  } catch (error) {
    console.error('Complete square error:', error)
    return NextResponse.json(
      { message: 'Failed to complete square' },
      { status: 500 }
    )
  }
}

async function checkForBingos(squares: any[], size: number, boardId: string) {
  const newBingos = []

  // Check rows
  for (let row = 0; row < size; row++) {
    const rowSquares = squares.slice(row * size, (row + 1) * size)
    if (rowSquares.every(square => square.isCompleted || square.type === 'FREE_SPACE')) {
      // Check if this bingo already exists
      const existingBingo = await prisma.bingo.findFirst({
        where: {
          bingoBoardId: boardId,
          type: 'ROW',
          position: row
        }
      })

      if (!existingBingo) {
        const bingo = await prisma.bingo.create({
          data: {
            bingoBoardId: boardId,
            type: 'ROW',
            position: row
          }
        })
        newBingos.push(bingo)
      }
    }
  }

  // Check columns
  for (let col = 0; col < size; col++) {
    const colSquares = squares.filter((_, index) => index % size === col)
    if (colSquares.every(square => square.isCompleted || square.type === 'FREE_SPACE')) {
      const existingBingo = await prisma.bingo.findFirst({
        where: {
          bingoBoardId: boardId,
          type: 'COLUMN',
          position: col
        }
      })

      if (!existingBingo) {
        const bingo = await prisma.bingo.create({
          data: {
            bingoBoardId: boardId,
            type: 'COLUMN',
            position: col
          }
        })
        newBingos.push(bingo)
      }
    }
  }

  // Check diagonals
  const diagonal1 = squares.filter((_, index) => index % (size + 1) === 0)
  if (diagonal1.every(square => square.isCompleted || square.type === 'FREE_SPACE')) {
    const existingBingo = await prisma.bingo.findFirst({
      where: {
        bingoBoardId: boardId,
        type: 'DIAGONAL',
        position: 0
      }
    })

    if (!existingBingo) {
      const bingo = await prisma.bingo.create({
        data: {
          bingoBoardId: boardId,
          type: 'DIAGONAL',
          position: 0
        }
      })
      newBingos.push(bingo)
    }
  }

  const diagonal2 = squares.filter((_, index) => {
    const row = Math.floor(index / size)
    const col = index % size
    return row + col === size - 1
  })
  if (diagonal2.every(square => square.isCompleted || square.type === 'FREE_SPACE')) {
    const existingBingo = await prisma.bingo.findFirst({
      where: {
        bingoBoardId: boardId,
        type: 'DIAGONAL',
        position: 1
      }
    })

    if (!existingBingo) {
      const bingo = await prisma.bingo.create({
        data: {
          bingoBoardId: boardId,
          type: 'DIAGONAL',
          position: 1
        }
      })
      newBingos.push(bingo)
    }
  }

  return newBingos
}
