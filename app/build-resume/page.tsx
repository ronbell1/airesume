"use client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useRef } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Save,
  Plus,
  Trash2,
  Lightbulb,
  CheckCircle,
  FileText,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSession } from "@/lib/auth-client";

// Template data
const templates = [
  {
    id: "modern",
    name: "Modern",
    image: "/modern.png?height=400&width=300",
    description:
      "Clean and contemporary design with a focus on skills and experience.",
  },
  {
    id: "professional",
    name: "Professional",
    image: "/pro.svg?height=400&width=300",
    description:
      "Traditional layout ideal for corporate and executive positions.",
  },
  {
    id: "creative",
    name: "Creative",
    image: "/creative.webp?height=400&width=300",
    description:
      "Bold design with visual elements for creative industry roles.",
  },
  {
    id: "minimal",
    name: "Minimal",
    image: "/minimal.png?height=400&width=300",
    description: "Simple and elegant design that focuses on content.",
  },
];

export default function BuildResumePage() {
  const session = useSession();
  const { toast } = useToast();
  const [userId] = useState(session.data?.user.id);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [activeSection, setActiveSection] = useState("personal");
  const [progress, setProgress] = useState(20);
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
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<
    "pdf" | "docx" | "html" | null
  >(null);
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  const loadResumeDraft = async (id: string) => {
    try {
      const response = await fetch(`/api/resume?id=${id}`);

      if (!response.ok) {
        throw new Error("Failed to load resume");
      }

      const resume = await response.json();

      // Update all the form state with the loaded dataR
      setFormData({
        personal: resume.personal,
        summary: resume.summary,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        projects: resume.projects,
      });

      // Find and set the selected template
      const template =
        templates.find((t) => t.id === resume.templateId) || templates[0];
      setSelectedTemplate(template);

      // Set the active section and progress
      setActiveSection(resume.lastActiveStep);
      setProgress(resume.progress);

      // Set the resume ID
      setResumeId(resume.id);

      toast({
        title: "Resume loaded",
        description: "Your resume draft has been loaded successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error loading resume:", error);
      toast({
        title: "Failed to load resume",
        description:
          "There was an error loading your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          selectedTemplate,
          activeSection,
          progress,
          resumeId, // Include existing ID if available
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save resume");
      }

      const savedResume = await response.json();

      // Update the resumeId state with the ID of the saved resume
      setResumeId(savedResume.id);

      toast({
        title: "Resume saved",
        description: "Your resume draft has been saved successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving resume:", error);
      toast({
        title: "Failed to save",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section as keyof typeof formData],
        [field]: value,
      },
    });
    updateProgress();
  };

  const handleArrayInputChange = (
    section: string,
    index: number,
    field: string,
    value: string
  ) => {
    const newArray = [...(formData[section as keyof typeof formData] as any[])];
    newArray[index] = { ...newArray[index], [field]: value };

    setFormData({
      ...formData,
      [section]: newArray,
    });
    updateProgress();
  };

  const addArrayItem = (section: string) => {
    const emptyItem = getEmptyItem(section);
    const newArray = [
      ...(formData[section as keyof typeof formData] as any[]),
      emptyItem,
    ];

    setFormData({
      ...formData,
      [section]: newArray,
    });
  };

  const removeArrayItem = (section: string, index: number) => {
    const newArray = [...(formData[section as keyof typeof formData] as any[])];
    newArray.splice(index, 1);

    setFormData({
      ...formData,
      [section]: newArray,
    });
  };

  const getEmptyItem = (section: string) => {
    switch (section) {
      case "experience":
        return {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        };
      case "education":
        return {
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          gpa: "",
        };
      case "skills":
        return { name: "", level: "Beginner" };
      case "projects":
        return { name: "", description: "", url: "", technologies: "" };
      default:
        return {};
    }
  };

  const updateProgress = () => {
    // Calculate progress based on filled fields
    let filledFields = 0;
    let totalFields = 0;

    // Count personal fields
    Object.values(formData.personal).forEach((value) => {
      totalFields++;
      if (value) filledFields++;
    });

    // Count summary
    totalFields++;
    if (formData.summary.text) filledFields++;

    // Count experience fields
    formData.experience.forEach((exp) => {
      Object.values(exp).forEach((value) => {
        totalFields++;
        if (value) filledFields++;
      });
    });

    // Count education fields
    formData.education.forEach((edu) => {
      Object.values(edu).forEach((value) => {
        totalFields++;
        if (value) filledFields++;
      });
    });

    // Count skills
    formData.skills.forEach((skill) => {
      Object.values(skill).forEach((value) => {
        totalFields++;
        if (value) filledFields++;
      });
    });

    // Count projects
    formData.projects.forEach((project) => {
      Object.values(project).forEach((value) => {
        totalFields++;
        if (value) filledFields++;
      });
    });

    const calculatedProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(calculatedProgress);
  };

  const handleDownload = async (format: "pdf" | "docx" | "html") => {
    try {
      setIsDownloading(true);
      setDownloadFormat(format);

      const fileName = `${formData.personal.firstName || "Resume"}_${
        formData.personal.lastName || ""
      }_${selectedTemplate.id}`.replace(/\s+/g, "_");

      switch (format) {
        case "pdf":
          await downloadAsPDF(fileName);
          break;
        case "docx":
          await downloadAsDocx(fileName);
          break;
        case "html":
          downloadAsHTML(fileName);
          break;
      }

      toast({
        title: "Download complete",
        description: `Your resume has been downloaded as ${format.toUpperCase()}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast({
        title: "Download failed",
        description:
          "There was an error downloading your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
      setDownloadFormat(null);
    }
  };

  const downloadAsPDF = async (fileName: string) => {
    if (!resumePreviewRef.current) return;

    // Apply specific styling for the selected template before capturing
    applyTemplateSpecificStyles(selectedTemplate.id);

    const canvas = await html2canvas(resumePreviewRef.current, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // A4 dimensions in mm (210 x 297)
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${fileName}.pdf`);

    // Reset any template-specific styles
    resetTemplateStyles();
  };

  const downloadAsDocx = async (fileName: string) => {
    // Create a new document with template-specific styling
    const docxStyles = {
      modern: {
        fontFamily: "Segoe UI",
        headingColor: "#2563eb",
        bulletStyle: "•",
      },
      professional: {
        fontFamily: "Times New Roman",
        headingColor: "#1e3a8a",
        bulletStyle: "•",
      },
      creative: {
        fontFamily: "Calibri",
        headingColor: "#764ba2",
        bulletStyle: "○",
      },
      minimal: {
        fontFamily: "Arial",
        headingColor: "#6b7280",
        bulletStyle: "-",
      },
    };

    const style = docxStyles[selectedTemplate.id as keyof typeof docxStyles];

    // Create a new document
    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 28,
              bold: true,
              color: style.headingColor,
              font: style.fontFamily,
            },
            paragraph: {
              spacing: {
                after: 120,
              },
              alignment: AlignmentType.CENTER,
            },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 24,
              bold: true,
              color: style.headingColor,
              font: style.fontFamily,
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
            },
          },
        ],
      },
      sections: [
        {
          properties: {},
          children: [
            // Header with name and title
            new Paragraph({
              text: `${formData.personal.firstName} ${formData.personal.lastName}`,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: formData.personal.title,
              alignment: AlignmentType.CENTER,
            }),

            // Contact info
            new Paragraph({
              text: `${formData.personal.email} | ${formData.personal.phone} | ${formData.personal.location}`,
              alignment: AlignmentType.CENTER,
            }),

            // Summary
            ...(formData.summary.text
              ? [
                  new Paragraph({
                    text:
                      selectedTemplate.id === "minimal" ? "ABOUT" : "SUMMARY",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  new Paragraph({
                    text: formData.summary.text,
                  }),
                ]
              : []),

            // Experience
            ...(formData.experience.length > 0
              ? [
                  new Paragraph({
                    text: "EXPERIENCE",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  ...formData.experience.flatMap((exp) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: exp.position,
                          bold: true,
                        }),
                        new TextRun({
                          text: ` at ${exp.company}`,
                        }),
                      ],
                    }),
                    new Paragraph({
                      text: `${exp.startDate} - ${exp.endDate || "Present"}`,
                    }),
                    ...(exp.description
                      ? exp.description.split("\n").map(
                          (line) =>
                            new Paragraph({
                              text: `${style.bulletStyle} ${line}`,
                              indent: {
                                left: 360,
                                hanging: 180,
                              },
                            })
                        )
                      : []),
                    new Paragraph({}), // Empty paragraph for spacing
                  ]),
                ]
              : []),

            // Education
            ...(formData.education.length > 0
              ? [
                  new Paragraph({
                    text: "EDUCATION",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  ...formData.education.flatMap((edu) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: edu.degree,
                          bold: true,
                        }),
                        new TextRun({
                          text: edu.field ? ` in ${edu.field}` : "",
                        }),
                      ],
                    }),
                    new Paragraph({
                      text: edu.institution,
                    }),
                    new Paragraph({
                      text: `${edu.startDate} - ${edu.endDate || "Present"}`,
                    }),
                    ...(edu.gpa
                      ? [
                          new Paragraph({
                            text: `GPA: ${edu.gpa}`,
                          }),
                        ]
                      : []),
                    new Paragraph({}), // Empty paragraph for spacing
                  ]),
                ]
              : []),

            // Skills
            ...(formData.skills.some((skill) => skill.name)
              ? [
                  new Paragraph({
                    text: "SKILLS",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  new Paragraph({
                    text: formData.skills
                      .filter((skill) => skill.name)
                      .map((skill) => `${skill.name} (${skill.level})`)
                      .join(", "),
                  }),
                ]
              : []),

            // Projects
            ...(formData.projects.length > 0
              ? [
                  new Paragraph({
                    text: "PROJECTS",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  ...formData.projects.flatMap((project) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: project.name,
                          bold: true,
                        }),
                      ],
                    }),
                    new Paragraph({
                      text: project.technologies
                        ? `Technologies: ${project.technologies}`
                        : "",
                    }),
                    new Paragraph({
                      text: project.description,
                    }),
                    ...(project.url
                      ? [
                          new Paragraph({
                            text: `URL: ${project.url}`,
                          }),
                        ]
                      : []),
                    new Paragraph({}), // Empty paragraph for spacing
                  ]),
                ]
              : []),
          ],
        },
      ],
    });

    // Generate the document
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(blob, `${fileName}.docx`);
  };

  const downloadAsHTML = (fileName: string) => {
    // Create HTML content based on the resume data
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${formData.personal.firstName} ${
      formData.personal.lastName
    } - Resume</title>
        <style>
          ${getTemplateSpecificCSS(selectedTemplate.id)}
          
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            margin-bottom: 5px;
          }
          .contact-info {
            text-align: center;
            margin-bottom: 20px;
            font-size: 0.9em;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          .experience-item, .education-item, .project-item {
            margin-bottom: 15px;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
          }
          .item-title {
            font-weight: bold;
          }
          .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .skill-item {
            background-color: #f0f0f0;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${formData.personal.firstName} ${formData.personal.lastName}</h1>
          <div>${formData.personal.title}</div>
        </div>
        
        <div class="contact-info">
          ${
            formData.personal.email
              ? `<span>${formData.personal.email}</span> | `
              : ""
          }
          ${
            formData.personal.phone
              ? `<span>${formData.personal.phone}</span> | `
              : ""
          }
          ${
            formData.personal.location
              ? `<span>${formData.personal.location}</span>`
              : ""
          }
          ${
            formData.personal.linkedin
              ? ` | <a href="${formData.personal.linkedin}">${formData.personal.linkedin}</a>`
              : ""
          }
        </div>
        
        ${
          formData.summary.text
            ? `
        <div class="section">
          <h2 class="section-title">Summary</h2>
          <p>${formData.summary.text}</p>
        </div>
        `
            : ""
        }
        
        ${
          formData.experience.some((exp) => exp.company || exp.position)
            ? `
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${formData.experience
            .filter((exp) => exp.company || exp.position)
            .map(
              (exp) => `
            <div class="experience-item">
              <div class="item-header">
                <div class="item-title">${exp.position || "Position"}</div>
                <div>${exp.startDate || ""} - ${exp.endDate || "Present"}</div>
              </div>
              <div>${exp.company || "Company"}</div>
              <p>${exp.description || ""}</p>
            </div>
          `
            )
            .join("")}
        </div>
        `
            : ""
        }
        
        ${
          formData.education.some((edu) => edu.institution || edu.degree)
            ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${formData.education
            .filter((edu) => edu.institution || edu.degree)
            .map(
              (edu) => `
            <div class="education-item">
              <div class="item-header">
                <div class="item-title">${edu.degree || ""} ${
                edu.field ? `in ${edu.field}` : ""
              }</div>
                <div>${edu.startDate || ""} - ${edu.endDate || "Present"}</div>
              </div>
              <div>${edu.institution || ""}</div>
              ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ""}
            </div>
          `
            )
            .join("")}
        </div>
        `
            : ""
        }
        
        ${
          formData.skills.some((skill) => skill.name)
            ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-list">
            ${formData.skills
              .filter((skill) => skill.name)
              .map(
                (skill) => `
              <div class="skill-item">${skill.name} (${skill.level})</div>
            `
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }
        
        ${
          formData.projects.some((project) => project.name)
            ? `
        <div class="section">
          <h2 class="section-title">Projects</h2>
          ${formData.projects
            .filter((project) => project.name)
            .map(
              (project) => `
            <div class="project-item">
              <div class="item-title">${project.name || ""}</div>
              ${
                project.technologies
                  ? `<div>Technologies: ${project.technologies}</div>`
                  : ""
              }
              <p>${project.description || ""}</p>
              ${
                project.url
                  ? `<div>URL: <a href="${project.url}">${project.url}</a></div>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
        `
            : ""
        }
      </body>
      </html>
    `;

    // Create a blob and download it
    const blob = new Blob([htmlContent], { type: "text/html" });
    saveAs(blob, `${fileName}.html`);
  };

  const getTemplateSpecificCSS = (templateId: string) => {
    switch (templateId) {
      case "modern":
        return ` body {
    font-family: 'Inter', sans-serif;
    line-height: 1.8;
    color: #333;
    background: #fff;
    padding: 40px;
    max-width: 800px;
    margin: auto;
}

.header {
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 3px solid #2563eb;
}

.section-title {
    color: #2563eb;
    border-left: 4px solid #2563eb;
    padding-left: 12px;
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 12px;
}

.skills-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
}

.skill-item {
    background-color: #eaf2ff;
    border-left: 4px solid #2563eb;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
}

.experience-item {
    position: relative;
    padding-left: 20px;
    border-left: 2px solid #2563eb;
    margin-bottom: 20px;
}

.experience-item:before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #2563eb;
    border-radius: 50%;
    left: -5px;
    top: 6px;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
    color: #444;
}

.contact-info span {
    display: flex;
    align-items: center;
    gap: 10px;
}

.contact-info span:before {
    content: ''; 
    display: inline-block;
    width: 14px;
    height: 14px;
    background-color: #2563eb;
    border-radius: 50%;
    flex-shrink: 0;
}

p {
    font-size: 14px;
    margin-bottom: 10px;
}
`;

      case "professional":
        return `
        body {
          font-family: 'Times New Roman', Times, serif;
          color: #333;
          line-height: 1.5;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #1e3a8a;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .header h1 {
          color: #1e3a8a;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .section-title {
          border-bottom: 2px solid #1e3a8a;
          color: #1e3a8a;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding-bottom: 4px;
          margin-bottom: 16px;
        }
        .item-title {
          color: #1e3a8a;
          font-weight: bold;
        }
        .experience-item, .education-item {
          margin-bottom: 16px;
        }
        .experience-item .company, .education-item .institution {
          font-style: italic;
        }
        .contact-info {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .skill-item {
          display: inline-block;
          margin-right: 16px;
        }
        .skill-item:before {
          content: '•';
          margin-right: 4px;
        }
      `;
      case "creative":
        return `
        body {
            font-family: 'Poppins', Arial, sans-serif;
            background-color: #f9f9fb;
            line-height: 1.75;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .header {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            padding: 32px;
            text-align: center;
            border-radius: 0 0 12px 12px;
            margin-bottom: 32px;
            font-size: 1.5rem;
            font-weight: 600;
        }
        .section-title {
            position: relative;
            padding-left: 20px;
            color: #2575fc;
            font-weight: 700;
            font-size: 1.25rem;
            margin-bottom: 24px;
        }
        .section-title:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            background: #2575fc;
            border-radius: 2px;
        }
        .skill-item {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            border-radius: 16px;
            padding: 8px 16px;
            font-size: 0.9rem;
            display: inline-block;
            margin: 4px;
        }
        .experience-item {
            position: relative;
            padding-left: 28px;
            margin-bottom: 24px;
            font-size: 1rem;
            line-height: 1.6;
            color: #444444;
        }
        .experience-item:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 2px;
            background-color: #d3dce6;
        }
        .experience-item:after {
            content: '';
            position: absolute;
            width: 12px;
            height: 12px;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            border-radius: 50%;
            left: -6px;
            top: 6px;
        }
        .project-item {
            border: 1px solid #d3dce6;
            border-radius: 8px;
            padding: 16px;
            font-size: 1rem;
            color: #333333;
            transition: all 0.3s ease;
            background-color: #ffffff;
            margin-bottom: 16px;
        }
        .project-item:hover {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
            transform: translateY(-4px);
        }
        .tech-tag {
            display: inline-block;
            background-color: #edf2fc;
            color: #2575fc;
            border-radius: 12px;
            padding: 4px 10px;
            font-size: 0.85rem;
            margin-right: 6px;
            margin-bottom: 6px;
        }
        
    
      `;
      case "minimal":
        return `
        body {
          font-family: 'Inter', system-ui, sans-serif;
          color: #333;
          line-height: 1.8;
          letter-spacing: 0.01em;
        }
        .header {
          margin-bottom: 32px;
        }
        .header h1 {
          font-weight: 300;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .header .title {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.8em;
          color: #6b7280;
        }
        .section-title {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.7em;
          font-weight: 400;
          color: #9ca3af;
          margin-bottom: 16px;
        }
        .item-title {
          font-weight: 500;
        }
        .skill-item {
          display: inline-block;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 4px 8px;
          margin-right: 8px;
          margin-bottom: 8px;
          font-size: 0.8em;
        }
        .experience-item, .education-item, .project-item {
          margin-bottom: 24px;
        }
        .date {
          color: #9ca3af;
          font-size: 0.7em;
        }
        .company, .institution {
          color: #6b7280;
          margin-bottom: 8px;
        }
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          color: #6b7280;
          font-size: 0.8em;
        }
      `;
      default:
        return "";
    }
  };

  const applyTemplateSpecificStyles = (templateId: string) => {
    if (!resumePreviewRef.current) return;

    // First, reset any existing styles
    resetTemplateStyles();

    // Apply template-specific class
    resumePreviewRef.current.classList.add(`template-${templateId}`);

    // Apply additional styling based on template
    switch (templateId) {
      case "modern":
        // Modern template has asymmetrical layout and grid system
        resumePreviewRef.current.style.fontFamily =
          "'Segoe UI', Roboto, sans-serif";
        resumePreviewRef.current.style.color = "#333";
        resumePreviewRef.current.style.lineHeight = "1.6";
        break;
      case "professional":
        // Professional template has serif fonts and traditional layout
        resumePreviewRef.current.style.fontFamily =
          "'Times New Roman', Times, serif";
        resumePreviewRef.current.style.color = "#333";
        resumePreviewRef.current.style.lineHeight = "1.5";
        break;
      case "creative":
        // Creative template has distinctive fonts and bold colors
        resumePreviewRef.current.style.fontFamily =
          "'Poppins', 'Helvetica Neue', sans-serif";
        resumePreviewRef.current.style.color = "#333";
        resumePreviewRef.current.style.lineHeight = "1.6";
        break;
      case "minimal":
        // Minimal template has clean typography and generous whitespace
        resumePreviewRef.current.style.fontFamily =
          "'Inter', system-ui, sans-serif";
        resumePreviewRef.current.style.color = "#333";
        resumePreviewRef.current.style.lineHeight = "1.8";
        resumePreviewRef.current.style.letterSpacing = "0.01em";
        break;
    }
  };

  const resetTemplateStyles = () => {
    if (!resumePreviewRef.current) return;

    // Remove template-specific classes
    resumePreviewRef.current.classList.remove(
      "template-modern",
      "template-professional",
      "template-creative",
      "template-minimal"
    );

    // Reset inline styles
    resumePreviewRef.current.style.fontFamily = "";
    resumePreviewRef.current.style.letterSpacing = "";
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Build Your Resume
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create a professional resume with our intuitive builder and AI-powered
          suggestions.
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
                  selectedTemplate.id === template.id
                    ? "ring-4 ring-blue-600 scale-105"
                    : "hover:scale-105"
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
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
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
                  <span className="text-sm text-muted-foreground">
                    {progress}% Complete
                  </span>
                  <Progress value={progress} className="w-24 h-2" />
                </div>
              </div>
            </div>

            <Tabs
              value={activeSection}
              onValueChange={setActiveSection}
              className="p-6"
            >
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
                      onChange={(e) =>
                        handleInputChange(
                          "personal",
                          "firstName",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.personal.lastName}
                      onChange={(e) =>
                        handleInputChange(
                          "personal",
                          "lastName",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Software Engineer"
                      value={formData.personal.title}
                      onChange={(e) =>
                        handleInputChange("personal", "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.personal.email}
                      onChange={(e) =>
                        handleInputChange("personal", "email", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.personal.phone}
                      onChange={(e) =>
                        handleInputChange("personal", "phone", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={formData.personal.location}
                      onChange={(e) =>
                        handleInputChange(
                          "personal",
                          "location",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.personal.linkedin}
                      onChange={(e) =>
                        handleInputChange(
                          "personal",
                          "linkedin",
                          e.target.value
                        )
                      }
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
                    onChange={(e) =>
                      handleInputChange("summary", "text", e.target.value)
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    A strong summary highlights your key qualifications and
                    career goals in 3-5 sentences.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 flex gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      AI Suggestion
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Include specific skills relevant to the job you're
                      applying for. Quantify your experience with numbers when
                      possible (e.g., "5+ years of experience" or "Led a team of
                      10").
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Work Experience */}
              <TabsContent value="experience" className="space-y-6">
                {formData.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="space-y-6 pb-6 border-b border-border"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Experience {index + 1}</h3>
                      {formData.experience.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem("experience", index)}
                        >
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
                          onChange={(e) =>
                            handleArrayInputChange(
                              "experience",
                              index,
                              "company",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`position-${index}`}>Position</Label>
                        <Input
                          id={`position-${index}`}
                          value={exp.position}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "experience",
                              index,
                              "position",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                        <Input
                          id={`startDate-${index}`}
                          placeholder="MM/YYYY"
                          value={exp.startDate}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "experience",
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${index}`}>End Date</Label>
                        <Input
                          id={`endDate-${index}`}
                          placeholder="MM/YYYY or Present"
                          value={exp.endDate}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "experience",
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`description-${index}`}>
                          Description
                        </Label>
                        <Textarea
                          id={`description-${index}`}
                          placeholder="Describe your responsibilities and achievements..."
                          className="min-h-32"
                          value={exp.description}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "experience",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => addArrayItem("experience")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Experience
                </Button>
              </TabsContent>

              {/* Education */}
              <TabsContent value="education" className="space-y-6">
                {formData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="space-y-6 pb-6 border-b border-border"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Education {index + 1}</h3>
                      {formData.education.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem("education", index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`institution-${index}`}>
                          Institution
                        </Label>
                        <Input
                          id={`institution-${index}`}
                          value={edu.institution}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "education",
                              index,
                              "institution",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`degree-${index}`}>Degree</Label>
                        <Input
                          id={`degree-${index}`}
                          placeholder="e.g. Bachelor of Science"
                          value={edu.degree}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "education",
                              index,
                              "degree",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`field-${index}`}>Field of Study</Label>
                        <Input
                          id={`field-${index}`}
                          placeholder="e.g. Computer Science"
                          value={edu.field}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "education",
                              index,
                              "field",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`gpa-${index}`}>GPA (Optional)</Label>
                        <Input
                          id={`gpa-${index}`}
                          placeholder="e.g. 3.8/4.0"
                          value={edu.gpa}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "education",
                              index,
                              "gpa",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`eduStartDate-${index}`}>
                          Start Date
                        </Label>
                        <Input
                          id={`eduStartDate-${index}`}
                          placeholder="MM/YYYY"
                          value={edu.startDate}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "education",
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`eduEndDate-${index}`}>End Date</Label>
                        <Input
                          id={`eduEndDate-${index}`}
                          placeholder="MM/YYYY or Present"
                          value={edu.endDate}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "education",
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => addArrayItem("education")}
                >
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
                        onChange={(e) =>
                          handleArrayInputChange(
                            "skills",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <select
                      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={skill.level}
                      onChange={(e) =>
                        handleArrayInputChange(
                          "skills",
                          index,
                          "level",
                          e.target.value
                        )
                      }
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    {formData.skills.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem("skills", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => addArrayItem("skills")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Skill
                </Button>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 flex gap-3 mt-6">
                  <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      AI Suggestion
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Based on your experience, consider adding these relevant
                      skills:
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
                  <div
                    key={index}
                    className="space-y-6 pb-6 border-b border-border"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Project {index + 1}</h3>
                      {formData.projects.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem("projects", index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`projectName-${index}`}>
                          Project Name
                        </Label>
                        <Input
                          id={`projectName-${index}`}
                          value={project.name}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "projects",
                              index,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`projectUrl-${index}`}>
                          URL (Optional)
                        </Label>
                        <Input
                          id={`projectUrl-${index}`}
                          placeholder="https://..."
                          value={project.url}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "projects",
                              index,
                              "url",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`technologies-${index}`}>
                          Technologies Used
                        </Label>
                        <Input
                          id={`technologies-${index}`}
                          placeholder="e.g. React, Node.js, MongoDB"
                          value={project.technologies}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "projects",
                              index,
                              "technologies",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`projectDescription-${index}`}>
                          Description
                        </Label>
                        <Textarea
                          id={`projectDescription-${index}`}
                          placeholder="Describe the project, your role, and achievements..."
                          className="min-h-24"
                          value={project.description}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "projects",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => addArrayItem("projects")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Project
                </Button>
              </TabsContent>
            </Tabs>

            <div className="p-6 border-t border-border bg-muted flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  const currentIndex = [
                    "personal",
                    "summary",
                    "experience",
                    "education",
                    "skills",
                    "projects",
                  ].indexOf(activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(
                      [
                        "personal",
                        "summary",
                        "experience",
                        "education",
                        "skills",
                        "projects",
                      ][currentIndex - 1]
                    );
                  }
                }}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="h-4 w-4 mr-2 animate-spin">◌</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </>
                  )}
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
                    ].indexOf(activeSection);
                    if (currentIndex < 5) {
                      setActiveSection(
                        [
                          "personal",
                          "summary",
                          "experience",
                          "education",
                          "skills",
                          "projects",
                        ][currentIndex + 1]
                      );
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
                  <div ref={resumePreviewRef} className="h-full">
                    {/* Modern Template */}
                    {selectedTemplate.id === "modern" && (
                      <div className="h-full flex flex-col bg-white">
                        {/* Two-column layout with dark sidebar and white main content */}
                        <div className="flex flex-col md:flex-row h-full">
                          {/* Dark sidebar - 35% width */}
                          <div className="md:w-[35%] bg-[#2A3B4C] text-white p-6 flex flex-col space-y-6">
                            {/* Header with name and photo */}
                            <div className="text-center mb-4">
                              <h1 className="font-['Poppins'] text-2xl font-bold tracking-wide text-white">
                                {formData.personal.firstName || "Your"}{" "}
                                {formData.personal.lastName || "Name"}
                              </h1>
                              <p className="font-['Poppins'] text-base font-normal tracking-wider text-[#4A90E2] mt-1">
                                {formData.personal.title ||
                                  "Professional Title"}
                              </p>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-2">
                              <h3 className="font-['Poppins'] text-lg font-semibold tracking-wide text-white border-l-[3px] border-[#4A90E2] pl-2">
                                Contact
                              </h3>
                              <div className="space-y-2 text-sm">
                                {formData.personal.email && (
                                  <div className="flex items-center">
                                    <span className="text-[#4A90E2] mr-2.5">
                                      @
                                    </span>
                                    <span>{formData.personal.email}</span>
                                  </div>
                                )}
                                {formData.personal.phone && (
                                  <div className="flex items-center">
                                    <span className="text-[#4A90E2] mr-2.5">
                                      ☎
                                    </span>
                                    <span>{formData.personal.phone}</span>
                                  </div>
                                )}
                                {formData.personal.location && (
                                  <div className="flex items-center">
                                    <span className="text-[#4A90E2] mr-2.5">
                                      📍
                                    </span>
                                    <span>{formData.personal.location}</span>
                                  </div>
                                )}
                                {formData.personal.linkedin && (
                                  <div className="flex items-center">
                                    <span className="text-[#4A90E2] mr-2.5">
                                      in
                                    </span>
                                    <span>{formData.personal.linkedin}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Skills */}
                            {formData.skills.some((skill) => skill.name) && (
                              <div>
                                <h3 className="font-['Poppins'] text-lg font-semibold tracking-wide text-white border-l-[3px] border-[#4A90E2] pl-2 mb-3">
                                  Skills
                                </h3>
                                <div className="space-y-3">
                                  {formData.skills.map(
                                    (skill, i) =>
                                      skill.name && (
                                        <div
                                          key={i}
                                          className="text-xs font-['Inter']"
                                        >
                                          <div className="flex justify-between mb-1.5">
                                            <span>{skill.name}</span>
                                            <span className="text-[#4A90E2]">
                                              {skill.level}
                                            </span>
                                          </div>
                                          <div className="w-full bg-white/20 rounded-sm h-1">
                                            <div
                                              className="bg-gradient-to-r from-[#4A90E2] to-[#86BBF2] h-1 rounded-sm"
                                              style={{
                                                width:
                                                  skill.level === "Beginner"
                                                    ? "25%"
                                                    : skill.level ===
                                                      "Intermediate"
                                                    ? "50%"
                                                    : skill.level === "Advanced"
                                                    ? "75%"
                                                    : "100%",
                                              }}
                                            ></div>
                                          </div>
                                        </div>
                                      )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Education */}
                            {formData.education.some(
                              (edu) => edu.institution || edu.degree
                            ) && (
                              <div>
                                <h3 className="font-['Poppins'] text-lg font-semibold tracking-wide text-white border-l-[3px] border-[#4A90E2] pl-2 mb-3">
                                  Education
                                </h3>
                                <div className="space-y-4">
                                  {formData.education.map(
                                    (edu, i) =>
                                      (edu.institution || edu.degree) && (
                                        <div
                                          key={i}
                                          className="text-xs font-['Inter']"
                                        >
                                          <div className="font-semibold text-[#4A90E2]">
                                            {edu.degree}
                                          </div>
                                          <div className="font-medium">
                                            {edu.institution}
                                          </div>
                                          <div className="text-xs italic text-[#4A90E2]">
                                            {edu.startDate} -{" "}
                                            {edu.endDate || "Present"}
                                          </div>
                                          {edu.field && (
                                            <div className="mt-1">
                                              {edu.field}
                                            </div>
                                          )}
                                          {edu.gpa && (
                                            <div className="text-xs">
                                              GPA: {edu.gpa}
                                            </div>
                                          )}
                                        </div>
                                      )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Main content - 65% width */}
                          <div className="md:w-[65%] p-6 flex flex-col space-y-7">
                            {/* Summary */}
                            {formData.summary.text && (
                              <div className="bg-[#E8F0FE] p-4 rounded">
                                <h3 className="font-['Poppins'] text-lg font-semibold tracking-wide text-[#2A3B4C] border-l-[3px] border-[#4A90E2] pl-2 mb-2 bg-[#F8FBFF]">
                                  Professional Summary
                                </h3>
                                <p className="text-xs font-['Inter'] leading-relaxed text-[#333333]">
                                  {formData.summary.text}
                                </p>
                              </div>
                            )}

                            {/* Experience */}
                            {formData.experience.some(
                              (exp) => exp.company || exp.position
                            ) && (
                              <div>
                                <h3 className="font-['Poppins'] text-lg font-semibold tracking-wide text-[#2A3B4C] border-l-[3px] border-[#4A90E2] pl-2 mb-4 bg-[#F8FBFF]">
                                  Experience
                                </h3>
                                <div className="space-y-5">
                                  {formData.experience.map(
                                    (exp, i) =>
                                      (exp.company || exp.position) && (
                                        <div
                                          key={i}
                                          className="text-xs font-['Inter'] relative pl-5 border-l border-[#E0E0E0]"
                                        >
                                          <div className="absolute w-2.5 h-2.5 bg-[#4A90E2] rounded-full -left-[5px] top-1"></div>
                                          <div className="font-['Poppins'] text-sm font-semibold text-[#4A90E2]">
                                            {exp.position}
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="font-medium text-[#333333]">
                                              {exp.company}
                                            </span>
                                            <span className="text-xs italic text-[#4A90E2]">
                                              {exp.startDate} -{" "}
                                              {exp.endDate || "Present"}
                                            </span>
                                          </div>
                                          {exp.description && (
                                            <ul className="mt-2 list-disc list-inside text-[#333333] leading-relaxed">
                                              {exp.description
                                                .split("\n")
                                                .map((bullet, idx) => (
                                                  <li
                                                    key={idx}
                                                    className="mb-1"
                                                  >
                                                    {bullet}
                                                  </li>
                                                ))}
                                            </ul>
                                          )}
                                        </div>
                                      )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Projects */}
                            {formData.projects.some(
                              (project) => project.name
                            ) && (
                              <div>
                                <h3 className="font-['Poppins'] text-lg font-semibold tracking-wide text-[#2A3B4C] border-l-[3px] border-[#4A90E2] pl-2 mb-4 bg-[#F8FBFF]">
                                  Projects
                                </h3>
                                <div className="space-y-4">
                                  {formData.projects.map(
                                    (project, i) =>
                                      project.name && (
                                        <div
                                          key={i}
                                          className="text-xs font-['Inter'] bg-[#E8F0FE] p-3 rounded shadow-sm"
                                        >
                                          <div className="font-['Poppins'] text-sm font-semibold text-[#4A90E2]">
                                            {project.name}
                                          </div>
                                          {project.technologies && (
                                            <div className="text-[#333333] mt-1">
                                              <span className="font-medium">
                                                Technologies:
                                              </span>{" "}
                                              {project.technologies}
                                            </div>
                                          )}
                                          <p className="mt-2 text-[#333333] leading-relaxed">
                                            {project.description}
                                          </p>
                                          {project.url && (
                                            <div className="text-[#4A90E2] mt-1 text-xs">
                                              <span>{project.url}</span>
                                            </div>
                                          )}
                                        </div>
                                      )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Professional Template */}
                    {selectedTemplate.id === "professional" && (
                      <div className="h-full flex flex-col font-serif bg-white text-[#333333] p-6">
                        {/* Header */}
                        <div className="text-center mb-5 border-b-2 border-t-2 border-[#14283C] py-4">
                          <h1 className="font-['Garamond'] text-2xl font-bold tracking-[0.3px] text-[#14283C]">
                            {formData.personal.firstName || "Your"}{" "}
                            {formData.personal.lastName || "Name"}
                          </h1>
                          <p className="font-['Garamond'] text-base font-normal tracking-wider text-[#777777] mt-1">
                            {formData.personal.title || "Professional Title"}
                          </p>
                          <div className="text-xs font-['Calibri'] text-[#777777] mt-3 flex justify-center flex-wrap">
                            {formData.personal.email && (
                              <span>{formData.personal.email}</span>
                            )}
                            {formData.personal.email &&
                              formData.personal.phone && (
                                <span className="mx-2">·</span>
                              )}
                            {formData.personal.phone && (
                              <span>{formData.personal.phone}</span>
                            )}
                            {formData.personal.phone &&
                              formData.personal.location && (
                                <span className="mx-2">·</span>
                              )}
                            {formData.personal.location && (
                              <span>{formData.personal.location}</span>
                            )}
                            {formData.personal.location &&
                              formData.personal.linkedin && (
                                <span className="mx-2">·</span>
                              )}
                            {formData.personal.linkedin && (
                              <span>{formData.personal.linkedin}</span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-5">
                          {/* Summary */}
                          {formData.summary.text && (
                            <div>
                              <h3 className="font-['Garamond'] text-base font-semibold text-[#14283C] uppercase border-b border-[#D9D9D9] pb-1 mb-2">
                                Professional Summary
                              </h3>
                              <p className="text-xs font-['Calibri'] leading-relaxed text-[#333333]">
                                {formData.summary.text}
                              </p>
                            </div>
                          )}

                          {/* Experience */}
                          {formData.experience.some(
                            (exp) => exp.company || exp.position
                          ) && (
                            <div>
                              <h3 className="font-['Garamond'] text-base font-semibold text-[#14283C] uppercase border-b border-[#D9D9D9] pb-1 mb-3">
                                Professional Experience
                              </h3>
                              <div className="space-y-4">
                                {formData.experience.map(
                                  (exp, i) =>
                                    (exp.company || exp.position) && (
                                      <div
                                        key={i}
                                        className="text-xs font-['Calibri']"
                                      >
                                        <div className="flex justify-between items-baseline">
                                          <span className="font-['Garamond'] text-sm font-bold text-[#14283C]">
                                            {exp.position}
                                          </span>
                                          <span className="text-[#777777]">
                                            {exp.startDate} -{" "}
                                            {exp.endDate || "Present"}
                                          </span>
                                        </div>
                                        <div className="font-['Garamond'] text-sm font-bold italic text-[#14283C] mb-1">
                                          {exp.company}
                                        </div>
                                        {exp.description && (
                                          <div className="text-[#333333] leading-relaxed pl-4">
                                            {exp.description
                                              .split("\n")
                                              .map((bullet, idx) => (
                                                <p
                                                  key={idx}
                                                  className="relative pl-4 mb-1"
                                                >
                                                  <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-[#14283C]"></span>
                                                  {bullet}
                                                </p>
                                              ))}
                                          </div>
                                        )}
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Education */}
                          {formData.education.some(
                            (edu) => edu.institution || edu.degree
                          ) && (
                            <div>
                              <h3 className="font-['Garamond'] text-base font-semibold text-[#14283C] uppercase border-b border-[#D9D9D9] pb-1 mb-3">
                                Education
                              </h3>
                              <div className="space-y-3">
                                {formData.education.map(
                                  (edu, i) =>
                                    (edu.institution || edu.degree) && (
                                      <div
                                        key={i}
                                        className="text-xs font-['Calibri']"
                                      >
                                        <div className="flex justify-between items-baseline">
                                          <span className="font-['Garamond'] text-sm font-bold text-[#14283C]">
                                            {edu.degree}
                                          </span>
                                          <span className="text-[#777777]">
                                            {edu.startDate} -{" "}
                                            {edu.endDate || "Present"}
                                          </span>
                                        </div>
                                        <div className="font-['Garamond'] text-sm italic">
                                          {edu.institution}
                                        </div>
                                        {edu.field && (
                                          <div className="text-[#333333]">
                                            {edu.field}
                                          </div>
                                        )}
                                        {edu.gpa && (
                                          <div className="text-[#333333]">
                                            GPA: {edu.gpa}
                                          </div>
                                        )}
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Skills */}
                          {formData.skills.some((skill) => skill.name) && (
                            <div>
                              <h3 className="font-['Garamond'] text-base font-semibold text-[#14283C] uppercase border-b border-[#D9D9D9] pb-1 mb-3">
                                Skills
                              </h3>
                              <div className="flex flex-wrap">
                                {formData.skills.map(
                                  (skill, i) =>
                                    skill.name && (
                                      <div
                                        key={i}
                                        className="text-xs font-['Calibri'] mr-4 mb-2 relative pl-3"
                                      >
                                        <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-[#14283C]"></span>
                                        <span className="text-[#333333]">
                                          {skill.name} ({skill.level})
                                        </span>
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Projects */}
                          {formData.projects.some(
                            (project) => project.name
                          ) && (
                            <div>
                              <h3 className="font-['Garamond'] text-base font-semibold text-[#14283C] uppercase border-b border-[#D9D9D9] pb-1 mb-3">
                                Projects
                              </h3>
                              <div className="space-y-3">
                                {formData.projects.map(
                                  (project, i) =>
                                    project.name && (
                                      <div
                                        key={i}
                                        className="text-xs font-['Calibri']"
                                      >
                                        <div className="font-['Garamond'] text-sm font-bold text-[#14283C]">
                                          {project.name}
                                        </div>
                                        {project.technologies && (
                                          <div className="italic text-[#333333]">
                                            Technologies: {project.technologies}
                                          </div>
                                        )}
                                        <p className="mt-1 text-[#333333] leading-relaxed">
                                          {project.description}
                                        </p>
                                        {project.url && (
                                          <div className="text-[#777777] mt-1">
                                            URL: {project.url}
                                          </div>
                                        )}
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Page number footer */}
                          <div className="text-center text-[10px] font-['Calibri'] text-[#777777] mt-4">
                            Page 1
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Creative Template */}
                    {selectedTemplate.id === "creative" && (
                      <div className="h-full flex flex-col font-['Montserrat'] bg-white text-[#2D2D2D]">
                        {/* Header with geometric pattern */}
                        <div className="bg-gradient-to-r from-[#6200EA] to-[#9D6FFF] text-white p-6 relative overflow-hidden">
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-8 -mt-8"></div>
                          <div className="absolute bottom-0 left-1/4 w-16 h-16 bg-[#03DAC6] opacity-10 -mb-8 rotate-45"></div>

                          <h1 className="font-['Futura'] text-2xl font-extrabold tracking-wider text-white relative z-10">
                            {formData.personal.firstName || "Your"}{" "}
                            {formData.personal.lastName || "Name"}
                          </h1>
                          <p className="font-['Futura'] text-base font-normal uppercase tracking-[3px] text-[#03DAC6] mt-1 relative z-10">
                            {formData.personal.title || "Professional Title"}
                          </p>
                          <div className="text-xs mt-4 flex flex-wrap gap-4 relative z-10">
                            {formData.personal.email && (
                              <div className="flex items-center">
                                <span className="text-[#03DAC6] mr-1.5">@</span>
                                <span>{formData.personal.email}</span>
                              </div>
                            )}
                            {formData.personal.phone && (
                              <div className="flex items-center">
                                <span className="text-[#03DAC6] mr-1.5">☎</span>
                                <span>{formData.personal.phone}</span>
                              </div>
                            )}
                            {formData.personal.location && (
                              <div className="flex items-center">
                                <span className="text-[#03DAC6] mr-1.5">
                                  📍
                                </span>
                                <span>{formData.personal.location}</span>
                              </div>
                            )}
                            {formData.personal.linkedin && (
                              <div className="flex items-center">
                                <span className="text-[#03DAC6] mr-1.5">
                                  in
                                </span>
                                <span>{formData.personal.linkedin}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content with asymmetrical grid */}
                        <div className="flex-1 p-6 space-y-6">
                          {/* Skills - Highlighted first with circular indicators */}
                          {formData.skills.some((skill) => skill.name) && (
                            <div>
                              <h3 className="font-['Futura'] text-lg font-semibold text-[#6200EA] mb-4 relative pl-6">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#03DAC6] rotate-45"></span>
                                Skills
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {formData.skills.map(
                                  (skill, i) =>
                                    skill.name && (
                                      <div
                                        key={i}
                                        className="text-xs font-['Raleway'] relative"
                                      >
                                        <div className="w-16 h-16 mx-auto mb-2 relative">
                                          <div className="absolute inset-0 rounded-full border-[3px] border-[#03DAC6] opacity-30"></div>
                                          <div
                                            className="absolute inset-0 rounded-full border-[3px] border-[#03DAC6]"
                                            style={{
                                              clipPath:
                                                skill.level === "Beginner"
                                                  ? "polygon(50% 50%, 50% 0%, 70% 0%, 50% 50%)"
                                                  : skill.level ===
                                                    "Intermediate"
                                                  ? "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%, 50% 50%)"
                                                  : skill.level === "Advanced"
                                                  ? "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 75% 100%, 50% 50%)"
                                                  : "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%, 50% 50%)",
                                            }}
                                          ></div>
                                          <div className="absolute inset-0 flex items-center justify-center text-[#6200EA] font-bold">
                                            {skill.level === "Beginner"
                                              ? "25%"
                                              : skill.level === "Intermediate"
                                              ? "50%"
                                              : skill.level === "Advanced"
                                              ? "75%"
                                              : "100%"}
                                          </div>
                                        </div>
                                        <div className="text-center font-medium text-[#6200EA]">
                                          {skill.name}
                                        </div>
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Summary */}
                          {formData.summary.text && (
                            <div className="relative">
                              <div className="absolute -left-2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#6200EA] to-[#03DAC6]"></div>
                              <h3 className="font-['Futura'] text-lg font-semibold text-[#6200EA] mb-3 relative pl-6">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FF7597] rounded-full"></span>
                                About Me
                              </h3>
                              <p className="text-xs font-['Raleway'] leading-relaxed text-[#2D2D2D] pl-6">
                                {formData.summary.text}
                              </p>
                            </div>
                          )}

                          {/* Experience with diagonal timeline */}
                          {formData.experience.some(
                            (exp) => exp.company || exp.position
                          ) && (
                            <div>
                              <h3 className="font-['Futura'] text-lg font-semibold text-[#6200EA] mb-4 relative pl-6">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#03DAC6] rotate-45"></span>
                                Experience
                              </h3>
                              <div className="relative">
                                <div className="absolute left-3 top-2 bottom-0 w-[1px] bg-[#E0E0E0] rotate-[5deg] origin-top"></div>
                                <div className="space-y-6 ml-8">
                                  {formData.experience.map(
                                    (exp, i) =>
                                      (exp.company || exp.position) && (
                                        <div
                                          key={i}
                                          className="text-xs font-['Raleway'] relative"
                                        >
                                          <div className="absolute -left-6 top-0 w-3 h-3 bg-[#6200EA] rounded-full"></div>
                                          <div className="font-['Futura'] text-sm font-semibold text-[#03DAC6]">
                                            {exp.position}
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span className="font-medium text-[#6200EA]">
                                              {exp.company}
                                            </span>
                                            <span className="text-[#FF7597] font-['Avenir'] text-xs">
                                              {exp.startDate} -{" "}
                                              {exp.endDate || "Present"}
                                            </span>
                                          </div>
                                          {exp.description && (
                                            <div className="mt-2 text-[#2D2D2D] leading-relaxed">
                                              {exp.description
                                                .split("\n")
                                                .map((bullet, idx) => (
                                                  <p
                                                    key={idx}
                                                    className="relative pl-4 mb-1"
                                                  >
                                                    <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-[#03DAC6] rotate-45"></span>
                                                    {bullet}
                                                  </p>
                                                ))}
                                            </div>
                                          )}
                                        </div>
                                      )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Education */}
                          {formData.education.some(
                            (edu) => edu.institution || edu.degree
                          ) && (
                            <div>
                              <h3 className="font-['Futura'] text-lg font-semibold text-[#6200EA] mb-3 relative pl-6">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FF7597] rounded-full"></span>
                                Education
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                                {formData.education.map(
                                  (edu, i) =>
                                    (edu.institution || edu.degree) && (
                                      <div
                                        key={i}
                                        className="text-xs font-['Raleway'] p-3 border-l-2 border-[#03DAC6] bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                                      >
                                        <div className="font-['Futura'] text-sm font-semibold text-[#6200EA]">
                                          {edu.degree}
                                        </div>
                                        <div className="font-medium text-[#03DAC6]">
                                          {edu.institution}
                                        </div>
                                        <div className="text-[#FF7597] text-xs">
                                          {edu.startDate} -{" "}
                                          {edu.endDate || "Present"}
                                        </div>
                                        {edu.field && (
                                          <div className="mt-1 text-[#2D2D2D]">
                                            {edu.field}
                                          </div>
                                        )}
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Projects with card layout */}
                          {formData.projects.some(
                            (project) => project.name
                          ) && (
                            <div>
                              <h3 className="font-['Futura'] text-lg font-semibold text-[#6200EA] mb-4 relative pl-6">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#03DAC6] rotate-45"></span>
                                Projects
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formData.projects.map(
                                  (project, i) =>
                                    project.name && (
                                      <div
                                        key={i}
                                        className="text-xs font-['Raleway'] p-4 border border-[#E0E0E0] rounded-md shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                      >
                                        <div className="font-['Futura'] text-sm font-semibold text-[#6200EA]">
                                          {project.name}
                                        </div>
                                        {project.technologies && (
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {project.technologies
                                              .split(",")
                                              .map((tech, idx) => (
                                                <span
                                                  key={idx}
                                                  className="bg-[#F3E8FF] text-[#6200EA] px-2 py-0.5 rounded-full text-[9px]"
                                                >
                                                  {tech.trim()}
                                                </span>
                                              ))}
                                          </div>
                                        )}
                                        <p className="mt-2 text-[#2D2D2D] leading-relaxed">
                                          {project.description}
                                        </p>
                                        {project.url && (
                                          <div className="text-[#FF7597] mt-2 text-xs">
                                            <span>{project.url}</span>
                                          </div>
                                        )}
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Minimal Template */}
                    {selectedTemplate.id === "minimal" && (
                      <div className="h-full flex flex-col font-['Helvetica Neue'] bg-white text-[#000000] p-8">
                        {/* Header with generous white space */}
                        <div className="mb-12">
                          <h1 className="font-light text-xl tracking-wider text-black">
                            {formData.personal.firstName || "Your"}{" "}
                            {formData.personal.lastName || "Name"}
                          </h1>
                          <p className="text-sm font-light uppercase tracking-[3px] text-black mt-1">
                            {formData.personal.title || "Professional Title"}
                          </p>
                          <div className="text-xs mt-8 flex flex-wrap text-[#888888]">
                            {formData.personal.email && (
                              <span>{formData.personal.email}</span>
                            )}
                            {formData.personal.email &&
                              formData.personal.phone && (
                                <span className="mx-2">|</span>
                              )}
                            {formData.personal.phone && (
                              <span>{formData.personal.phone}</span>
                            )}
                            {formData.personal.phone &&
                              formData.personal.location && (
                                <span className="mx-2">|</span>
                              )}
                            {formData.personal.location && (
                              <span>{formData.personal.location}</span>
                            )}
                            {formData.personal.location &&
                              formData.personal.linkedin && (
                                <span className="mx-2">|</span>
                              )}
                            {formData.personal.linkedin && (
                              <span>{formData.personal.linkedin}</span>
                            )}
                          </div>
                        </div>

                        {/* Content with generous spacing */}
                        <div className="flex-1 space-y-8">
                          {/* Summary */}
                          {formData.summary.text && (
                            <div>
                              <h3 className="text-xs uppercase tracking-wider text-black font-normal small-caps border-b-[0.5px] border-[#EFEFEF] pb-1 mb-4">
                                About
                              </h3>
                              <p className="text-xs leading-relaxed text-[#333333]">
                                {formData.summary.text}
                              </p>
                            </div>
                          )}

                          {/* Experience */}
                          {formData.experience.some(
                            (exp) => exp.company || exp.position
                          ) && (
                            <div>
                              <h3 className="text-xs uppercase tracking-wider text-black font-normal small-caps border-b-[0.5px] border-[#EFEFEF] pb-1 mb-4">
                                Experience
                              </h3>
                              <div className="space-y-6">
                                {formData.experience.map(
                                  (exp, i) =>
                                    (exp.company || exp.position) && (
                                      <div key={i} className="text-xs">
                                        <div className="flex justify-between items-baseline">
                                          <span className="font-medium text-black">
                                            {exp.position}{" "}
                                            {exp.company && `– ${exp.company}`}
                                          </span>
                                          <span className="text-[#888888] text-[10px]">
                                            {exp.startDate} —{" "}
                                            {exp.endDate || "Present"}
                                          </span>
                                        </div>
                                        {exp.description && (
                                          <p className="mt-3 text-[#333333] leading-relaxed max-w-prose">
                                            {exp.description}
                                          </p>
                                        )}
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Education */}
                          {formData.education.some(
                            (edu) => edu.institution || edu.degree
                          ) && (
                            <div>
                              <h3 className="text-xs uppercase tracking-wider text-black font-normal small-caps border-b-[0.5px] border-[#EFEFEF] pb-1 mb-4">
                                Education
                              </h3>
                              <div className="space-y-4">
                                {formData.education.map(
                                  (edu, i) =>
                                    (edu.institution || edu.degree) && (
                                      <div key={i} className="text-xs">
                                        <div className="flex justify-between items-baseline">
                                          <span className="font-medium text-black">
                                            {edu.degree}
                                          </span>
                                          <span className="text-[#888888] text-[10px]">
                                            {edu.startDate} —{" "}
                                            {edu.endDate || "Present"}
                                          </span>
                                        </div>
                                        <div className="text-[#333333]">
                                          {edu.institution}
                                        </div>
                                        {edu.field && (
                                          <div className="text-[#333333] mt-1">
                                            {edu.field}
                                          </div>
                                        )}
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Skills */}
                          {formData.skills.some((skill) => skill.name) && (
                            <div>
                              <h3 className="text-xs uppercase tracking-wider text-black font-normal small-caps border-b-[0.5px] border-[#EFEFEF] pb-1 mb-4">
                                Skills
                              </h3>
                              <div className="flex flex-wrap gap-3">
                                {formData.skills.map(
                                  (skill, i) =>
                                    skill.name && (
                                      <div key={i} className="text-xs relative">
                                        <span className="border border-[#EFEFEF] px-3 py-1 rounded text-[#333333]">
                                          {skill.name}
                                          {skill.level && (
                                            <span className="ml-1 inline-flex">
                                              <span
                                                className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                                                  [
                                                    "Beginner",
                                                    "Intermediate",
                                                    "Advanced",
                                                    "Expert",
                                                  ].includes(skill.level)
                                                    ? "bg-[#6C6C6C]"
                                                    : "bg-[#D8D8D8]"
                                                }`}
                                              ></span>
                                              <span
                                                className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                                                  [
                                                    "Intermediate",
                                                    "Advanced",
                                                    "Expert",
                                                  ].includes(skill.level)
                                                    ? "bg-[#6C6C6C]"
                                                    : "bg-[#D8D8D8]"
                                                }`}
                                              ></span>
                                              <span
                                                className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                                                  [
                                                    "Advanced",
                                                    "Expert",
                                                  ].includes(skill.level)
                                                    ? "bg-[#6C6C6C]"
                                                    : "bg-[#D8D8D8]"
                                                }`}
                                              ></span>
                                              <span
                                                className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                                                  skill.level === "Expert"
                                                    ? "bg-[#6C6C6C]"
                                                    : "bg-[#D8D8D8]"
                                                }`}
                                              ></span>
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Projects */}
                          {formData.projects.some(
                            (project) => project.name
                          ) && (
                            <div>
                              <h3 className="text-xs uppercase tracking-wider text-black font-normal small-caps border-b-[0.5px] border-[#EFEFEF] pb-1 mb-4">
                                Projects
                              </h3>
                              <div className="space-y-6">
                                {formData.projects.map(
                                  (project, i) =>
                                    project.name && (
                                      <div key={i} className="text-xs">
                                        <div className="font-medium text-black">
                                          {project.name}
                                        </div>
                                        {project.technologies && (
                                          <div className="text-[#333333] text-[10px] mt-1">
                                            {project.technologies}
                                          </div>
                                        )}
                                        <p className="mt-2 text-[#333333] leading-relaxed max-w-prose">
                                          {project.description}
                                        </p>
                                        {project.url && (
                                          <div className="text-[#888888] mt-2 text-[10px]">
                                            {project.url}
                                          </div>
                                        )}
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Page number */}
                          <div className="text-right text-[9px] text-[#888888] mt-8">
                            Page 1
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-border">
                <div className="relative">
                  <Button
                    className="w-full"
                    onClick={() => handleDownload("pdf")}
                    disabled={isDownloading}
                  >
                    {isDownloading && downloadFormat === "pdf" ? (
                      <>
                        <span className="h-4 w-4 mr-2 animate-spin">◌</span>
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload("docx")}
                      disabled={isDownloading}
                      className="w-full"
                    >
                      {isDownloading && downloadFormat === "docx" ? (
                        <span className="h-4 w-4 animate-spin">◌</span>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          DOCX
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload("html")}
                      disabled={isDownloading}
                      className="w-full"
                    >
                      {isDownloading && downloadFormat === "html" ? (
                        <span className="h-4 w-4 animate-spin">◌</span>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 mr-2" />
                          HTML
                        </>
                      )}
                    </Button>
                  </div>
                </div>
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
                    <span>
                      Quantify achievements with numbers when possible
                    </span>
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
  );
}
