// app/api/resume/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Session } from '@/lib/session'


// GET: Fetch all resume drafts for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const resumes = await prisma.resume.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    
    return NextResponse.json(resumes)
  } catch (error) {
    console.error('Failed to fetch resume drafts:', error)
    return NextResponse.json({ error: 'Failed to fetch resume drafts' }, { status: 500 })
  }
}

// POST: Create or update a resume draft
export async function POST(request: NextRequest) {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { formData, selectedTemplate, activeSection, progress, resumeId } = await request.json()
    
    // Generate a name for the resume if first/last name are available
    const resumeName = `${formData.personal.firstName || ''} ${formData.personal.lastName || ''} - ${selectedTemplate.name}`.trim()
    
    // If resumeId is provided, update the existing draft
    if (resumeId) {
      // First check if the resume belongs to the user
      const existingResume = await prisma.resume.findUnique({
        where: {
          id: resumeId,
        },
      })
      
      if (!existingResume || existingResume.userId !== session.user.id) {
        return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
      }
      
      const updatedResume = await prisma.resume.update({
        where: {
          id: resumeId,
        },
        data: {
          name: resumeName || 'Untitled Resume',
          templateId: selectedTemplate.id,
          personal: formData.personal,
          summary: formData.summary,
          experience: formData.experience,
          education: formData.education,
          skills: formData.skills,
          projects: formData.projects,
          progress,
          lastActiveStep: activeSection,
        },
      })
      
      return NextResponse.json(updatedResume)
    }
    
    // Otherwise, create a new draft
    const newResume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        name: resumeName || 'Untitled Resume',
        templateId: selectedTemplate.id,
        personal: formData.personal,
        summary: formData.summary,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills,
        projects: formData.projects,
        progress,
        lastActiveStep: activeSection,
      },
    })
    
    return NextResponse.json(newResume)
  } catch (error) {
    console.error('Failed to save resume draft:', error)
    return NextResponse.json({ error: 'Failed to save resume draft' }, { status: 500 })
  }
}

// DELETE: Delete a resume draft
export async function DELETE(request: NextRequest) {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const resumeId = searchParams.get('id')
    
    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 })
    }
    
    // Verify the resume belongs to the user
    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
      },
    })
    
    if (!resume || resume.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
    }
    
    await prisma.resume.delete({
      where: {
        id: resumeId,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete resume draft:', error)
    return NextResponse.json({ error: 'Failed to delete resume draft' }, { status: 500 })
  }
}

// GET specific resume by ID
export async function GET_SPECIFIC(request: NextRequest) {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const resumeId = searchParams.get('id')
    
    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 })
    }
    
    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
      },
    })
    
    if (!resume || resume.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
    }
    
    return NextResponse.json(resume)
  } catch (error) {
    console.error('Failed to fetch resume draft:', error)
    return NextResponse.json({ error: 'Failed to fetch resume draft' }, { status: 500 })
  }
}