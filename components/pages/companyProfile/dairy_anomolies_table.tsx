import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table'

export default function DairyAnomaliesTable({
  dairyAnimalInfoTableData,
  dairyStudyInfoTableData
}) {
  console.log('here', dairyAnimalInfoTableData)

  return (
    <Table responsiveWidth={false}>
      <TableHeader className="bg-[#F5F6FE]">
        <TableRow>
          <TableHead className="text-[#767077]">File Name</TableHead>
          <TableHead className="text-[#767077]">Data Point Type</TableHead>
          <TableHead className="text-[#767077]">Data Point Value</TableHead>
          <TableHead className="text-[#767077]">Zscore</TableHead>
          <TableHead className="text-[#767077]">Classification</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dairyAnimalInfoTableData?.[0]?.map((data, index) => (
          <TableRow key={index}>
            <TableCell>{data['File Name']}</TableCell>{' '}
            <TableCell>{data['Data Point Type']}</TableCell>{' '}
            <TableCell>{data['Data Point Value']}</TableCell>{' '}
            <TableCell>{data['ZScore']}</TableCell>
            <TableCell>{data['Classification']}</TableCell>{' '}
          </TableRow>
        ))}

        {dairyStudyInfoTableData?.[0]?.map((data, index) => (
          <TableRow key={index}>
            <TableCell>{data['File Name']}</TableCell>{' '}
            {/* Accessing 'File Name' */}
            <TableCell>{data['Data Point Type']}</TableCell>{' '}
            {/* Accessing 'Data Point Type' */}
            <TableCell>{data['Data Point Value']}</TableCell>{' '}
            {/* Accessing 'Data Point Value' */}
            <TableCell>{data['ZScore']}</TableCell> {/* Accessing 'ZScore' */}
            <TableCell>{data['Classification']}</TableCell>{' '}
            {/* Accessing 'Classification' */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
