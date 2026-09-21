"use client"
import { PageContainer, PageHeader } from "@/components/shell/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
const states=[['Free','Free to export'],['Paid & entitled','Medium export available'],['Paid & not entitled','Medium — ৳35 to export'],['Tier upgraded','Your paper is now Large — Large papers cost ৳70.'],['Too large','This paper is too large to export. Remove some questions.'],['Empty','Add at least one question first.']]
export default function BillingStates(){if(process.env.NODE_ENV==='production')return null;return <PageContainer><PageHeader title="Billing states" description="Development-only fixtures for reviewing paper pricing and checkout states."/><div className="grid gap-4 md:grid-cols-2">{states.map(([name,copy])=><Card key={name}><CardHeader><CardTitle>{name}</CardTitle></CardHeader><CardContent><Badge variant="outline">Fixture</Badge><p className="mt-3 text-sm">{copy}</p></CardContent></Card>)}</div></PageContainer>}
