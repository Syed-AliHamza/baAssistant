// components/ProductTable.js
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table'

const ProductByUnitTable = ({ topProductsByUnits: data }) => {
  return (
    <CardContent>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Rating</TableCell>
          </TableRow>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.ProductName}</TableCell>
              <TableCell>{item.TotalUnits}</TableCell>
              {/* <TableCell>{item.Category}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  )
}

export default ProductByUnitTable
