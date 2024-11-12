'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'
import { currentUser } from '@clerk/nextjs/server'
import { ClientSecretCredential } from "@azure/identity";

import { type Chat } from '@/lib/types'
import prisma from '@/lib/db/prisma'
import {
  getTopCustomersByAmountSpent,
  getTopProductsByAmountSpent,
  getTopSalesRepsByAmountSpent,
  getTotalAmountSpentPerMonth,
  getTopProductsBySalesAmount,
  getTopProductsByUnitsSold,
  getDairyMilkYieldAverage,
  getMilkFatPercentage,
  getLactationDuration,
  getDairyStudyDuration,
  getDairyMLK101Yield,
  getDairyMLK102Yield,
  getDairyMLK104Yield,
  getDairyMLK103Yield,
  getBeefYieldAverage,
  getBeefConversationRatio,
  getBeefCF717CaseStudy,
  getBeefCF718CaseStudy,
  getBeefCF500CaseStudy,
  getBeefAnimalInfoForTable,
  getBeefStudyInfoForTable,
  getDairyAnimalInfoForTable,
  getDairyStudyInfoForTable
} from './queries';
import { getDBConnection } from '@/lib/db/mssqlDb'
import nodemailer from 'nodemailer';

const { EMAIL_HOST, SENDER_EMAIL, EMAIL_HOST_PORT, SENDER_EMAIL_PASSWORD } = process.env;


export async function getChats() {
  try {
    const user = await getUser()
    const threads = await prisma.threads.findMany({
      where: {
        userId: {
          in: [user.id],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
      },

    });

    return threads;

  } catch (error) {
    throw new Error(error)
  }
}

export async function getChat(id: any) {
  try {
    const user = await getUser()
    const chat = await prisma.threads.findUnique({
      where: { id, userId: user.id },
      include: {
        messages: true,
      },
    });

    if (!chat || (user.id && chat.userId !== user.id)) {
      return null
    }

    const parsedChat = {
      ...chat,
      messages: chat.messages.map(message => {
        const data = {
          ...message,
          display: JSON.parse(message.display),
        }
        return data
      }),
    }

    return parsedChat
  } catch (error) {
    console.log('here get chat error', error)
    throw new Error(error)
  }
}

export async function removeChat({ id, path }: { id: string; path: string }) {

  await kv.del(`chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {

  return redirect('/')
}

export async function getSharedChat(id: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(id: string) {


  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat) {
    return {
      error: 'Something went wrong'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await kv.hmset(`chat:${chat.id}`, payload)

  return payload
}

export async function saveChat(chat: Chat) {

  try {
    await Promise.all(
      chat.messages.map(message =>
        prisma.messages.create({
          data: {
            role: message.role,
            content: message?.content,
            display: JSON.stringify(message?.display),
            createdAt: new Date(),
            updatedAt: new Date(),
            threadId: chat?.id
          }
        })
      ))

  } catch (error) {
    throw new Error(error)
  }


}

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getMissingKeys() {
  const keysRequired = ['GOOGLE_GENERATIVE_AI_API_KEY']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}





export async function fetchTopCustomers() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getTopCustomersByAmountSpent);
  return result.recordset;
}

export async function fetchTopProductsByAmount() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getTopProductsByAmountSpent);
  return result.recordset;
}

export async function fetchTopSalesReps() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getTopSalesRepsByAmountSpent);
  return result.recordset;
}

export async function fetchTotalAmountPerMonth() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getTotalAmountSpentPerMonth);
  return result.recordset;
}

export async function fetchTopProductsBySales() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getTopProductsBySalesAmount);
  return result.recordset;
}

export async function fetchTopProductsByUnitsSold() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getTopProductsByUnitsSold);
  return result.recordset;
}


export async function getUser() {
  const clerkUser = await currentUser()
  const user = await prisma.users.findUnique({
    where: { email: clerkUser?.primaryEmailAddress?.emailAddress }
  })
  if (!user) {
    throw new Error('User not found')
  }
  return user
}



export async function fetchAverageDairyMilkYield() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getDairyMilkYieldAverage);
  return result.recordset;
}

export async function fetchAverageMilkPercentage() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getMilkFatPercentage);
  return result.recordset;
}

export async function fetchLactationDuration() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getLactationDuration);
  return result.recordset;
}

export async function fetchDairyStudyDuration() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getDairyStudyDuration);
  return result.recordset;
}


export async function fetchDairyMLK101Yield() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getDairyMLK101Yield);
  return result.recordset;
}

export async function fetchDairyMLK102Yield() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getDairyMLK102Yield);
  return result.recordset;
}

export async function fetchDairyMLK103Yield() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getDairyMLK103Yield);
  return result.recordset;
}
export async function fetchDairyMLK104Yield() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getDairyMLK104Yield);
  return result.recordset;
}
export async function fetchBeefYieldAverage() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getBeefYieldAverage);
  return result.recordset;
}
export async function fetchBeefConversationRatiO() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getBeefConversationRatio);
  return result.recordset;
}

export async function fetchgetBeefCF717CaseStudy() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getBeefCF717CaseStudy);
  return result.recordset;
}
export async function fetchgetBeefCF718CaseStudy() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getBeefCF718CaseStudy);
  return result.recordset;
}
export async function fetchBeefCF500CaseStudy() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getBeefCF500CaseStudy);
  return result.recordset;
}
export async function fetchBeefAnimalInfoForTable() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getBeefAnimalInfoForTable);
  return result.recordset;
}
export async function fetchBeefStudyInfoForTable() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getBeefStudyInfoForTable);
  return result.recordset;
}
export async function fetchDairyAnimalInfoForTable() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getDairyAnimalInfoForTable);
  return result.recordset;
}
export async function fetchDairyStudyInfoForTable() {
  const pool = await getDBConnection();
  const result = await pool.request().query(getDairyStudyInfoForTable);
  return result.recordset;
}

async function getAccessToken() {
  const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;

  const data = new URLSearchParams();
  data.append('client_id', process.env.CLIENT_ID);
  data.append('client_secret', process.env.CLIENT_SECRET);
  data.append('scope', 'https://graph.microsoft.com/.default');
  data.append('grant_type', 'client_credentials');

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error response details:', errorDetails);  // Log error details from server
      throw new Error(`HTTP error! status: ${response.status}`);
    }


    const tokenData = await response.json();
    console.log('here token-----------------------', tokenData)
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}
// const credential = new ClientSecretCredential(process.env.TENANT_ID, process.env.CLIENT_ID, process.env.CLIENT_SECRET);




export async function emailSender({ label, receiver, subject, body, cc, bcc }) {

  // const transporter = nodemailer.createTransport({
  //   host: EMAIL_HOST,
  //   port: EMAIL_HOST_PORT,
  //   secure: false,
  //   auth: {
  //     type: 'oauth2',
  //     user: SENDER_EMAIL,
  //     clientId: process.env.CLIENT_ID,
  //     clientSecret: process.env.CLIENT_SECRET,
  //     tenantId: process.env.TENANT_ID,
  //     accessToken: await getAccessToken(),
  //   },
  // });
  // const mailOptions = {
  //   from: { name: label, address: SENDER_EMAIL },
  //   to: receiver,
  //   subject,
  //   cc,
  //   bcc,
  //   html: body,
  // };
  // transporter.sendMail(mailOptions);
};
