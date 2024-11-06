'use server';
import { signOut } from '@/auth'

export const signOutUser = async (): Promise<string> => {
  await signOut()
  return
};
