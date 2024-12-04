
import { Metadata } from "next"

import { UseRegisterForm } from "./components/user-register-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/Typography";

import configLua from "@/hooks/configLua";
import { ScrollArea } from "@/components/ui/scroll-area";
const lua = configLua()


export const metadata: Metadata = {
  title: "Create Account",
  description: "Login forms built using the components.",
}

export default function Register() {
  return (
    <>
      <Card className="rounded-md relative text-foreground">
        <CardHeader className="border-b">
          <CardTitle>Create New Account</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-1 gap-3">  
          <div>
            <UseRegisterForm />
          </div>
        </CardContent>
      </Card>
    </>
  )
}