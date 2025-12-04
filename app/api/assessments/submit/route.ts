import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Mock AI feedback generator
function generateAIFeedback(type: string, answer: string, correct: boolean): string {
  if (correct) {
    return "Great job! You've demonstrated understanding of this concept. Keep up the excellent work!"
  }
  
  const feedbackTemplates = {
    mcq: "Not quite right. Review the core concept and try to identify the key principle being tested.",
    code: "Your code has some issues. Focus on the logic flow and check for syntax errors.",
    text: "Your answer needs more detail. Consider the main points covered in the lesson."
  }
  
  return feedbackTemplates[type as keyof typeof feedbackTemplates] || "Try again and review the lesson material."
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assessmentId, userId, answer, type } = body

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId }
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    const config = JSON.parse(assessment.config)
    let score = 0
    let correct = false

    // Auto-grading logic
    if (type === 'mcq') {
      correct = answer === config.correctAnswer
      score = correct ? 100 : 0
    } else if (type === 'code') {
      // Mock code evaluation
      correct = answer.includes(config.requiredKeyword || 'function')
      score = correct ? 100 : 50
    } else {
      // Text/video - mock scoring
      score = 75
      correct = true
    }

    const feedback = generateAIFeedback(type, answer, correct)

    const submission = await prisma.assessmentSubmission.create({
      data: {
        assessmentId,
        userId,
        answer,
        score,
        feedback
      }
    })

    return NextResponse.json({
      submission,
      passed: score >= 70,
      feedback
    })
  } catch (error) {
    console.error('Assessment submission error:', error)
    return NextResponse.json({ error: 'Failed to submit assessment' }, { status: 500 })
  }
}
