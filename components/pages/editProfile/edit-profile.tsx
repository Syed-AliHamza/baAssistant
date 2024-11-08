'use client'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { UserProfile } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'

const FormSchema = z.object({
  firstName: z.string().nonempty({ message: 'First name is required' }),
  lastName: z.string().nonempty({ message: 'Last name is required' }),
  emailAddress: z.string().email({ message: 'Invalid email address' }),
  phoneNo: z.string().nonempty({ message: 'Phone number is required' }),
  country: z.string().nonempty({ message: 'Country is required' }),
  state: z.string().nonempty({ message: 'State is required' }),
  city: z.string().nonempty({ message: 'City is required' }),
  streetAddress: z.string().nonempty({ message: 'Street Address is required' })
})

const EditProfilePage = () => {
  const { user } = useUser()
  // Initialize react-hook-form
  const formData = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      phoneNo: '',
      country: '',
      state: '',
      city: '',
      streetAddress: ''
    }
  })

  // Submit handler
  const onSubmit = (data: any) => {
    console.log('Submitted data:', data)
  }

  const users = {
    name: 'Adam Smith',
    role: 'Manager',
    email: 'jack34@gmail.com',
    status: 'Active',
    firstName: 'Jack',
    lastName: 'Adam',
    country: 'United States of America',
    state: 'Mexico',
    city: 'Zamora',
    phone: '00000',
    streetAddress: 'Street xx sector G',
    profileImage: 'https://i.ibb.co/86TTkbD/image-3.png',
    backgroundImage: 'https://i.ibb.co/PYZt7Qk/planet-with-light-1.png'
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden profile-main-page">
        {/* <header
          className="relative h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${users.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black opacity-25"></div>
        </header> */}
        {/* <div className="relative -top-8 left-6 block sm:flex sm:items-center sm:justify-start text-black">
          <img
            src={user?.imageUrl}
            alt="Profile"
            className="size-32 border-4 object-cover"
            style={{ borderColor: '#BFBCC0' }}
          />
          <div className="ml-0 sm:ml-6">
            <h1 className="mt-4 text-3xl font-semibold">{user?.fullName}</h1>
          </div>
        </div> */}

        {/* <main className="pl-6 pt-0 sm:p-6">
          <div className="block sm:flex justify-between">
            <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
            <div>
              <Button
                variant="purple"
                className="mb-6 px-4 py-2 text-white rounded-lg shadow-md hover:bg-purple-700"
              >
                Change Password
              </Button>
            </div>
          </div>
          <section className="bg-gray-50 p-4">
            <div className="max-w-1xl mx-auto">
              <FormProvider {...formData}>
                <form
                  onSubmit={formData.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div
                    className="bg-gray-50 p-4 mt-6 border rounded-lg shadow-md"
                    style={{ borderColor: '#BFBCC0' }}
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      Personal Details
                    </h3>
                    <div className="block md:flex max-w-full">
                      <div className="w-full md:w-1/4">
                        <FormField
                          control={formData.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your first name"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Your first name as it appears in official
                                documents.
                              </FormDescription>
                              <FormMessage>{errors.firstName?.message}</FormMessage>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="ml-0 md:ml-3 w-full md:w-1/4">
                        <FormField
                          control={formData.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your last name"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Your last name as it appears in official
                                documents.
                              </FormDescription>
                               <FormMessage>{formData.errors.lastName?.message}</FormMessage> *
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="block md:flex max-w-full">
                      <div className="w-full md:w-1/4">
                        <FormField
                          control={formData.control}
                          name="emailAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Enter your email address"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                We’ll use this email address to contact you.
                              </FormDescription>
                              <FormMessage>{errors.emailAddress?.message}</FormMessage> 
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="ml-0 md:ml-3 w-full md:w-1/4">
                        <FormField
                          control={formData.control}
                          name="phoneNo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone No</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter your phone number"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                We’ll use this phone number to contact you.
                              </FormDescription>
                              <FormMessage>{formData.errors.phoneNo?.message}</FormMessage>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-gray-50 p-4 mt-6 border rounded-lg shadow-md"
                    style={{ borderColor: '#BFBCC0' }}
                  >
                    <h3 className="text-lg font-semibold mb-4">Address</h3>
                    <div className="block md:flex max-w-full">
                      <div className="w-full md:w-1/4">
                        <FormField
                          control={formData.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your country"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Your country of residence.
                              </FormDescription>
                              <FormMessage>{errors.country?.message}</FormMessage> 
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="ml-0 md:ml-3 w-full md:w-1/4">
                        <FormField
                          control={formData.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your state"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Your state of residence.
                              </FormDescription>
                              <FormMessage>{errors.state?.message}</FormMessage>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="ml-0 md:ml-3 w-full md:w-1/4">
                        <FormField
                          control={formData.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your city"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Your city of residence.
                              </FormDescription>
                               <FormMessage>{errors.state?.message}</FormMessage> 
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="block md:flex max-w-full">
                      <div className="w-full md:w-1/2">
                        <FormField
                          control={formData.control}
                          name="streetAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your Street Address"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter Your Street Address.
                              </FormDescription>
                               <FormMessage>{errors.country?.message}</FormMessage> 
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-#003366-600 flex">
                    <Button variant="outline">Cancle</Button>
                    <Button
                      variant="outline"
                      className=" hover:bg-purple-700"
                      type="submit"
                    >
                      Update
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </section>
        </main> */}
        <UserProfile
          routing="hash"
          appearance={{
            elements: {
              profileSection__emailAddresses: {
                display: 'none'
              }
            }
          }}
        />
      </div>
    </div>
  )
}

export default EditProfilePage
