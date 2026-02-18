import { Suspense } from "react"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata = {
  title: "Sign Up - The Chattala",
  description: "Create a new account",
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  )
}
