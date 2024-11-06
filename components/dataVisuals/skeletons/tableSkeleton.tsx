import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'

export function TableSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-8 w-full" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Skeleton className="h-5 w-[80px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-[120px]" />
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Skeleton className="h-5 w-[100px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-[80px]" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Skeleton className="h-12 w-[80px] rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-[120px]" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-5 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-[80px]" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Skeleton className="h-12 w-[80px] rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-[120px]" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-5 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-[80px]" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Skeleton className="h-12 w-[80px] rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-[120px]" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-5 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-[80px]" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
