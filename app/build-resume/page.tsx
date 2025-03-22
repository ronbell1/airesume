"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Download, Save, Plus, Trash2, Lightbulb, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Template data
const templates = [
  {
    id: "modern",
    name: "Modern",
    image: "/modern.png?height=400&width=300",
    description: "Clean and contemporary design with a focus on skills and experience.",
  },
  {
    id: "professional",
    name: "Professional",
    image: "/pro.svg?height=400&width=300",
    description: "Traditional layout ideal for corporate and executive positions.",
  },
  {
    id: "creative",
    name: "Creative",
    image: "/creative.webp?height=400&width=300",
    description: "Bold design with visual elements for creative industry roles.",
  },
  {
    id: "minimal",
    name: "Minimal",
    image: "/minimal.png?height=400&width=300",
    description: "Simple and elegant design that focuses on content.",
  },
]

export default function BuildResumePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [activeSection, setActiveSection] = useState("personal")
  const [progress, setProgress] = useState(20)
  const [formData, setFormData] = useState({
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      title: "",
      linkedin: "",
    },
    summary: {
      text: "",
    },
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],
    education: [
      {
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
      },
    ],
    skills: [{ name: "", level: "Beginner" }],
    projects: [
      {
        name: "",
        description: "",
        url: "",
        technologies: "",
      },
    ],
  })

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section as keyof typeof formData],
        [field]: value,
      },
    })
    updateProgress()
  }

  const handleArrayInputChange = (section: string, index: number, field: string, value: string) => {
    const newArray = [...(formData[section as keyof typeof formData] as any[])]
    newArray[index] = { ...newArray[index], [field]: value }

    setFormData({
      ...formData,
      [section]: newArray,
    })
    updateProgress()
  }

  const addArrayItem = (section: string) => {
    const emptyItem = getEmptyItem(section)
    const newArray = [...(formData[section as keyof typeof formData] as any[]), emptyItem]

    setFormData({
      ...formData,
      [section]: newArray,
    })
  }

  const removeArrayItem = (section: string, index: number) => {
    const newArray = [...(formData[section as keyof typeof formData] as any[])]
    newArray.splice(index, 1)

    setFormData({
      ...formData,
      [section]: newArray,
    })
  }

  const getEmptyItem = (section: string) => {
    switch (section) {
      case "experience":
        return { company: "", position: "", startDate: "", endDate: "", current: false, description: "" }
      case "education":
        return { institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }
      case "skills":
        return { name: "", level: "Beginner" }
      case "projects":
        return { name: "", description: "", url: "", technologies: "" }
      default:
        return {}
    }
  }

  const updateProgress = () => {
    // Calculate progress based on filled fields
    let filledFields = 0
    let totalFields = 0

    // Count personal fields
    Object.values(formData.personal).forEach((value) => {
      totalFields++
      if (value) filledFields++
    })

    // Count summary
    totalFields++
    if (formData.summary.text) filledFields++

    // Count experience fields
    formData.experience.forEach((exp) => {
      Object.values(exp).forEach((value) => {
        totalFields++
        if (value) filledFields++
      })
    })

    // Count education fields
    formData.education.forEach((edu) => {
      Object.values(edu).forEach((value) => {
        totalFields++
        if (value) filledFields++
      })
    })

    // Count skills
    formData.skills.forEach((skill) => {
      Object.values(skill).forEach((value) => {
        totalFields++
        if (value) filledFields++
      })
    })

    // Count projects
    formData.projects.forEach((project) => {
      Object.values(project).forEach((value) => {
        totalFields++
        if (value) filledFields++
      })
    })

    const calculatedProgress = Math.round((filledFields / totalFields) * 100)
    setProgress(calculatedProgress)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Build Your Resume</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create a professional resume with our intuitive builder and AI-powered suggestions.
        </p>
      </div>

      {/* Template Selection */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Choose a Template</h2>
        <div className="relative">
          <div className="flex overflow-x-auto gap-6 pb-4 snap-x">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`snap-start flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  selectedTemplate.id === template.id ? "ring-4 ring-blue-600 scale-105" : "hover:scale-105"
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="w-60 bg-card rounded-lg overflow-hidden border border-border">
                  <div className="relative h-80 w-full">
                    <Image
                      src={template.image || "/placeholder.svg"}
                      alt={template.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-6 bg-muted">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Resume Information</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{progress}% Complete</span>
                  <Progress value={progress} className="w-24 h-2" />
                </div>
              </div>
            </div>

            <Tabs value={activeSection} onValueChange={setActiveSection} className="p-6">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.personal.firstName}
                      onChange={(e) => handleInputChange("personal", "firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.personal.lastName}
                      onChange={(e) => handleInputChange("personal", "lastName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Software Engineer"
                      value={formData.personal.title}
                      onChange={(e) => handleInputChange("personal", "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.personal.email}
                      onChange={(e) => handleInputChange("personal", "email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.personal.phone}
                      onChange={(e) => handleInputChange("personal", "phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={formData.personal.location}
                      onChange={(e) => handleInputChange("personal", "location", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.personal.linkedin}
                      onChange={(e) => handleInputChange("personal", "linkedin", e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Summary */}
              <TabsContent value="summary" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    placeholder="Write a compelling summary of your professional background and goals..."
                    className="min-h-32"
                    value={formData.summary.text}
                    onChange={(e) => handleInputChange("summary", "text", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    A strong summary highlights your key qualifications and career goals in 3-5 sentences.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 flex gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">AI Suggestion</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Include specific skills relevant to the job you're applying for. Quantify your experience with
                      numbers when possible (e.g., "5+ years of experience" or "Led a team of 10").
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Work Experience */}
              <TabsContent value="experience" className="space-y-6">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="space-y-6 pb-6 border-b border-border">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Experience {index + 1}</h3>
                      {formData.experience.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeArrayItem("experience", index)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`company-${index}`}>Company</Label>
                        <Input
                          id={`company-${index}`}
                          value={exp.company}
                          onChange={(e) => handleArrayInputChange("experience", index, "company", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`position-${index}`}>Position</Label>
                        <Input
                          id={`position-${index}`}
                          value={exp.position}
                          onChange={(e) => handleArrayInputChange("experience", index, "position", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                        <Input
                          id={`startDate-${index}`}
                          placeholder="MM/YYYY"
                          value={exp.startDate}
                          onChange={(e) => handleArrayInputChange("experience", index, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${index}`}>End Date</Label>
                        <Input
                          id={`endDate-${index}`}
                          placeholder="MM/YYYY or Present"
                          value={exp.endDate}
                          onChange={(e) => handleArrayInputChange("experience", index, "endDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <Textarea
                          id={`description-${index}`}
                          placeholder="Describe your responsibilities and achievements..."
                          className="min-h-32"
                          value={exp.description}
                          onChange={(e) => handleArrayInputChange("experience", index, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => addArrayItem("experience")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Experience
                </Button>
              </TabsContent>

              {/* Education */}
              <TabsContent value="education" className="space-y-6">
                {formData.education.map((edu, index) => (
                  <div key={index} className="space-y-6 pb-6 border-b border-border">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Education {index + 1}</h3>
                      {formData.education.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeArrayItem("education", index)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`institution-${index}`}>Institution</Label>
                        <Input
                          id={`institution-${index}`}
                          value={edu.institution}
                          onChange={(e) => handleArrayInputChange("education", index, "institution", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`degree-${index}`}>Degree</Label>
                        <Input
                          id={`degree-${index}`}
                          placeholder="e.g. Bachelor of Science"
                          value={edu.degree}
                          onChange={(e) => handleArrayInputChange("education", index, "degree", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`field-${index}`}>Field of Study</Label>
                        <Input
                          id={`field-${index}`}
                          placeholder="e.g. Computer Science"
                          value={edu.field}
                          onChange={(e) => handleArrayInputChange("education", index, "field", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`gpa-${index}`}>GPA (Optional)</Label>
                        <Input
                          id={`gpa-${index}`}
                          placeholder="e.g. 3.8/4.0"
                          value={edu.gpa}
                          onChange={(e) => handleArrayInputChange("education", index, "gpa", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`eduStartDate-${index}`}>Start Date</Label>
                        <Input
                          id={`eduStartDate-${index}`}
                          placeholder="MM/YYYY"
                          value={edu.startDate}
                          onChange={(e) => handleArrayInputChange("education", index, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`eduEndDate-${index}`}>End Date</Label>
                        <Input
                          id={`eduEndDate-${index}`}
                          placeholder="MM/YYYY or Present"
                          value={edu.endDate}
                          onChange={(e) => handleArrayInputChange("education", index, "endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => addArrayItem("education")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Education
                </Button>
              </TabsContent>

              {/* Skills */}
              <TabsContent value="skills" className="space-y-6">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Skill name (e.g. JavaScript, Project Management)"
                        value={skill.name}
                        onChange={(e) => handleArrayInputChange("skills", index, "name", e.target.value)}
                      />
                    </div>
                    <select
                      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={skill.level}
                      onChange={(e) => handleArrayInputChange("skills", index, "level", e.target.value)}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    {formData.skills.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeArrayItem("skills", index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => addArrayItem("skills")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Skill
                </Button>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 flex gap-3 mt-6">
                  <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">AI Suggestion</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Based on your experience, consider adding these relevant skills:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                        Data Analysis
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                        Project Management
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                        Team Leadership
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Projects */}
              <TabsContent value="projects" className="space-y-6">
                {formData.projects.map((project, index) => (
                  <div key={index} className="space-y-6 pb-6 border-b border-border">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Project {index + 1}</h3>
                      {formData.projects.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeArrayItem("projects", index)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`projectName-${index}`}>Project Name</Label>
                        <Input
                          id={`projectName-${index}`}
                          value={project.name}
                          onChange={(e) => handleArrayInputChange("projects", index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`projectUrl-${index}`}>URL (Optional)</Label>
                        <Input
                          id={`projectUrl-${index}`}
                          placeholder="https://..."
                          value={project.url}
                          onChange={(e) => handleArrayInputChange("projects", index, "url", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`technologies-${index}`}>Technologies Used</Label>
                        <Input
                          id={`technologies-${index}`}
                          placeholder="e.g. React, Node.js, MongoDB"
                          value={project.technologies}
                          onChange={(e) => handleArrayInputChange("projects", index, "technologies", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`projectDescription-${index}`}>Description</Label>
                        <Textarea
                          id={`projectDescription-${index}`}
                          placeholder="Describe the project, your role, and achievements..."
                          className="min-h-24"
                          value={project.description}
                          onChange={(e) => handleArrayInputChange("projects", index, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => addArrayItem("projects")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Project
                </Button>
              </TabsContent>
            </Tabs>

            <div className="p-6 border-t border-border bg-muted flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  const currentIndex = ["personal", "summary", "experience", "education", "skills", "projects"].indexOf(
                    activeSection,
                  )
                  if (currentIndex > 0) {
                    setActiveSection(
                      ["personal", "summary", "experience", "education", "skills", "projects"][currentIndex - 1],
                    )
                  }
                }}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={() => {
                    const currentIndex = [
                      "personal",
                      "summary",
                      "experience",
                      "education",
                      "skills",
                      "projects",
                    ].indexOf(activeSection)
                    if (currentIndex < 5) {
                      setActiveSection(
                        ["personal", "summary", "experience", "education", "skills", "projects"][currentIndex + 1],
                      )
                    }
                  }}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-4 bg-muted">
                <h3 className="font-bold">Resume Preview</h3>
              </div>
              <div className="p-4">
                <div className="bg-white aspect-[1/1.4] rounded border border-border overflow-hidden shadow-md">
                  <div className="p-6 h-full flex flex-col">
                    {/* Preview content based on template and form data */}
                    <div className="text-center mb-4">
                      <h2 className="text-xl font-bold">
                        {formData.personal.firstName || "Your"} {formData.personal.lastName || "Name"}
                      </h2>
                      <p className="text-sm text-muted-foreground">{formData.personal.title || "Professional Title"}</p>
                      <div className="text-xs mt-2 flex justify-center gap-2 flex-wrap">
                        {formData.personal.email && <span>{formData.personal.email}</span>}
                        {formData.personal.phone && <span>{formData.personal.phone}</span>}
                        {formData.personal.location && <span>{formData.personal.location}</span>}
                      </div>
                    </div>

                    <div className="text-xs space-y-3 flex-1 overflow-hidden">
                      {/* Summary */}
                      {formData.summary.text && (
                        <div>
                          <h3 className="font-bold text-sm border-b pb-1 mb-1">Summary</h3>
                          <p className="line-clamp-3">{formData.summary.text}</p>
                        </div>
                      )}

                      {/* Experience */}
                      {formData.experience.some((exp) => exp.company || exp.position) && (
                        <div>
                          <h3 className="font-bold text-sm border-b pb-1 mb-1">Experience</h3>
                          <div className="space-y-2">
                            {formData.experience.map(
                              (exp, i) =>
                                (exp.company || exp.position) && (
                                  <div key={i} className="line-clamp-2">
                                    <div className="flex justify-between">
                                      <span className="font-medium">{exp.position || "Position"}</span>
                                      <span>
                                        {exp.startDate} - {exp.endDate || "Present"}
                                      </span>
                                    </div>
                                    <div>{exp.company || "Company"}</div>
                                  </div>
                                ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {formData.education.some((edu) => edu.institution || edu.degree) && (
                        <div>
                          <h3 className="font-bold text-sm border-b pb-1 mb-1">Education</h3>
                          <div className="space-y-2">
                            {formData.education.map(
                              (edu, i) =>
                                (edu.institution || edu.degree) && (
                                  <div key={i} className="line-clamp-2">
                                    <div className="flex justify-between">
                                      <span className="font-medium">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                      </span>
                                      <span>
                                        {edu.startDate} - {edu.endDate || "Present"}
                                      </span>
                                    </div>
                                    <div>{edu.institution}</div>
                                  </div>
                                ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {formData.skills.some((skill) => skill.name) && (
                        <div>
                          <h3 className="font-bold text-sm border-b pb-1 mb-1">Skills</h3>
                          <div className="flex flex-wrap gap-1">
                            {formData.skills.map(
                              (skill, i) =>
                                skill.name && (
                                  <span key={i} className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                    {skill.name}
                                  </span>
                                ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-border">
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>

            {/* Tips */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">Resume Tips</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Use action verbs to describe your experience</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Quantify achievements with numbers when possible</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Keep your resume to 1-2 pages maximum</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Tailor your resume for each job application</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

