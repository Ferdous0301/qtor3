// Static placeholder data for the Phase 1 application shell.
// No network calls — every value here is hardcoded for layout purposes only.

export const mockUser = {
  name: "Ananya Sharma",
  email: "ananya.sharma@greenwood.edu",
  initials: "AS",
  role: "Teacher",
  school: "Greenwood High School",
}

export type PaperStatus = "draft" | "ready" | "exported"

export interface MockPaper {
  id: string
  title: string
  subject: string
  grade: string
  status: PaperStatus
  updatedAt: string
  questionCount: number
}

export const mockRecentPapers: MockPaper[] = [
  {
    id: "p1",
    title: "Mid-Term Physics Assessment",
    subject: "Physics",
    grade: "Grade 11",
    status: "draft",
    updatedAt: "2 hours ago",
    questionCount: 24,
  },
  {
    id: "p2",
    title: "Unit 4 — Organic Chemistry Quiz",
    subject: "Chemistry",
    grade: "Grade 12",
    status: "ready",
    updatedAt: "Yesterday",
    questionCount: 18,
  },
  {
    id: "p3",
    title: "Algebra Foundations Test",
    subject: "Mathematics",
    grade: "Grade 9",
    status: "exported",
    updatedAt: "3 days ago",
    questionCount: 30,
  },
  {
    id: "p4",
    title: "Cell Biology Weekly Test",
    subject: "Biology",
    grade: "Grade 10",
    status: "exported",
    updatedAt: "5 days ago",
    questionCount: 20,
  },
]

export interface MockTemplate {
  id: string
  name: string
  layout: string
  usedCount: number
}

export const mockTemplates: MockTemplate[] = [
  { id: "t1", name: "Standard Cover + Answer Key", layout: "A4 · Single column", usedCount: 12 },
  { id: "t2", name: "Compact Two-Column", layout: "A4 · Two column", usedCount: 7 },
  { id: "t3", name: "Board Exam Format", layout: "Letter · Single column", usedCount: 3 },
]

export interface TrialFeature {
  id: string
  name: string
  description: string
  included: boolean
}

export const trialStatus = {
  active: true,
  daysRemaining: 9,
  planName: "Premium Trial",
  features: [
    {
      id: "f1",
      name: "Unlimited question bank access",
      description: "Search and reuse every question across your school's shared bank",
      included: true,
    },
    {
      id: "f2",
      name: "OCR question import",
      description: "Digitize questions from scanned papers and PDFs",
      included: true,
    },
    {
      id: "f3",
      name: "Custom paper templates",
      description: "Save your own cover pages, headers, and layouts",
      included: true,
    },
    {
      id: "f4",
      name: "High-resolution PDF export",
      description: "Export print-ready papers at 300 DPI",
      included: true,
    },
    {
      id: "f5",
      name: "Priority support",
      description: "Faster response times from the Qtor support team",
      included: true,
    },
  ] satisfies TrialFeature[],
}

export interface ExportEntitlement {
  id: string
  size: string
  used: number
  limit: number
}

export const exportEntitlements: ExportEntitlement[] = [
  { id: "a4", size: "A4", used: 8, limit: 10 },
  { id: "letter", size: "Letter", used: 3, limit: 10 },
  { id: "legal", size: "Legal", used: 0, limit: 5 },
]
