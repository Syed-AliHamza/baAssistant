'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'
import Link from 'next/link'

export function LinkToURL({ url }) {
  return (
    <div
      className="text-primary hover:underline cursor-pointer"
      onClick={() => {
        window.open(url, '_blank')
      }}
    >
      {url}
    </div>
  )
}
