import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateUserInfo,
  updateCredit,
  getUserLoginRecord,
} from 'wasp/client/operations'
import { z } from 'zod'
import LastLogin from '../components/LastLogin'

const languages = [
  { id: 'english', label: 'English' },
  { id: 'malayalam', label: 'Malayalam' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'tamil', label: 'Tamil' },
]
const formSchema = z.object({
  firstName: z.string().min(1, {
    message: 'First Name must be at least 1 character.',
  }),
  lastName: z.string().min(1, {
    message: 'Last Name must be at least 1 character.',
  }),
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z
    .string()
    .min(1, {
      message: 'Email is required.',
    })
    .email('This is not a valid email'),
  primaryLang: z.enum(['english', 'malayalam', 'hindi', 'tamil'], {
    required_error: 'You need to select a preferred language .',
  }),
  secondaryLang: z.enum(['english', 'malayalam', 'hindi', 'tamil'], {
    required_error: 'You need to select a preferred language .',
  }),
  panNumber: z.string().regex(/^[A-Za-z]{5}\d{4}[A-Za-z]$/, {
    message: 'Invalid PAN number.',
  }),
  phoneNumber: z.string().regex(/^\d{10}$/, {
    message: 'Invalid phone number. It should be a 10-digit number.',
  }),
})
export const UserInfoPage = ({ user }) => {
  const history = useHistory()
  const [data, setData] = useState()
  const { toast } = useToast()
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      username: user?.username ?? '',
      panNumber: user?.panNumber ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      email: user?.email ?? '',
      primaryLang: user?.primaryLang ?? '',
      secondaryLang: user?.secondaryLang ?? '',
    },
  })
  const isLoading = form.formState.isSubmitting
  const [primeLang, setPrimeLang] = useState(user?.primaryLang ?? '')
  const [secondaryLang, setSecondaryLang] = useState(user?.secondaryLang ?? '')
  const handleSubmit = async (formData) => {
    try {
      await updateUserInfo({ ...formData, completeAccount: true })
      if (!user?.completeAccount) {
        toast({
          title: 'Account completed.',
          description:
            'Account has been completed. You will receive 3 free credits.',
        })
        await updateCredit({ credits: 3 })
      } else {
        toast({
          title: 'Account updated.',
          description: 'Account details have been updated.',
        })
      }
      form.reset()
      setTimeout(() => history.push('/chat'), 1000)
    } catch (error) {
      console.log(error.message)
    }
  }
  const fetchUserAgent = async () => {
    const response = await getUserLoginRecord()
    if (response?.userAgent) {
      const sendData = {
        userAgent: response?.userAgent,
        ip: response?.ip,
        regionName: response?.regionName,
        country: response?.country,
      }
      setData(sendData)
    } else {
      console.log('in here damn')
      setData({
        userAgent: 'Windows Chrome 1.0.0',
        ip: '127.0.0.1',
        regionName: 'Kochi',
        country: 'India',
      })
    }
  }
  useEffect(() => {
    fetchUserAgent()
  }, [])
  return (
    <>
      <section className='flex flex-col justify-center items-center min-h-[90svh] gap-2'>
        <Card className='w-full max-w-[95%] sm:max-w-[90%] md:w-[800px] mx-auto p-4 sm:p-6 md:p-8'>
          <CardHeader className='space-y-5 text-center'>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              {!user?.completeAccount ? (
                <>Complete your account to continue.</>
              ) : (
                <>Change user details.</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='space-y-5'
              >
                <div className='flex flex-col md:flex-row gap-4'>
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder='John' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name='lastName'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Doe' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex flex-col md:flex-row gap-4'>
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name='panNumber'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>PAN Number</FormLabel>
                        <FormControl>
                          <Input placeholder='AAAAA8888A' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            placeholder='John Doe'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex flex-col md:flex-row gap-4'>
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name='phoneNumber'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type='phoneNumber'
                            placeholder='1234567890'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='johndoe@example.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex flex-col md:flex-row gap-4'>
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name='primaryLang'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Primary Language</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              setPrimeLang(value)
                              field.onChange(value)
                            }}
                            defaultValue={field.value}
                            className='flex flex-col space-y-1'
                          >
                            {languages.map((lang) => (
                              <FormItem
                                key={lang.id}
                                className='flex items-center space-x-3 space-y-0'
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={lang.id}
                                    disabled={lang.id === secondaryLang}
                                  />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  {lang.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name='secondaryLang'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Secondary Language</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              setSecondaryLang(value)
                              field.onChange(value)
                            }}
                            defaultValue={field.value}
                            className='flex flex-col space-y-1'
                          >
                            {languages.map((lang) => (
                              <FormItem
                                key={lang.id}
                                className='flex items-center space-x-3 space-y-0'
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={lang.id}
                                    disabled={lang.id === primeLang}
                                  />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  {lang.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex flex-col md:flex-row justify-center pt-5 gap-5'>
                  {!user.googleLogin && user?.completeAccount && (
                    <Button
                      onClick={() => history.push('/request-password-reset')}
                    >
                      Reset Password
                    </Button>
                  )}
                  <Button type='submit' disabled={isLoading}>
                    {user?.completeAccount
                      ? 'Update Account'
                      : 'Complete Account'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        {data && <LastLogin data={data} />}
      </section>
    </>
  )
}
