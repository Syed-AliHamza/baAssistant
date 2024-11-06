import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  WidthType
} from 'docx'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'

function formatColumnName(colName) {
  return colName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatDate = dateString => {
  const date = new Date(dateString)
  return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US') : dateString
}

export const downloadDocument = async ({
  typeOfChart,
  query,
  assumptions,
  explanation,
  filteredData,
  chartRef,
  pieChartRef
}) => {
  const chartDataUrl =
    typeOfChart === 'bar' && chartRef.current
      ? await html2canvas(chartRef.current).then(canvas =>
          canvas.toDataURL('image/png')
        )
      : null

  const pieChartDataUrl =
    typeOfChart === 'bar' && pieChartRef.current
      ? await html2canvas(pieChartRef.current).then(canvas =>
          canvas.toDataURL('image/png')
        )
      : null

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'Query',
            heading: 'Heading1',
            spacing: { before: 200, after: 200 }
          }),
          new Paragraph({
            text: query,
            spacing: { before: 200, after: 200 }
          }),
          new Paragraph({
            text: 'Assumptions',
            heading: 'Heading1',
            spacing: { before: 200, after: 200 }
          }),
          new Paragraph({
            text: assumptions,
            spacing: { before: 200, after: 200 }
          }),
          new Paragraph({
            text: 'Explanation',
            heading: 'Heading1',
            spacing: { before: 200, after: 200 }
          }),
          new Paragraph({
            text: explanation,
            spacing: { before: 200, after: 200 }
          }),
          new Paragraph({
            text: 'Query Response',
            heading: 'Heading1',
            spacing: { before: 200, after: 200 }
          }),
          filteredData.length > 0 &&
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE
              },
              rows: [
                new TableRow({
                  children: Object.keys(filteredData[0] || {}).map(
                    key =>
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: formatColumnName(key),
                            heading: 'Heading6'
                          })
                        ],
                        width: {
                          size: 100 / Object.keys(filteredData[0] || {}).length,
                          type: WidthType.PERCENTAGE
                        },
                        margins: {
                          top: 100,
                          bottom: 100,
                          left: 100,
                          right: 100
                        }
                      })
                  )
                }),
                ...filteredData.map(
                  row =>
                    new TableRow({
                      children: Object.keys(row).map(
                        key =>
                          new TableCell({
                            children: [
                              new Paragraph({
                                text:
                                  Object.prototype.toString.call(row[key]) ===
                                  '[object Date]'
                                    ? formatDate(row[key])
                                    : row?.[key]?.toString()
                              })
                            ],
                            width: {
                              size: 100 / Object.keys(row).length,
                              type: WidthType.PERCENTAGE
                            },
                            margins: {
                              top: 100,
                              bottom: 100,
                              left: 100,
                              right: 100
                            }
                          })
                      )
                    })
                )
              ]
            }),
          ...(typeOfChart === 'bar' && chartDataUrl
            ? [
                new Paragraph({
                  text: 'Comparison of Data Across Categories',
                  heading: 'Heading1',
                  spacing: { before: 200, after: 200 },
                  pageBreakBefore: true
                }),
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: chartDataUrl,
                      transformation: {
                        width: 600,
                        height: 400
                      }
                    })
                  ]
                })
              ]
            : []),
          ...(typeOfChart === 'bar' && pieChartDataUrl
            ? [
                new Paragraph({
                  text: 'Proportional Share of Data',
                  heading: 'Heading1',
                  spacing: { before: 200, after: 200 },
                  pageBreakBefore: true
                }),
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: pieChartDataUrl,
                      transformation: {
                        width: 700,
                        height: 500
                      }
                    })
                  ]
                })
              ]
            : [])
        ].filter(Boolean) // Filter out any undefined elements
      }
    ]
  })

  const buffer = await Packer.toBuffer(doc)
  saveAs(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }),
    'report.docx'
  )
}
