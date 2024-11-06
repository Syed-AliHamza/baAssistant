'use client'

import { ClerkProvider, RedirectToSignIn, useClerk } from '@clerk/nextjs';
const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const ClerkWrapper = ({ children }) => {
  return (
    <ClerkProvider frontendApi={clerkFrontendApi}>
      {children}
    </ClerkProvider>
  );
};

export default ClerkWrapper;
