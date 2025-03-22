"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  BarChart,
  ChevronRight,
  FileUp,
  Zap,
  Award,
  Users,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import SectionTransition from "@/components/section-transition"

export default function CheckResumePage() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState("overview")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.type === "application/msword" ||
        droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setProgress(0)

    // Simulate analysis process with progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setAnalysisComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 150)
  }

  const handleTrySample = () => {
    setIsAnalyzing(true)
    setProgress(0)

    // Simulate analysis process for sample resume
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setAnalysisComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 150)
  }

  useEffect(() => {
    if (file) {
      handleAnalyze()
    }
  }, [file])

  return (
    <motion.div
      className="bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Check Your Resume</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your resume and our AI will analyze it against industry standards to provide actionable feedback.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {!file && !analysisComplete ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    className={`border-2 border-dashed p-10 ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200"} transition-colors duration-200`}
                  >
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                      <div
                        className="w-full h-full"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <motion.div
                          className="bg-blue-50 p-4 rounded-full w-fit mx-auto mb-6"
                          animate={{
                            scale: [1, 1.05, 1],
                            boxShadow: [
                              "0 0 0 rgba(59, 130, 246, 0)",
                              "0 0 20px rgba(59, 130, 246, 0.3)",
                              "0 0 0 rgba(59, 130, 246, 0)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                          }}
                        >
                          <Upload className="h-10 w-10 text-blue-600" />
                        </motion.div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">Drag & Drop Your Resume</h3>
                        <p className="text-gray-600 mb-6">Supported formats: PDF, DOCX, DOC</p>
                        <div className="flex flex-col items-center">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <label htmlFor="resume-upload">
                              <div className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md cursor-pointer transition-colors shadow-sm">
                                Browse Files
                              </div>
                              <input
                                id="resume-upload"
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                              />
                            </label>
                          </motion.div>
                          <div className="mt-8 pt-8 border-t border-gray-200 w-full">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                onClick={handleTrySample}
                                className="border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
                              >
                                Try Sample Resume
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-10 border border-gray-200 shadow-soft">
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                      <motion.div
                        className="mb-8"
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <FileUp className="h-16 w-16 text-blue-600" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-6 text-gray-900">Analyzing Your Resume...</h3>
                      <div className="w-full max-w-md mb-8">
                        <Progress value={progress} className="h-2 bg-gray-100" />
                        <p className="text-right text-sm text-gray-500 mt-2">{progress}%</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                        <div className="text-left">
                          <p className="text-sm text-gray-600">Checking format</p>
                          <p className="text-sm text-gray-600">Analyzing content</p>
                          <p className="text-sm text-gray-600">Evaluating keywords</p>
                          <p className="text-sm text-gray-600">Generating recommendations</p>
                        </div>
                        <div className="text-right">
                          <motion.p className="text-sm text-green-600" animate={{ opacity: progress >= 30 ? 1 : 0.5 }}>
                            {progress >= 30 ? "Complete" : "In progress..."}
                          </motion.p>
                          <motion.p
                            className="text-sm text-green-600"
                            animate={{ opacity: progress >= 60 ? 1 : progress >= 30 ? 0.8 : 0.5 }}
                          >
                            {progress >= 60 ? "Complete" : progress >= 30 ? "In progress..." : "Pending"}
                          </motion.p>
                          <motion.p
                            className="text-sm text-blue-600"
                            animate={{ opacity: progress >= 80 ? 1 : progress >= 60 ? 0.8 : 0.5 }}
                          >
                            {progress >= 80 ? "Complete" : progress >= 60 ? "In progress..." : "Pending"}
                          </motion.p>
                          <motion.p
                            className="text-sm text-gray-600"
                            animate={{ opacity: progress >= 90 ? 1 : progress >= 80 ? 0.8 : 0.5 }}
                          >
                            {progress >= 90 ? "Complete" : progress >= 80 ? "In progress..." : "Pending"}
                          </motion.p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <Card className="border border-gray-200 shadow-soft">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Resume Analysis Results</h3>
                        <motion.div
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          Score: 72/100
                        </motion.div>
                      </div>

                      <Tabs defaultValue="overview" value={activeSection} onValueChange={setActiveSection}>
                        <TabsList className="mb-6 bg-gray-100 p-1">
                          <TabsTrigger
                            value="overview"
                            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                          >
                            Overview
                          </TabsTrigger>
                          <TabsTrigger
                            value="content"
                            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                          >
                            Content
                          </TabsTrigger>
                          <TabsTrigger
                            value="format"
                            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                          >
                            Format
                          </TabsTrigger>
                          <TabsTrigger
                            value="keywords"
                            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                          >
                            Keywords
                          </TabsTrigger>
                        </TabsList>

                        <AnimatePresence mode="wait">
                          <TabsContent value="overview" key="overview">
                            <motion.div
                              className="space-y-6"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <motion.div
                                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-soft"
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <div className="text-2xl font-bold text-blue-600">72%</div>
                                  <div className="text-sm text-gray-600">Overall Score</div>
                                </motion.div>
                                <motion.div
                                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-soft"
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <div className="text-2xl font-bold text-green-600">85%</div>
                                  <div className="text-sm text-gray-600">Format</div>
                                </motion.div>
                                <motion.div
                                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-soft"
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <div className="text-2xl font-bold text-amber-600">68%</div>
                                  <div className="text-sm text-gray-600">Content</div>
                                </motion.div>
                                <motion.div
                                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-soft"
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.4 }}
                                >
                                  <div className="text-2xl font-bold text-red-600">62%</div>
                                  <div className="text-sm text-gray-600">Keywords</div>
                                </motion.div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Key Findings</h4>
                                <ul className="space-y-2">
                                  <motion.li
                                    className="flex items-start gap-2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                  >
                                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                      Your resume lacks quantifiable achievements in work experience
                                    </span>
                                  </motion.li>
                                  <motion.li
                                    className="flex items-start gap-2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                  >
                                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                      Skills section could be more comprehensive for your target role
                                    </span>
                                  </motion.li>
                                  <motion.li
                                    className="flex items-start gap-2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 }}
                                  >
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                      Good use of action verbs throughout your experience section
                                    </span>
                                  </motion.li>
                                  <motion.li
                                    className="flex items-start gap-2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 }}
                                  >
                                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                      Missing important industry keywords that could help with ATS systems
                                    </span>
                                  </motion.li>
                                </ul>
                              </div>
                            </motion.div>
                          </TabsContent>

                          <TabsContent value="content" key="content">
                            <motion.div
                              className="space-y-6"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Content Analysis</h4>
                                <p className="text-gray-700">
                                  Your resume content could be improved with more specific achievements and metrics.
                                </p>

                                <div className="space-y-4 mt-6">
                                  <motion.div
                                    className="border border-gray-200 rounded-lg p-4 shadow-soft"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <h5 className="font-medium text-gray-900">Work Experience</h5>
                                      <span className="text-amber-600 text-sm font-medium">Needs Improvement</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      Your work experience lacks quantifiable achievements. Add metrics and specific
                                      results.
                                    </p>
                                    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm">
                                      <p className="font-medium text-amber-800 mb-1">Suggestion:</p>
                                      <p className="text-gray-700">
                                        Instead of "Managed a team", try "Led a team of 5 developers, increasing
                                        productivity by 30%"
                                      </p>
                                    </div>
                                  </motion.div>

                                  <motion.div
                                    className="border border-gray-200 rounded-lg p-4 shadow-soft"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <h5 className="font-medium text-gray-900">Skills Section</h5>
                                      <span className="text-amber-600 text-sm font-medium">Needs Improvement</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      Your skills section could be more comprehensive for your target role.
                                    </p>
                                    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm">
                                      <p className="font-medium text-amber-800 mb-1">Suggestion:</p>
                                      <p className="text-gray-700">
                                        Add more technical skills relevant to your industry, such as specific software
                                        or methodologies.
                                      </p>
                                    </div>
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          </TabsContent>

                          <TabsContent value="format" key="format">
                            <motion.div
                              className="space-y-6"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Format Analysis</h4>
                                <p className="text-gray-700">
                                  Your resume format is generally good, with a few areas for improvement.
                                </p>

                                <div className="space-y-4 mt-6">
                                  <motion.div
                                    className="border border-gray-200 rounded-lg p-4 shadow-soft"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <h5 className="font-medium text-gray-900">Layout</h5>
                                      <span className="text-green-600 text-sm font-medium">Good</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      Your resume has a clean, professional layout that is easy to scan.
                                    </p>
                                  </motion.div>

                                  <motion.div
                                    className="border border-gray-200 rounded-lg p-4 shadow-soft"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <h5 className="font-medium text-gray-900">Length</h5>
                                      <span className="text-green-600 text-sm font-medium">Good</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      Your resume is an appropriate length at 1 page for your experience level.
                                    </p>
                                  </motion.div>

                                  <motion.div
                                    className="border border-gray-200 rounded-lg p-4 shadow-soft"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <h5 className="font-medium text-gray-900">Sections</h5>
                                      <span className="text-amber-600 text-sm font-medium">Needs Improvement</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      Consider reorganizing your sections to highlight your strengths.
                                    </p>
                                    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm">
                                      <p className="font-medium text-amber-800 mb-1">Suggestion:</p>
                                      <p className="text-gray-700">
                                        Move your skills section above your education section to highlight your
                                        technical abilities.
                                      </p>
                                    </div>
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          </TabsContent>

                          <TabsContent value="keywords" key="keywords">
                            <motion.div
                              className="space-y-6"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Keyword Analysis</h4>
                                <p className="text-gray-700">
                                  Your resume is missing some important keywords that could help with ATS systems.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                  <motion.div
                                    className="border border-gray-200 rounded-lg p-4 shadow-soft"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    <h5 className="font-medium text-gray-900 mb-3">Missing Keywords</h5>
                                    <ul className="space-y-2">
                                      <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <span className="text-sm text-gray-700">Project Management</span>
                                      </li>
                                      <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <span className="text-sm text-gray-700">Data Analysis</span>
                                      </li>
                                      <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <span className="text-sm text-gray-700">Cross-functional</span>
                                      </li>
                                      <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <span className="text-sm text-gray-700">Strategic Planning</span>
                                      </li>
                                    </ul>
                                  </motion.div>

                                  <motion.div
                                    className="border border-gray-200 rounded-lg p-4 shadow-soft"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    <h5 className="font-medium text-gray-900 mb-3">Present Keywords</h5>
                                    <ul className="space-y-2">
                                      <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm text-gray-700">Team Leadership</span>
                                      </li>
                                      <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm text-gray-700">Problem Solving</span>
                                      </li>
                                      <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm text-gray-700">Communication</span>
                                      </li>
                                      <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm text-gray-700">Customer Service</span>
                                      </li>
                                    </ul>
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          </TabsContent>
                        </AnimatePresence>
                      </Tabs>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        asChild
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                      >
                        <Link href="/build-resume">
                          Improve My Resume <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Download Analysis Report <FileText className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* How Our AI Works Section */}
      <SectionTransition>
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">How Our AI Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our advanced AI technology analyzes your resume in multiple dimensions to provide comprehensive
                feedback.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="absolute -top-4 -left-4 w-20 h-20 bg-blue-50 rounded-full z-0"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-4 -right-4 w-16 h-16 bg-teal-50 rounded-full z-0"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: 1,
                      }}
                    />
                    <div className="relative z-10 bg-white rounded-xl shadow-medium overflow-hidden border border-gray-200">
                      <Image
                        src="/resume4.png?height=400&width=400"
                        alt="AI Analysis Process"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </div>
                <div className="space-y-6">
                  <motion.div
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">Document Analysis</h3>
                      <p className="text-gray-600">
                        Our AI scans your resume and extracts key information about your experience, skills, education,
                        and achievements.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-teal-50 p-3 rounded-full flex-shrink-0">
                      <BarChart className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">Industry Benchmarking</h3>
                      <p className="text-gray-600">
                        We compare your resume against thousands of successful resumes in your industry to identify gaps
                        and opportunities.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-purple-50 p-3 rounded-full flex-shrink-0">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">ATS Optimization</h3>
                      <p className="text-gray-600">
                        Our system identifies missing keywords and formatting issues that might prevent your resume from
                        passing through Applicant Tracking Systems.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">Personalized Recommendations</h3>
                      <p className="text-gray-600">
                        Based on our analysis, we provide tailored suggestions to improve your resume's content, format,
                        and impact.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionTransition>

      {/* What We Check Section */}
      <SectionTransition>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">What We Check</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our comprehensive analysis evaluates every aspect of your resume to ensure it stands out to recruiters
                and ATS systems.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="bg-white rounded-xl p-6 shadow-soft border border-gray-200 hover:shadow-medium transition-all duration-300 h-full">
                    <div className="bg-blue-50 p-3 rounded-full w-fit mb-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900">Content Quality</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Professional summary</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Achievement-focused bullets</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Action verbs and power words</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Quantifiable results</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Relevant skills and qualifications</span>
                      </li>
                    </ul>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="bg-white rounded-xl p-6 shadow-soft border border-gray-200 hover:shadow-medium transition-all duration-300 h-full">
                    <div className="bg-teal-50 p-3 rounded-full w-fit mb-4">
                      <BarChart className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900">ATS Compatibility</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Industry-specific keywords</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Proper section headings</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>File format compatibility</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Text parsing issues</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Keyword density and placement</span>
                      </li>
                    </ul>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="bg-white rounded-xl p-6 shadow-soft border border-gray-200 hover:shadow-medium transition-all duration-300 h-full">
                    <div className="bg-purple-50 p-3 rounded-full w-fit mb-4">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900">Visual Design</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Layout and formatting</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Readability and white space</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Font consistency and size</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Section organization</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Professional appearance</span>
                      </li>
                    </ul>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </SectionTransition>

      {/* Industry Benchmarks */}
      <SectionTransition>
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Industry Benchmarks</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See how your resume compares to industry standards across key metrics.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-white rounded-xl shadow-soft border border-gray-200">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4 text-gray-900">Resume Length</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Entry Level</span>
                            <span className="text-sm text-gray-600">1 page</span>
                          </div>
                          <motion.div
                            className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                          >
                            <motion.div
                              className="bg-blue-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: "100%" }}
                              transition={{ duration: 1, delay: 0.2 }}
                              viewport={{ once: true }}
                            />
                          </motion.div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Mid-Level</span>
                            <span className="text-sm text-gray-600">1-2 pages</span>
                          </div>
                          <motion.div
                            className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                          >
                            <motion.div
                              className="bg-blue-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: "75%" }}
                              transition={{ duration: 1, delay: 0.3 }}
                              viewport={{ once: true }}
                            />
                          </motion.div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Executive</span>
                            <span className="text-sm text-gray-600">2-3 pages</span>
                          </div>
                          <motion.div
                            className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                          >
                            <motion.div
                              className="bg-blue-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: "50%" }}
                              transition={{ duration: 1, delay: 0.4 }}
                              viewport={{ once: true }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-4 text-gray-900">Keyword Optimization</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Technology</span>
                            <span className="text-sm text-gray-600">15-20 keywords</span>
                          </div>
                          <motion.div
                            className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                          >
                            <motion.div
                              className="bg-teal-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: "85%" }}
                              transition={{ duration: 1, delay: 0.2 }}
                              viewport={{ once: true }}
                            />
                          </motion.div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Marketing</span>
                            <span className="text-sm text-gray-600">12-18 keywords</span>
                          </div>
                          <motion.div
                            className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                          >
                            <motion.div
                              className="bg-teal-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: "70%" }}
                              transition={{ duration: 1, delay: 0.3 }}
                              viewport={{ once: true }}
                            />
                          </motion.div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Finance</span>
                            <span className="text-sm text-gray-600">10-15 keywords</span>
                          </div>
                          <motion.div
                            className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                          >
                            <motion.div
                              className="bg-teal-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: "60%" }}
                              transition={{ duration: 1, delay: 0.4 }}
                              viewport={{ once: true }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">Quantifiable Achievements</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <motion.div
                        className="bg-blue-50 p-4 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <div className="text-2xl font-bold text-blue-600 mb-1">75%</div>
                        <p className="text-sm text-gray-600">
                          of successful resumes include at least 3-5 quantifiable achievements
                        </p>
                      </motion.div>
                      <motion.div
                        className="bg-teal-50 p-4 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="text-2xl font-bold text-teal-600 mb-1">68%</div>
                        <p className="text-sm text-gray-600">
                          of hiring managers prioritize resumes with metrics and results
                        </p>
                      </motion.div>
                      <motion.div
                        className="bg-purple-50 p-4 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                      >
                        <div className="text-2xl font-bold text-purple-600 mb-1">2x</div>
                        <p className="text-sm text-gray-600">
                          higher interview rate for resumes with quantified achievements
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </SectionTransition>

      {/* Final CTA */}
      <SectionTransition>
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Optimize Your Resume?</h2>
              <p className="text-xl mb-8 text-gray-600">Upload your resume now and get detailed feedback in minutes.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
                    <a href="#top">
                      Check My Resume <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    <Link href="/build-resume">
                      Build New Resume <FileText className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </SectionTransition>
    </motion.div>
  )
}

