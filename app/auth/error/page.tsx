"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  const getErrorMessage = () => {
    if (errorDescription) {
      return errorDescription
    }

    switch (error) {
      case "access_denied":
        return "Access was denied. You may have cancelled the authentication or the provider rejected the request."
      case "server_error":
        return "A server error occurred during authentication. Please try again later."
      case "temporarily_unavailable":
        return "The authentication service is temporarily unavailable. Please try again later."
      default:
        return "An error occurred during authentication. Please try again."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-red-600">
            Authentication Error
          </CardTitle>
          <CardDescription>
            There was a problem signing you in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              {getErrorMessage()}
            </p>
            {error && (
              <p className="text-xs text-red-600 mt-2">
                Error code: {error}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href="/login">
              Try Again
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">
              Go Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
