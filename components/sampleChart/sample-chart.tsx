import React from 'react'
import Chart from 'react-apexcharts'

const SentimentsGraph = ({ salesOvertime = [] }) => {
  let salesData = salesOvertime
  // Hardcoded sales data

  // Process the sales data to extract NetSales and labels, and format NetSales values
  const getMonthName = monthNumber => {
    const date = new Date()
    date.setMonth(monthNumber - 1) // JavaScript months are 0-based
    return date.toLocaleString('en-US', { month: 'long' })
  }

  // Process the sales data to extract NetSales and labels, format NetSales values
  const categories = salesData?.map(
    data => `${getMonthName(data.SalesMonth)} ${data.SalesYear}` // Format for the x-axis labels
  )

  const netSalesData = salesData?.map(
    data => Number(data.NetSales.toFixed()) // Round the NetSales value
  )

  const options = {
    chart: {
      height: 350,
      type: 'bar' // Change type to 'bar' for a bar chart
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%'
      }
    },
    dataLabels: {
      enabled: true, // Enable data labels
      formatter: value => value.toLocaleString() // Format data labels with commas
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45 // Rotates the labels for better readability
      }
    },
    yaxis: {
      title: {
        text: ''
      },
      labels: {
        formatter: value => value.toLocaleString() // Format y-axis labels with commas
      },
      min: Math.min(...netSalesData) - 1000000, // Adjust min to fit the data range
      max: Math.max(...netSalesData) + 1000000 // Adjust max to fit the data range
    },
    colors: ['#003366'], // Custom color for bars
    title: {
      text: ''
    }
  }

  const series = [
    {
      name: '',
      data: netSalesData // Use the rounded NetSales values for the bar series
    }
  ]

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  )
}

export default SentimentsGraph
