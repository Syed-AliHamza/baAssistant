'use client'

import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useRouter } from 'next/navigation'

const ViewProfilePage = () => {
  const { user } = useUser()
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
    streetAddress: 'Street xx sector G',
    profileImage: '/images/profile-picture.png',
    backgroundImage: '/images/profile-Background.svg'
  }

  const router = useRouter()
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden sm:px-5 h-auto md:min-h-screen">
          <header
            className="relative h-40 bg-cover bg-center"
            style={{ backgroundImage: `url(${users.backgroundImage})` }}
          >
            <div className="absolute inset-0 opacity-25"></div>
          </header>
          <div className="relative -top-8 left-6 block sm:flex sm:items-center sm:justify-start text-black">
            <div>
              <img
                src={user?.imageUrl}
                alt="Profile"
                className="size-32 border-4 object-cover"
                style={{ borderColor: '#BFBCC0' }}
              />
            </div>
            <div className="ml-0 sm:ml-6">
              <h1 className="mt-4 text-3xl font-semibold">{user?.firstName}</h1>
              {/* <p className="text-lg">{users.role}</p> */}
            </div>
          </div>

          <main className=" px-6 pb-6">
            <div
              className="block sm:flex justify-between border-b"
              style={{ borderColor: '#BFBCC0' }}
            >
              <h2 className="text-2xl font-bold">{user?.fullName}</h2>
              <div>
                <Button
                  onClick={() => {
                    router.push('/editProfile')
                  }}
                  variant="purple"
                  className="mb-6 px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
            <section
              className="bg-gray-50 p-4 mt-6 border rounded-lg shadow-md"
              style={{ borderColor: '#BFBCC0' }}
            >
              <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.firstName && (
                  <div className="block lg:flex">
                    <p className="font-semibold w-[200px]">First name:</p>
                    <p>{user?.firstName}</p>
                  </div>
                )}

                {user?.lastName && (
                  <div className="block lg:flex">
                    <p className="font-semibold w-[200px]">Last name:</p>
                    <p>{user?.lastName}</p>
                  </div>
                )}

                {user?.emailAddresses && (
                  <div className="block lg:flex">
                    <p className="font-semibold w-[200px]">Email address:</p>
                    <p>
                      <span>{user?.emailAddresses[0].emailAddress}</span>
                    </p>
                  </div>
                )}
                {/* <div className="block lg:flex">
                <p className="font-semibold w-[200px]">User Role:</p>
                <p>{users.role}</p>
              </div> */}
                <div className="block lg:flex items-center">
                  <p className="font-semibold w-[200px]">Status:</p>
                  <p>
                    <span className="inline-block px-2 py-1 bg-green-200 text-green-800 rounded-full">
                      {users.status}
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* <section className="bg-gray-50 p-4 mt-6 border rounded-lg shadow-md" style={{ borderColor: '#BFBCC0' }}>
            <h3 className="text-lg font-semibold mb-2">Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="block lg:flex">
                <p className="font-semibold w-[200px]">Country:</p>
                <p>{user.country}</p>
              </div>
              <div className="block lg:flex">
                <p className="font-semibold w-[200px]">State:</p>
                <p>{user.state}</p>
              </div>
              <div className="block lg:flex">
                <p className="font-semibold w-[200px]">City:</p>
                <p>{user.city}</p>
              </div>
              <div className="block lg:flex">
                <p className="font-semibold w-[200px]">Street address:</p>
                <p>{user.streetAddress}</p>
              </div>
            </div>
          </section> */}
          </main>
        </div>
      </div>
    </>
  )
}

export default ViewProfilePage
