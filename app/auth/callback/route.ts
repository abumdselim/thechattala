import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const redirect = searchParams.get("redirect") || "/"
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=${error}&error_description=${errorDescription || ""}`
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(
        `${origin}/auth/error?error=exchange_failed&error_description=${exchangeError.message}`
      )
    }

    return NextResponse.redirect(`${origin}${redirect}`)
  }

  return NextResponse.redirect(`${origin}/auth/error?error=no_code`)
}
