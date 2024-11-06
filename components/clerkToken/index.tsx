'use client'

/**
 *
 * WatchList
 *
 */

import { useSession } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useAuthContext } from '../../context/authContext'

function ClerkToken() {
  const { session } = useSession()
  const { setUser } = useAuthContext()
  const user = session?.user

  const fetchUser = async clerkId => {
    try {
      const response = await fetch(`/api/users/${clerkId}`)
      return response.json()
    } catch (error) {
      console.log('error', error)
    }
  }
  useEffect(() => {
    const fetchToken = async () => {
      if (session) {
        const jwt = await session.getToken({ template: 'authtoken' })
        if (user) {
          // const userObj = await fetchUser(
          //   user?.primaryEmailAddress?.emailAddress
          // )
          setUser({
            data: {
              // id: userObj.id,
              email: user.primaryEmailAddress?.emailAddress,
              profile_image: user?.imageUrl,
              username: user.firstName
            },
            isAuthenticated: true,
            message: 'Login Successful',
            token: jwt
          })
        }
      }
    }

    fetchToken()
  }, [session, user])

  return <></>
}

export default ClerkToken
