import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/db/prisma';

async function updateUser(userId, externalId) {
  try {

    const updatedUser = await clerkClient().users.updateUser(userId, {
      externalId: externalId
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }


  if (evt.type === 'user.created') {
    const userData = JSON.parse(body)?.data;

    const firstName = userData.first_name;
    const lastName = userData.last_name;
    const email = userData.email_addresses[0]?.email_address;
    const avatar = userData.image_url || null;
    const status = userData.banned ? 'banned' : 'active';
    const clerkId = userData.id

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    let newUser;

    if (existingUser) {
      newUser = await prisma.users.update({
        where: { email },
        data: {
          firstName,
          lastName,
          status,
          avatar,
          clerkId,
        },
      });
    } else {
      newUser = await prisma.users.create({
        data: {
          firstName,
          lastName,
          email,
          status,
          avatar,
          clerkId,
        },
      });
    }
    updateUser(clerkId, newUser.id)

    console.log('User created in the database:', newUser);

  }

  return new Response('', { status: 200 })
}
