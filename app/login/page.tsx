import { AuthForm } from '@/components/auth/auth-form'
import { AuthPage } from '@/components/auth/auth-page'

export default function LoginPage() {
  return <AuthPage eyebrow="Welcome back" title="Make your next paper a little easier." description="Sign in to pick up where you left off."><AuthForm mode="login" /></AuthPage>
}
