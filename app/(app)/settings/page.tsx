"use client"

import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { PageContainer, PageHeader } from "@/components/shell/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/patterns/confirm-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockUser } from "@/lib/mock-data"

export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your profile, workspace, and account preferences."
      />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                This information is shown to colleagues at your school.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="flex items-center gap-4">
                  <Avatar className="size-14">
                    <AvatarFallback className="text-base">
                      {mockUser.initials}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change photo
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="name">Full name</FieldLabel>
                    <Input id="name" defaultValue={mockUser.name} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" defaultValue={mockUser.email} disabled />
                    <FieldDescription>
                      Contact support to change your sign-in email.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="school">School</FieldLabel>
                    <Input id="school" defaultValue={mockUser.school} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="role">Role</FieldLabel>
                    <Input id="role" defaultValue={mockUser.role} />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                onClick={() =>
                  toast.success("Profile updated", {
                    description: "Your changes have been saved.",
                  })
                }
              >
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose what you're notified about.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {[
                {
                  title: "Export completed",
                  description: "Get notified when a paper finishes exporting",
                },
                {
                  title: "Question bank updates",
                  description: "New questions added by your colleagues",
                },
                {
                  title: "Product announcements",
                  description: "Occasional updates about new Qtor features",
                },
              ].map((item, index) => (
                <div key={item.title}>
                  {index > 0 ? <Separator className="my-3" /> : null}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                    <Switch defaultChecked={index !== 2} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle>Delete account</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated papers,
                templates, and question bank contributions.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-end">
              <ConfirmDialog
                trigger={
                  <Button variant="destructive">
                    <Trash2 data-icon="inline-start" />
                    Delete account
                  </Button>
                }
                title="Delete your account?"
                description="This will permanently delete your account, papers, and templates. This action can't be undone."
                confirmLabel="Delete account"
                destructive
                onConfirm={() =>
                  toast.error("This is a placeholder", {
                    description: "Account deletion isn't wired up yet.",
                  })
                }
              />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
