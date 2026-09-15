export const dashboardTemplates = [
  { id: "blank", name: "No saved templates yet", description: "Save a paper layout to reuse it here." },
]

export const dashboardTrial = {
  active: true,
  planName: "Premium trial",
  daysRemaining: 9,
  features: [
    { code: "question_bank", name: "Unlimited question bank access", available: true },
    { code: "ocr_import", name: "OCR question import", available: true },
    { code: "custom_templates", name: "Custom paper templates", available: true },
    { code: "pdf_export", name: "High-resolution PDF export", available: true },
    { code: "priority_support", name: "Priority support", available: true },
  ],
}

export const dashboardExportEntitlements = [
  { id: "a4", size: "A4", used: 0, limit: 10 },
  { id: "letter", size: "Letter", used: 0, limit: 10 },
  { id: "legal", size: "Legal", used: 0, limit: 5 },
]
