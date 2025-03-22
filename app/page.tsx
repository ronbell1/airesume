"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, FileText, Zap, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import ParticlesBackground from "@/components/particles-background";
import SectionTransition from "@/components/section-transition";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-white overflow-hidden">
        <ParticlesBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-3 py-1 mb-6 text-sm font-medium text-blue-700 bg-blue-50 rounded-full"
            >
              Free AI-Powered Resume Tool
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 animated-gradient-text">
                Elevate Your Career
              </span>{" "}
              with AI-Powered Resume Tools
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-10 text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our AI analyzes your resume against industry standards and helps
              you build a standout CV that gets you noticed by recruiters.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                >
                  <Link href="/check-resume">
                    Check My Resume <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
            </motion.div>
          </div>
        </div>

        <div className="hidden lg:block">
          {/* First Resume Image with enhanced 3D */}
          <motion.div
            className="absolute top-1/4 left-16 w-64 h-64"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              perspective: "1500px",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              className="relative w-full h-full rounded-lg shadow-2xl"
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
              }}
              animate={{
                rotateX: [5, -5, 5],
                rotateY: [-8, 8, -8],
                rotateZ: [-1, 1, -1],
                z: [0, 20, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 10,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.1,
                rotateY: 25,
                rotateX: -10,
                z: 50,
                transition: { duration: 0.5 },
              }}
            >
              {/* Main image */}
              <div
                className="w-full h-full rounded-lg overflow-hidden transform-gpu"
                style={{ transform: "translateZ(20px)" }}
              >
                <Image
                  src="/resume1.png?height=256&width=256"
                  alt="Resume example"
                  width={256}
                  height={256}
                  className="object-cover"
                />
              </div>

              {/* 3D shadow effect */}
              <div
                className="absolute inset-0 rounded-lg bg-black/20 blur-md"
                style={{
                  transform:
                    "translateZ(-20px) translateX(10px) translateY(10px)",
                }}
              />

              {/* Lighting effect */}
              <div
                className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/30 via-transparent to-black/30"
                style={{ transform: "translateZ(25px)" }}
              />

              {/* Edge highlight */}
              <div
                className="absolute -right-1 top-0 bottom-0 w-1 bg-white/40"
                style={{ transform: "translateZ(15px) rotateY(-30deg)" }}
              />
            </motion.div>
          </motion.div>

          {/* Second Resume Image with enhanced 3D */}
          <motion.div
            className="absolute top-1/3 right-16 w-72 h-72"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              perspective: "1500px",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              className="relative w-full h-full rounded-lg shadow-2xl"
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
              }}
              animate={{
                rotateX: [-7, 7, -7],
                rotateY: [10, -10, 10],
                rotateZ: [2, -2, 2],
                z: [0, 30, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 12,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.1,
                rotateY: -25,
                rotateX: 10,
                z: 50,
                transition: { duration: 0.5 },
              }}
            >
              {/* Main image */}
              <div
                className="w-full h-full rounded-lg overflow-hidden transform-gpu"
                style={{ transform: "translateZ(25px)" }}
              >
                <Image
                  src="/resume2.jpg?height=288&width=288"
                  alt="Professional at interview"
                  width={288}
                  height={288}
                  className="object-cover"
                />
              </div>

              {/* 3D shadow effect */}
              <div
                className="absolute inset-0 rounded-lg bg-black/20 blur-md"
                style={{
                  transform:
                    "translateZ(-25px) translateX(-12px) translateY(12px)",
                }}
              />

              {/* Lighting effect */}
              <div
                className="absolute inset-0 rounded-lg bg-gradient-to-tl from-white/30 via-transparent to-black/30"
                style={{ transform: "translateZ(30px)" }}
              />

              {/* Edge highlight */}
              <div
                className="absolute -left-1 top-0 bottom-0 w-1 bg-white/40"
                style={{ transform: "translateZ(20px) rotateY(30deg)" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <SectionTransition>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Powerful Resume Tools
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our suite of AI-powered tools helps you create, optimize, and
                track your resume's performance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-white rounded-xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 h-full">
                  <div className="bg-blue-50 p-3 rounded-full w-fit mb-6">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    AI Resume Analysis
                  </h3>
                  <p className="text-gray-600">
                    Our AI engine analyzes your resume against industry
                    standards and provides actionable feedback to improve your
                    chances.
                  </p>
                </Card>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-white rounded-xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 h-full">
                  <div className="bg-teal-50 p-3 rounded-full w-fit mb-6">
                    <FileText className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    Smart Resume Builder
                  </h3>
                  <p className="text-gray-600">
                    Build a professional resume with our intuitive builder that
                    offers real-time suggestions and formatting.
                  </p>
                </Card>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-white rounded-xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 h-full">
                  <div className="bg-purple-50 p-3 rounded-full w-fit mb-6">
                    <BarChart className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    Keyword Optimization
                  </h3>
                  <p className="text-gray-600">
                    Optimize your resume with industry-specific keywords that
                    help you pass through Applicant Tracking Systems.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </SectionTransition>

      {/* How It Works */}
      <SectionTransition>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our simple process helps you improve your resume in minutes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="relative mb-6 mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-sm">
                    1
                  </div>
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-blue-200 -z-10"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Upload Your Resume
                </h3>
                <p className="text-gray-600">
                  Upload your existing resume or start from scratch with our
                  templates.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative mb-6 mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-sm">
                    2
                  </div>
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-blue-200 -z-10"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  AI Analysis
                </h3>
                <p className="text-gray-600">
                  Our AI analyzes your resume and provides personalized
                  recommendations.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="mb-6 mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-sm">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Improve & Download
                </h3>
                <p className="text-gray-600">
                  Make the suggested improvements and download your optimized
                  resume.
                </p>
              </motion.div>
            </div>

            {/* Process visualization */}
            <motion.div
              className="mt-20 max-w-4xl mx-auto bg-white rounded-xl shadow-medium overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">
                  Resume Analysis Process
                </h3>
              </div>
              <div className="p-6">
                <div className="relative">
                  <motion.div
                    className="flex items-center mb-12"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                      1
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">
                        Document Parsing
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Our AI extracts and categorizes information from your
                        resume
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </motion.div>

                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>

                  <motion.div
                    className="flex items-center mb-12"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-medium">
                      2
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">
                        Content Analysis
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        We analyze your experience, skills, and achievements
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-teal-50 rounded-lg flex items-center justify-center">
                      <BarChart className="h-8 w-8 text-teal-500" />
                    </div>
                  </motion.div>

                  <div className="absolute left-6 top-28 w-0.5 h-16 bg-gray-200"></div>

                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
                      3
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">
                        Recommendations
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Get personalized suggestions to improve your resume
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-purple-50 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-purple-500" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </SectionTransition>

      {/* Before/After Section */}
      <SectionTransition>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Transform Your Resume
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See the difference our AI-powered tools can make to your resume.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">Before</h3>
                  </div>
                  <div className="p-6">
                    <div className="aspect-[1/1.4] bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                      <Image
                        src="/resume3.jpg?height=400&width=300"
                        alt="Resume before optimization"
                        width={300}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Issues Identified:
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-red-500 mt-0.5">✕</span>
                          <span>Generic objective statement</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-red-500 mt-0.5">✕</span>
                          <span>Missing quantifiable achievements</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-red-500 mt-0.5">✕</span>
                          <span>Poor formatting and readability</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-red-500 mt-0.5">✕</span>
                          <span>Lack of relevant keywords</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="relative bg-blue-50 rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                   <div className="absolute inset-0 rounded-lg bg-blue-300 blur-[90px] opacity-30 pointer-events-none"></div>
                 
                  {/* Header */}
                  <div className="p-4 bg-blue-100 border-b border-gray-300">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      After
                    </h3>
                  </div>

                  {/* Image + Content */}
                  <div className="p-6 relative z-10">
                    <div className="relative aspect-[1/1.4] bg-white border border-gray-300 rounded-md overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
                      <Image
                        src="/resume-fixed.webp?height=400&width=100"
                        alt="Resume after optimization"
                        width={300}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Improvements */}
                    <div className="mt-5">
                      <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                        Improvements Made:
                      </h4>
                      <ul className="space-y-3 text-gray-700 text-[15px] leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 font-bold">✓</span>
                          <span>Targeted professional summary</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 font-bold">✓</span>
                          <span>Added quantifiable metrics & results</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 font-bold">✓</span>
                          <span>Cleaner, ATS-friendly formatting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 font-bold">✓</span>
                          <span>Optimized with industry-specific keywords</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </SectionTransition>

      {/* Final CTA */}
      <SectionTransition>
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 pattern-grid opacity-30" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Ready to Upgrade Your Resume?
              </h2>
              <p className="text-xl mb-10 text-gray-600">
                Join thousands of job seekers who have improved their chances
                with our free AI tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                  >
                    <Link href="/sign-up">
                      Get Started For Free{" "}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    <Link href="/check-resume">
                      Check My Resume <FileText className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </SectionTransition>
    </div>
  );
}
