"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { Github, Mail } from "lucide-react"

export default function SignIn() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">AI Research MR</CardTitle>
            <CardDescription>Sign in to access your research workspace</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button variant="outline" onClick={() => signIn("google", { callbackUrl: "/" })}>
            <Mail className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <Button variant="outline" onClick={() => signIn("github", { callbackUrl: "/" })}>
            <Github className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
