import { AuthForm } from '@/components/auth/auth-form'
import { AuthPage } from '@/components/auth/auth-page'

export default function SignUpPage() {
  return <AuthPage eyebrow="Start simply" title="A calmer way to build assessments." description="Create your Qtor account with email and a password."><AuthForm mode="signup" /></AuthPage>
}
