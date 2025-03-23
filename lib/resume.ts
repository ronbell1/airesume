// lib/resume.ts

import prisma from "./prisma";

export async function saveResumeDraft({
  userId,
  formData,
  selectedTemplate,
  activeSection,
  progress
}: {
  userId: string;
  formData: any;
  selectedTemplate: { id: string; name: string };
  activeSection: string;
  progress: number;
}) {
  try {
    // Check if the user already has a draft with this template
    const existingResume = await prisma.resume.findFirst({
      where: {
        userId,
        templateId: selectedTemplate.id,
      },
    })

    if (existingResume) {
      // Update existing draft
      return await prisma.resume.update({
        where: {
          id: existingResume.id,
        },
        data: {
          name: `${formData.personal.firstName || ''} ${formData.personal.lastName || ''} - ${selectedTemplate.name}`.trim(),
          templateId: selectedTemplate.id,
          personal: formData.personal,
          summary: formData.summary,
          experience: formData.experience,
          education: formData.education,
          skills: formData.skills,
          projects: formData.projects,
          progress,
          lastActiveStep: activeSection,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new draft
      return await prisma.resume.create({
        data: {
          userId,
          name: `${formData.personal.firstName || ''} ${formData.personal.lastName || ''} - ${selectedTemplate.name}`.trim(),
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
    }
  } catch (error) {
    console.error('Failed to save resume draft:', error)
    throw new Error('Failed to save resume draft')
  }
}

export async function getResumeDrafts(userId: string) {
  try {
    return await prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
  } catch (error) {
    console.error('Failed to fetch resume drafts:', error)
    throw new Error('Failed to fetch resume drafts')
  }
}

export async function getResumeDraft(id: string) {
  try {
    return await prisma.resume.findUnique({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error('Failed to fetch resume draft:', error)
    throw new Error('Failed to fetch resume draft')
  }
}

export async function deleteResumeDraft(id: string) {
  try {
    return await prisma.resume.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error('Failed to delete resume draft:', error)
    throw new Error('Failed to delete resume draft')
  }
}