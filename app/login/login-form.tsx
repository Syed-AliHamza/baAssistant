'use client'

import { SignIn, SignedOut } from '@clerk/clerk-react'

export default function LoginForm() {
  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/login-background.png')" }}
      >
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto bg-white/70 rounded-lg shadow-lg overflow-hidden">
          {/* Left Section */}
          <div className="w-full md:w-1/2 p-5 md-p-10">
            <div className="text-left">
              <div className="mb-0 md:mb-[160px]">
                <img
                  src="/images/company-logo.svg"
                  alt="Logo"
                  width={104}
                  height={31}
                />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-0 md-mb-4'">
                TALK TO <br /> YOUR{' '}
                <span className="text-[#003366]">DATA VERSE</span>
              </h1>
              <p className="text-gray-600">
                Empowering businesses with cutting-edge technology and
                generative AI for a competitive edge in the AI era.
              </p>
            </div>
          </div>
          {/* Right Section */}
          <div className="w-full md:w-1/2 p-0 md:p-10 flex items-start md:items-center justify-start md:justify-center">
            <div className="w-full max-w-xs rounded-lg p-6 md-p-0 ">
              <SignedOut>
                <SignIn forceRedirectUrl="/chat" signUpUrl="/signup" />
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
