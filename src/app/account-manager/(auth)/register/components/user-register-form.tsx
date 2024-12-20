"use client"
import * as React from "react"

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FormProvider, RHFSelect, RHFTextField } from "@/components/hook-form"
import { Icon } from '@iconify/react'
import Link from "next/link"
import RHFCheckbox from "@/components/hook-form/RHFCheckbox";


interface UseRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> { }

const passwordUppercase = z.string().regex(/[A-Z]/, 'The password should contain at least 1 uppercase character');
const passwordLowercase = z.string().regex(/[a-z]/, 'The password must contain at least one lowercase letter');
const passwordDigit = z.string().regex(/\d/, 'The password must contain at least one numeric digit');
const passwordSpecialChar = z.string().regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'The password must contain at least one special character');

const sexOptions = [{ value: '0', label: 'Female' }, { value: '1', label: 'Male' }]
const vocationOptions = [{value: '1', label: 'Sorcerer' }, {value: '2', label: 'Druid'}, {value: '3', label: 'Paladin'}, {value: '4', label: 'Knight'}]

export function UseRegisterForm({ className, ...props }: UseRegisterFormProps) {
  const router = useRouter();
  const { toast } = useToast()

  const loginFormSchema = z.object({
    accountName: z.string(),
    email: z.string().email(),
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres')
      .and(passwordUppercase)
      .and(passwordLowercase)
      .and(passwordDigit)
      .and(passwordSpecialChar),
    passwordConfirm: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres')
      .and(passwordUppercase)
      .and(passwordLowercase)
      .and(passwordDigit)
      .and(passwordSpecialChar),
    characterName: z.string(),
    gender: z.string(),
    wLocation: z.string().optional(),
    wType: z.string().optional(),
    terms: z.boolean().default(false),
    vocation: z.string().default('1'),
  })

  type LoginFormValues = z.infer<typeof loginFormSchema>

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      gender: '0',
      vocation: '1'
    }
  })

  const { handleSubmit, watch, formState: { isSubmitting }, trigger } = methods

  async function onSubmit(data: LoginFormValues) {
    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.accountName,
        email: data.email,
        password: data.password,
        gender: data.gender === '0' ? 'female' : 'male',
        characterName: data.characterName,
        vocation: data.vocation
      }),
    }).then(async (res) => {
      if (res.status === 200) {
        toast({
          title: "Create Account",
          description: (
            <div>Account has been created.</div>
          ),
        })
        return router.push('/account-manager/login');

      } else {
        const { error } = await res.json();
        toast({
          title: "Error:",
          variant: 'destructive',
          description: (
            <div>{error}</div>
          ),
        })
      }
    });


  }

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RHFTextField

            name="accountName"
            label="Account Name"
            disabled={isSubmitting}
            onChange={() => {trigger("accountName")}}
          />

          <RHFTextField
            className="border-input"
            name="email"
            label="Email Address"
            placeholder="email@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isSubmitting}
            onChange={() => {trigger("email")}}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RHFTextField
          
            placeholder="********"
            name="password"
            label="Password"
            type="password"
            disabled={isSubmitting}
            onChange={() => {trigger("password")}}
          />
          <RHFTextField
            placeholder="********"
            name="passwordConfirm"
            label="Password Again"
            type="password"
            disabled={isSubmitting}
            onChange={() => {trigger("passwordConfirm")}}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RHFTextField
            name="characterName"
            label="Character Name"
            disabled={isSubmitting}
            onChange={() => {trigger("characterName")}}
          />
          <RHFSelect
            LabelOption={'label'} keyValue={'value'}
            name="gender"
            label="Sex"
            defaultValue={'0'}
            options={sexOptions}
            onValueChange={() => {trigger("gender")}}
          />
        </div>

        <div className="gird gird-cols-1 sm:grid-cols-1 gap-4">
          <RHFSelect
              LabelOption={'label'} keyValue={'value'}
              name="vocation"
              label="Vocation"
              defaultValue={'1'}
              options={vocationOptions}
              onValueChange={() => {trigger("vocation")}}
            />
        </div>

        <div className="grid gap-2">
          <div className="grid gap-1">
            <h4 className="text-sm font-medium">World Location:</h4>
            <RadioGroup defaultValue="All" className="grid grid-cols-4 gap-4">
              <div>
                <RadioGroupItem value="All" id="All" className="peer sr-only" />
                <Label
                  htmlFor="All"
                  className="transition-colors flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  All
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="europe"
                  id="europe"
                  className="peer sr-only"
                  disabled
                />
                <Label
                  htmlFor="europe"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900 cursor-pointer"
                >
                  Europe
                </Label>
              </div>
              <div>
                <RadioGroupItem value="north-america" id="north-america" className="peer sr-only" disabled />
                <Label
                  htmlFor="north-america"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900 cursor-pointer"
                >
                  North America
                </Label>
              </div>
              <div>
                <RadioGroupItem value="south-america" id="south-america" className="peer sr-only" disabled />
                <Label
                  htmlFor="south-america"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900 cursor-pointer"
                >
                  South America
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-1">
            <h4 className="text-sm font-medium">World Type:</h4>
            <RadioGroup defaultValue="open-pvp" className="grid grid-cols-4 gap-4">
              <div>
                <RadioGroupItem value="pvp" id="pvp" className="peer sr-only" disabled />
                <Label
                  htmlFor="pvp"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900 cursor-pointer"
                >
                  Optional PvP
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="open-pvp"
                  id="open-pvp"
                  className="peer sr-only"
                  
                />
                <Label
                  htmlFor="open-pvp"
                  className="transition-colors flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-card-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  Open PvP
                </Label>
              </div>
              <div>
                <RadioGroupItem value="retro-pvp" id="retro-pvp" className="peer sr-only"  disabled/>
                <Label
                  htmlFor="retro-pvp"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900 cursor-pointer"
                >
                  Retro Open PvP
                </Label>
              </div>
              <div>
                <RadioGroupItem value="retro-hard-pvp" id="retro-hard-pvp" className="peer sr-only" disabled />
                <Label
                  htmlFor="retro-hard-pvp"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900 cursor-pointer"
                >
                  Retro Hardcore PvP
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className=" flex flex-row gap-2 justify-end">
            <RHFCheckbox
              name="terms"
              label="Acepto los terminos y condiciones"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant={'link'} asChild className="sm:order-1 order-2">
              <Link href="/account-manager/login" >
                Back to login
              </Link>
            </Button>
            <Button disabled={isSubmitting || !watch('terms')} type="submit" className="sm:order-2 order-1">
              {isSubmitting ? (<Icon icon="eos-icons:loading" className="h-4 w-4 animate-spin" />) : 'Create Account'}
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  )
}