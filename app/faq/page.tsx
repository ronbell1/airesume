"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import SectionTransition from "@/components/section-transition"

// FAQ data
const faqData = [
  {
    category: "Resume Basics",
    questions: [
      {
        question: "How does the AI resume analysis work?",
        answer:
          "Our AI analyzes your resume against industry standards and best practices. It evaluates content, format, keywords, and more to provide personalized recommendations for improvement. The analysis is based on data from thousands of successful resumes across various industries.",
      },
      {
        question: "Can I use ResumeAI for different industries?",
        answer:
          "Yes! ResumeAI is designed to work across multiple industries. Our system recognizes industry-specific requirements and provides tailored recommendations based on your field, whether you're in tech, finance, healthcare, marketing, or any other industry.",
      },
      {
        question: "How often can I update my resume?",
        answer:
          "You can update your resume as often as you like! We recommend refreshing your resume every few months or whenever you gain new skills or experiences. Our tool allows unlimited edits and downloads.",
      },
    ],
  },
  {
    category: "Resume Content",
    questions: [
      {
        question: "What should I include in my resume?",
        answer:
          "A strong resume should include your contact information, a professional summary or objective, work experience, education, skills, and any relevant certifications or achievements. Depending on your industry, you might also include sections for projects, publications, or volunteer work.",
      },
      {
        question: "How long should my resume be?",
        answer:
          "For most professionals, a one-page resume is ideal. If you have more than 10 years of experience or work in academia, a two-page resume may be appropriate. The key is to be concise and include only the most relevant information for the position you're applying for.",
      },
      {
        question: "Should I include a photo on my resume?",
        answer:
          "In the United States, Canada, and the UK, it's generally not recommended to include a photo on your resume as it can lead to unconscious bias. However, in some countries like France, Germany, and parts of Asia, photos are customary. Research the standards for your target location and industry.",
      },
    ],
  },
  {
    category: "Optimization Tips",
    questions: [
      {
        question: "What are ATS systems and how do I optimize for them?",
        answer:
          "Applicant Tracking Systems (ATS) are software used by employers to scan and filter resumes before they reach human recruiters. To optimize for ATS, use standard section headings, incorporate relevant keywords from the job description, avoid using tables or graphics, and submit your resume in a compatible format like .docx or .pdf.",
      },
      {
        question: "How important are keywords in my resume?",
        answer:
          "Keywords are crucial for passing through ATS filters and catching a recruiter's attention. Include industry-specific terms, hard skills, and phrases from the job description. However, avoid 'keyword stuffing' – all terms should be used naturally and accurately reflect your skills and experience.",
      },
      {
        question: "Should I tailor my resume for each job application?",
        answer:
          "Yes, tailoring your resume for each job application significantly increases your chances of getting an interview. Focus on highlighting the skills and experiences most relevant to the specific position, and mirror language from the job description where appropriate.",
      },
    ],
  },
  {
    category: "Technical Questions",
    questions: [
      {
        question: "Is my data secure?",
        answer:
          "Yes, we take data security very seriously. All your personal information and resume data are encrypted and stored securely. We never share your information with third parties without your explicit consent. You can review our privacy policy for more details.",
      },
      {
        question: "What file formats can I upload?",
        answer:
          "Our system accepts resumes in PDF, DOCX, and DOC formats. For the best results, we recommend using PDF or DOCX as they maintain formatting more consistently across different devices and platforms.",
      },
      {
        question: "Can I download my resume in different formats?",
        answer:
          "Yes, you can download your resume in PDF and DOCX formats. PDF is ideal for sending to employers as it preserves your formatting, while DOCX allows for further editing if needed.",
      },
    ],
  },
  {
    category: "Career Advice",
    questions: [
      {
        question: "How can I explain gaps in my employment history?",
        answer:
          "Employment gaps can be addressed honestly and strategically. Focus on any professional development, volunteering, freelance work, or skills you gained during that time. In your resume, consider using a functional format that emphasizes skills over chronology, or briefly explain the gap in your cover letter.",
      },
      {
        question: "How do I showcase transferable skills when changing careers?",
        answer:
          "When changing careers, highlight transferable skills like leadership, communication, problem-solving, and project management. Use your professional summary to clearly state your career change goals, and tailor your work experience to emphasize relevant achievements. Consider adding a skills section that prominently features abilities applicable to your target industry.",
      },
      {
        question: "What should I remove from my resume to make it stronger?",
        answer:
          "Remove outdated information (like jobs from 15+ years ago), irrelevant experiences, objective statements (use a professional summary instead), references, personal information (like age or marital status), unprofessional email addresses, and generic skills (like 'hard worker'). Also, eliminate spelling errors, inconsistent formatting, and third-person language.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter questions based on search term
  const filteredFAQs = searchTerm
    ? faqData.map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      }))
    : faqData

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our resume tools and career advice.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Search Bar */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for questions..."
                  className="pl-10 py-6 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </motion.div>

            {/* FAQ Categories */}
            <div className="space-y-12">
              {filteredFAQs.map(
                (category, categoryIndex) =>
                  category.questions.length > 0 && (
                    <SectionTransition key={categoryIndex} delay={0.1 * categoryIndex}>
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                        <Accordion type="single" collapsible className="space-y-4">
                          {category.questions.map((faq, faqIndex) => (
                            <AccordionItem
                              key={faqIndex}
                              value={`${categoryIndex}-${faqIndex}`}
                              className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left font-medium">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">{faq.answer}</AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </SectionTransition>
                  ),
              )}

              {/* No results message */}
              {filteredFAQs.every((category) => category.questions.length === 0) && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-gray-600 text-lg">No questions found matching "{searchTerm}"</p>
                  <p className="text-gray-500 mt-2">Try a different search term or browse the categories</p>
                </motion.div>
              )}
            </div>

            {/* Still have questions */}
            <SectionTransition delay={0.4}>
              <div className="mt-16 p-8 bg-blue-50 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Still have questions?</h3>
                <p className="text-gray-600 mb-0">
                  If you couldn't find the answer to your question, feel free to contact us.
                </p>
              </div>
            </SectionTransition>
          </div>
        </div>
      </section>
    </div>
  )
}

