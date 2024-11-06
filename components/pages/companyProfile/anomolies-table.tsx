import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table'

export default function AnomaliesTable({
  animalInfoTableData,
  beefStudyInfoTableData
}) {
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
        {animalInfoTableData[0]?.map((data, index) => (
          <TableRow key={index}>
            <TableCell>{data['File Name']}</TableCell>{' '}
            <TableCell>{data['Data Point Type']}</TableCell>{' '}
            <TableCell>{data['Data Point Value']}</TableCell>{' '}
            <TableCell>{data['ZScore']}</TableCell>
            <TableCell>{data['Animal_Pattern_Category']}</TableCell>{' '}
          </TableRow>
        ))}
        {beefStudyInfoTableData?.[0]?.map((data, index) => (
          <TableRow key={index}>
            <TableCell>{data['File Name']}</TableCell>{' '}
            <TableCell>{data['Data Point Type']}</TableCell>{' '}
            <TableCell>{data['Data Point Value']}</TableCell>{' '}
            <TableCell>{data['ZScore']}</TableCell>
            <TableCell>{data['Classification']}</TableCell>{' '}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
