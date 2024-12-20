"use client"
import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { IconiFy } from "@/components/Iconify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, z } from "zod";
import { FormProvider, RHFSelect } from "@/components/hook-form";
import { RHFRadioGroupItemShop, RHFRadioGroupPayments } from "@/components/hook-form/RHFRadioGroup";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import RHFCheckbox from "@/components/hook-form/RHFCheckbox";
import Link from "next/link";

import { useSession } from "next-auth/react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import type * as Prisma from "@prisma/client";

export default function PremiumHistory() {

  const route = useRouter()

  const { data: session, status } = useSession()

  const payments = [{ title: 'PayPal', value: 'paypal', img_url: 'string' }]

  //const [categories, setCategories] = useState<Prisma.products_categories[]>([]);
  const [products, setProducts] = useState<any[]>([]);


  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const ShopStepFormSchema = z.object({
    product: z.string(),
    payment: z.string(),
    category: z.enum(['coins_transferable', 'premdays']),
    terms: boolean().default(false)
  })

  type shopStepFormValues = z.infer<typeof ShopStepFormSchema>

  const methods = useForm<shopStepFormValues>({
    resolver: zodResolver(ShopStepFormSchema),
    defaultValues: {
      category: 'premdays'
    }
  })

  const { reset, handleSubmit, watch, setValue, formState: { isSubmitting } } = methods
  const values = watch()

  const handleReset = () => {
    setActiveStep(0);
    reset()
  };
  async function onSubmit(data: shopStepFormValues) {
    console.log('data', data)
  }

  const selectedProduct = products?.filter((p) => p.id.toString() === watch('product'))[0]

  // async function getCategories() {
  //   const req = await fetch('/api/shop/categories')
  //   if (req.ok) {
  //     const body = await req.json()
  //     setCategories(body)
  //   }
  // }

  async function GetProducts(category: string) {

    const req = await fetch(`/api/shop/product/${category}`)

    if (req.ok) {
      const body = await req.json()

      setProducts(body.products.map((p: any) => ({ ...p, img_url: `/shop/${p.img_url}` })))
    }

  }

  // useEffect(() => {
  //   setValue('category', 'premdays')
  // }, [])

  useEffect(() => {

    if (values.category === 'premdays') {
      GetProducts('1')
    }

    if (values.category === 'coins_transferable') {
      GetProducts('2')
    }

    // GetProducts(values.category.toString())

  }, [values.category])

  
  return (
    <>
      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: process.env.NEXT_PUBLIC_CURRENCY ?? 'USD' }}>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Buy Coins</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} id='form'>

              <div className="border rounded-sm">

                <div className="`transition-all duration-300 ease-in-out transform">
                  <div className='flex p-2 items-center justify-between bg-background text-sm border-b '>
                    <div className="flex gap-2 items-center">
                      <IconiFy icon={'healthicons:money-bag-outline'} />
                      Select Product
                    </div>
                    {activeStep > 0 && <IconiFy icon={'ph:check-circle'} className="text-green-600" />}
                  </div>
                  {activeStep === 0 && (
                    <>
                      <div className="p-2 pb-0">

                        <RHFSelect
                          name="Category"
                          LabelOption={'label'} keyValue={'value'}
                          defaultValue={watch('category')}
                          options={[
                            // { label: 'Transferable Coins', value: 'coins_transferable' },
                            { label: 'Vip days', value: 'premdays' },
                            { label: 'Noctera coins', value: 'coins_transferable', }
                          ]}
                          // options={
                          //   categories.map((c) => ({ label: c.name, value: c.id.toString() }))
                          // }
                          onValueChange={(v) => {
                            reset()
                            setValue('category', v as "coins_transferable" | "premdays")
                            // if (v === 'coins') {
                            //   setProducts(PRODUCTS[0])
                            // } else if (v === 'premdays') {
                            //   setProducts(PRODUCTS[1])
                            // }
                          }}
                        />
                      </div>

                      <RHFRadioGroupItemShop
                        name="product"
                        options={products.toSorted(((a, b) => a.quantity! - b.quantity!))}
                        defaultValue={watch('product')}
                      />

                      <div className="p-2 m-2 border rounded-sm text-center">
                        <Typography variant={'body2'} component={'p'}>
                          * Please note that the prices may vary depending on the current exchanger rate.
                        </Typography>
                        <Typography variant={'body2'} component={'p'}>
                          Different prices may apply depending on you selected payment method.
                        </Typography>
                      </div>
                    </>
                  )}
                </div>

                <div className='flex p-2 items-center justify-between bg-background text-sm border-b border-t'>
                  <div className="flex gap-2 items-center">
                    <IconiFy icon={'fluent:payment-28-regular'} />
                    Select payment provider
                  </div>
                  {activeStep > 1 && <IconiFy icon={'ph:check-circle'} className="text-green-600" />}
                </div>

                {activeStep === 1 && (
                  <>
                    <RHFRadioGroupPayments
                      name='payment'
                      options={payments}
                    />
                  </>
                )}
                <div className='flex p-2 items-center justify-between bg-background text-sm border-b border-t'>
                  <div className="flex gap-2 items-center">
                    Checkout
                  </div>
                </div>
                {activeStep == 2 && (
                  <>
                    <div>
                      <Table>
                        <TableBody >
                          <TableRow>
                            <TableCell className="w-[130px]">Product</TableCell>
                            <TableCell><strong>{selectedProduct?.title}</strong></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Price</TableCell>
                            <TableCell><strong>{selectedProduct.price} {selectedProduct.currency}</strong></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Payment Method</TableCell>
                            <TableCell><strong className="">{payments?.filter((p) => p.value === watch('payment'))[0].title}</strong></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Country</TableCell>
                            <TableCell><strong>MX</strong></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>E-Mail Address</TableCell>
                            <TableCell><strong>{session?.user.email}</strong></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <div className="flex justify-end gap-2">
                  <Button
                    disabled={activeStep === 0}
                    onClick={activeStep === 2 ? handleReset : handleBack}
                    variant={"outline"}
                  >
                    {activeStep === 2 ? 'Reset' : 'Cancel'}
                  </Button>
                  {activeStep == 2
                    ? <Dialog>
                      <DialogTrigger asChild>
                        <Button>Checkout</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm your order</DialogTitle>
                        </DialogHeader>
                        <div className="border rounded-sm">
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="w-[130px]">Service</TableCell>
                                <TableCell>{selectedProduct?.title}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Price</TableCell>
                                <TableCell>{selectedProduct.price} {selectedProduct.currency}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Payment Method</TableCell>
                                <TableCell>{payments?.filter((p) => p.value === watch('payment'))[0].title}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Country</TableCell>
                                <TableCell>MX</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>E-Mail Address</TableCell>
                                <TableCell>{session?.user.email}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell colSpan={2}>
                                  <div className="flex items-center gap-2">
                                    <RHFCheckbox name="terms" />
                                    <label htmlFor="terms" className="cursor-pointer"> I have read and I agree to the <Link href={"#"} className="text-blue-500 hover:underline">Extended Tibia Service Agreement</Link> and the <Link href={"#"} className="text-blue-500 hover:underline">Tibia Privacy Policy</Link>.</label>
                                  </div>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <DialogFooter>
                          <Button disabled={isSubmitting} onClick={handleReset} variant={"outline"}>Cancel</Button>
                          <PayPalButtons
                            style={{ layout: "horizontal", color: 'black', height: 32 }}
                            disabled={isSubmitting || !watch('terms')}
                            createOrder={async () => {
                              const res = await fetch('/api/shop/paypal/orders', {
                                method: 'POST',
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  productId: +watch('product'),
                                  currency_code: selectedProduct.currency,
                                  value: selectedProduct.price,
                                  description: selectedProduct?.title
                                })
                              })
                              const order = await res.json()
                              console.log(order)
                              return order.id
                            }}
                            onApprove={async (data, actions) => {
                              try {
                                const response = await fetch(`/api/shop/paypal/orders/${data.orderID}/capture`, {
                                  method: "post",
                                  body: JSON.stringify({
                                    type: watch('category'),
                                    quantity: selectedProduct.quantity,
                                  })
                                })

                                const orderData = await response.json();
                                // Three cases to handle:
                                //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                                //   (2) Other non-recoverable errors -> Show a failure message
                                //   (3) Successful transaction -> Show confirmation or thank you message

                                const errorDetail = orderData?.details?.[0];


                                if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                                  // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                                  // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                                  return actions.restart();
                                } else if (errorDetail) {
                                  // (2) Other non-recoverable errors -> Show a failure message
                                  throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
                                } else if (!orderData.purchase_units) {
                                  throw new Error(JSON.stringify(orderData));
                                } else {
                                  // (3) Successful transaction -> Show confirmation or thank you message
                                  // Or go to another URL:  actions.redirect('thank_you.html');
                                  const transaction = orderData?.purchase_units?.[0]?.payments?.captures?.[0] || orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
                                  route.push('/account-manager/payments-history')
                                  toast({
                                    variant: 'success',
                                    title: `Add ${selectedProduct.quantity} ${watch('category') === 'premdays' ? 'premium days' : 'transferable coins'}`,
                                    description: (
                                      <div>{`Transaction ${transaction.status}: ${transaction.id}`}</div>
                                    ),
                                  })
                                }

                              } catch (error) {
                                console.error(error);
                                toast({
                                  variant: 'destructive',
                                  title: "Account Manager",
                                  description: (
                                    <div>{`Sorry, your transaction could not be processed...<br><br>${error}`}</div>
                                  ),
                                })
                              }


                            }}
                            onCancel={async (data, actions) => {
                              console.log('data', data)
                              await fetch(`/api/shop/paypal/orders/${data.orderID}/cancel`, {
                                method: "post",
                              })
                              toast({
                                variant: 'destructive',
                                title: "Account Manager",
                                description: (
                                  <div>Cancelling payment order.</div>
                                ),
                              })
                            }}
                          />
                        </DialogFooter>



                      </DialogContent>
                    </Dialog>
                    : activeStep === 0 ? <Button variant="green" disabled={!watch('product')} onClick={handleNext}>Continue</Button> : <Button variant="green" disabled={!watch('payment')} onClick={handleNext}>Continue</Button>
                  }
                </div>

              </div>
            </FormProvider>

          </CardContent>
        </Card>
      </PayPalScriptProvider>
    </>
  )
}
