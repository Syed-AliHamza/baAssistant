'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card'
import Link from 'next/link'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { PiChartLayout } from '../../../components/piChart/pi-chart'
import SentimentsGraph from '@/components/sampleChart/sample-chart'
import { useUser } from '@clerk/nextjs'
import ProductTable from './productBySales'
import ProductByUnitTable from './productByUnit'

import CustomTabs from '@/components/dashboard-tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import WeeklyControlHighGainChart from './bar-chart'
import Summary from './kpi-summary'
import StudyProgressChart from './study-progrees-chart'
import AnomiliesTable from './anomolies-table'
import { useEffect, useState } from 'react'
import WeeklyControlHighStudyChart from './bar-chat-MLK-Study'
import CaseStudy717Chart from './bar-chart-CF717Study'
import CaseStudy718Chart from './bar-chart-CF718Study'
import DairyAnomaliesTable from './dairy_anomolies_table'
import BeefStudyProgressChart from './beef-study-progress-chart'
import ChatIcon from './chatNova'

function ClipboardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}

function LightbulbIcon(props: any) {
  return (
    <svg
      {...props}
      className="text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      className="text-yellow-500"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

const CompanyProfilePage = ({
  data,
  milkYieldData,
  milkPercentageData,
  averageLactationDurationData,
  averageDairyStudyDurationData,
  averageDairyMLK101Yield,
  averageDairyMLK102Yield,
  averageDairyMLK103Yield,
  averageDairyMLK104Yield,
  averageBeefYield,
  averageBeefConversationRatio,
  averageBeefF717CaseStudyYield,
  averageBeefF718CaseStudyYield,
  animalInfoTableData,
  beefStudyInfoTableData,
  dairyAnimalInfoTableData,
  dairyStudyInfoTableData
}) => {
  const users = {
    profileImage: '/images/profile-picture.png',
    backgroundImage: '/images/profile-Background.svg'
  }

  const [case1, setSetCase1] = useState(true)
  const [case2, setSetCase2] = useState(false)
  const [beefCase1, setBeefCase1] = useState(true)
  const [beefCase2, setBeefCase2] = useState(true)

  const [tabData, setTabData] = useState('dairy')
  const [selectedData, setSelectedData] = useState(
    tabData === 'dairy'
      ? averageDairyMLK101Yield
      : averageBeefF717CaseStudyYield
  )

  useEffect(() => {
    setSelectedData(
      tabData === 'dairy'
        ? averageDairyMLK101Yield
        : averageBeefF717CaseStudyYield
    )
  }, [tabData, averageDairyMLK101Yield, averageBeefF717CaseStudyYield])

  const [selectedBeefValue, setSelectedBeefValue] = useState('CF717')

  const handleTabChange = tabValue => {
    setTabData(tabValue)
    setSelectedBeefValue('CF717')
  }

  const handleDataChange = value => {
    if (value === 'MLK102') {
      setSetCase1(true)
      setSelectedData(averageDairyMLK102Yield)
    } else if (value === 'MLK103') {
      setSetCase1(false)
      setSetCase2(true)
      setSelectedData(averageDairyMLK103Yield)
    } else if (value === 'MLK104') {
      setSetCase1(false)
      setSetCase2(true)
      setSelectedData(averageDairyMLK104Yield)
    } else {
      setSetCase1(true)
      setSelectedData(averageDairyMLK101Yield)
    }
  }
  const handleBeefDataChange = value => {
    if (value === 'CF717') {
      setSelectedData(averageBeefF717CaseStudyYield)
    } else if (value === 'CF718') {
      setBeefCase1(false)
      setBeefCase2(true)
      setSelectedData(averageBeefF718CaseStudyYield)
    } else {
      setBeefCase1(true)
      setSelectedData(averageBeefF717CaseStudyYield)
    }
  }

  const { user } = useUser()
  const [
    distributionChannels,
    salesOvertime,
    topProductsBySales,
    topProductsByUnits
  ] = data || []

  const tabsData = [
    {
      value: 'dairy',
      label: 'Dairy'
    },
    {
      value: 'beef',
      label: 'Beef'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <header
          className="relative h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${users.backgroundImage})` }}
        >
          <div className="absolute inset-0 opacity-25"></div>
        </header>
        <div className="grid  m-0 p-0  md:grid-cols-1 lg:grid-cols-1">
          <div className="relative -top-16 px-10 block xl:flex xl:items-center xl:justify-start text-black">
            <img
              src="/images/Korin-logo.svg"
              alt="Profile"
              className="p-3 size-32 rounded object-contain border bg-white border-[#BFBCC0]"
            />
            <div className="ml-0 my-[20px] xl:ml-4 xl:my-0 p-[12px] rounded border border-[#BFBCC0] bg-white min-h-[17.5vh] overflow-auto ">
              <h6 className="text-[#524E53] font-inter text-2xl font-semibold">
                Purina
              </h6>
              <p className="m-0 p-0">
                Purina Animal Nutrition, a division of the Fortune 500 company
                Land O'Lakes, is a leader in delivering innovative,
                science-based feed products for livestock and companion animals.
                With a commitment to research and development, Purina provides
                nutrition solutions that enhance the health and performance of
                animals, supporting species such as dairy and beef cattle,
                horses, pigs, poultry, and pets. As part of a global
                agribusiness, Purina strives to advance animal health and
                productivity through cutting-edge nutritional strategies.
              </p>
            </div>
          </div>
        </div>
        <div className="relative -top-16">
          <div className="flex justify-between items-center px-8 py-0  mb-0">
            <div className="text-[#524E53] font-inter text-2xl font-semibold">
              Dashboard
            </div>
            <div className="flex space-x-4 mt-5">
              <CustomTabs tabs={tabsData} onTabChange={handleTabChange} />
            </div>
          </div>

          <main className="px-6 pt-0 sm:p-6">
            <div className="p-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="col-span-2 lg:col-span-1 bg-[#F5F6FE]">
                  <div className="flex items-center space-x-2 p-5">
                    <div className="flex items-center justify-center bg-[#309F34] text-white rounded-full p-2">
                      <ClipboardIcon className="text-white size-6" />{' '}
                    </div>
                    <div className="text-[#524E53] font-inter text-2xl font-semibold">
                      Daily Summary
                    </div>
                  </div>
                  <CardContent>
                    {tabData === 'beef' ? (
                      <p>
                        The beef cattle research dashboard provides a
                        comprehensive overview of four key studies, focusing on
                        crossbreeding, fat deposition, feed efficiency, and
                        rotational grazing. In BC500, crossbreeding between
                        Brahman, Angus, and Hereford cattle is analyzed,
                        revealing that Brahman x Angus (F1) cattle exhibit the
                        highest weight gain of 2.8 lbs/day with a heterosis
                        retention of 85%. The BC501 study highlights that Wagyu
                        cattle on a high-roughage diet demonstrate superior
                        marbling (7.5) compared to Angus on a high-energy diet,
                        indicating the importance of feed type in premium beef
                        production. These findings are crucial for optimizing
                        breeding and feed strategies for enhanced productivity
                        and profitability.In calf growth studies, CF717 shows
                        that high-grain feed improves weight gain efficiency,
                        with calves gaining an average of 2.5 lbs/day and a feed
                        conversion ratio of 6.0. In CF718, calves raised on
                        high-quality pasture with supplementary low-grain feed
                        achieved the highest average weight gain of 3.1 lbs/day,
                        demonstrating the benefits of rotational grazing
                        combined with strategic feeding. These insights help
                        define best practices for feeding strategies and
                        sustainable farming operations, offering data-driven
                        solutions for improving calf growth, feed utilization,
                        and overall health outcomes.
                      </p>
                    ) : (
                      <p>
                        The dashboard summarizes the findings from various dairy
                        studies, showing that high-grain feed in MLK101
                        increased milk yield by 20% compared to the control,
                        with a slightly lower fat percentage. In MLK102, grain
                        supplementation during rotational grazing led to the
                        highest milk yield and fat percentage. MLK103
                        demonstrated that high-grain feed resulted in the
                        longest lactation period (220 days) and the highest milk
                        output. Finally, MLK104 revealed that Jersey cows on
                        silage diets produced the highest milk fat percentage
                        (4.2%), while Holsteins on grain had lower fat content
                        (3.8%). These results help refine feeding strategies for
                        optimal milk production and quality across
                        breeds.Building on these findings, the studies highlight
                        the importance of tailoring feeding strategies to both
                        the breed and the specific goals of milk production.
                        High-grain feed consistently supports higher yields,
                        making it suitable for farms focused on maximizing
                        production, while silage may be more appropriate for
                        increasing milk fat content, especially in Jersey cows.
                        Rotational grazing with grain supplementation, as seen
                        in MLK102, offers a balanced approach by improving both
                        yield and fat percentage. Additionally, the prolonged
                        lactation periods observed in MLK103 with high-grain
                        diets emphasize the feed's role in sustaining milk
                        production over time, providing insights for long-term
                        dairy management strategies.
                      </p>
                    )}
                  </CardContent>
                </Card>
                <Card className="col-span-2 lg:col-span-1 bg-[#F5F6FE]">
                  <div className="flex items-center space-x-2 p-5">
                    <div className="flex items-center justify-center bg-[#3B86F7] text-white rounded-full p-2">
                      <ClipboardIcon className="text-white size-6" />{' '}
                    </div>
                    <div className="text-[#524E53] font-inter text-2xl font-semibold">
                      Key Takeaways
                    </div>
                  </div>
                  <Card className="col-span-2 lg:col-span-1 m-5 mt-0">
                    <div className="flex items-left space-x-2 p-5">
                      <div>
                        <LightbulbIcon />{' '}
                      </div>
                      {tabData === 'beef' ? (
                        <div>
                          Crossbreeding between brahman and angus (f1) resulted
                          in the highest weight gain (2.8 lbs/day), with a
                          heterosis retention of 85%.
                        </div>
                      ) : (
                        <div>
                          High-grain feed increased milk yield by 20% over the
                          control group.
                        </div>
                      )}
                    </div>
                  </Card>
                  <Card className="col-span-2 lg:col-span-1 m-5">
                    <div className="flex items-left space-x-2 p-5">
                      <div>
                        <LightbulbIcon />{' '}
                      </div>
                      {tabData === 'beef' ? (
                        <div>
                          Wagyu cattle under a high-roughage diet showed
                          superior marbling (7.5) and fat deposition compared to
                          Angus.
                        </div>
                      ) : (
                        <div>
                          Milk fat percentage remained stable at 3.5% for the
                          high-grain group but was 4.0% for the control.
                        </div>
                      )}
                    </div>
                  </Card>
                  <Card className="col-span-2 lg:col-span-1 m-5">
                    <div className="flex items-left space-x-2 p-5">
                      <div>
                        <LightbulbIcon />{' '}
                      </div>
                      {tabData === 'beef' ? (
                        <div>
                          High-grain feed increased weight gain efficiency (2.5
                          lbs/day), with an average feed conversion ratio of
                          6.0.
                        </div>
                      ) : (
                        <div>
                          Optimizing high-grain feed may lead to increased yield
                          without compromising fat quality.
                        </div>
                      )}
                    </div>
                  </Card>
                  <Card className="col-span-2 lg:col-span-1 m-5">
                    <div className="flex items-left space-x-2 p-5">
                      <div>
                        <LightbulbIcon />{' '}
                      </div>
                      {tabData === 'beef' ? (
                        <div>
                          Calves on high-quality pasture with supplementary
                          low-grain feed achieved the highest average weight
                          gain (3.1 lbs/day).
                        </div>
                      ) : (
                        <div>
                          Crossbred cows on a mixed ration exhibited a balanced
                          milk yield of 10.5 gal/day with a consistent 4.0% fat
                          content.
                        </div>
                      )}
                    </div>
                  </Card>
                  <Card className="col-span-2 lg:col-span-1 m-5">
                    <div className="flex items-left space-x-2 p-5">
                      <div>
                        <LightbulbIcon />{' '}
                      </div>
                      {tabData === 'beef' ? (
                        <div>
                          Across all studies, diet plays a significant role in
                          both growth and meat quality, with high-grain and
                          high-roughage feeds delivering optimal results in
                          weight gain and marbling, respectively.
                        </div>
                      ) : (
                        <div>
                          Crossbred cows on a mixed ration exhibited a balanced
                          milk yield of 10.5 gal/day with a consistent 4.0% fat
                          content.
                        </div>
                      )}
                    </div>
                  </Card>
                </Card>
              </div>
              {/* <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Distribution Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full mt-4 md:mt-0">
                    <PiChartLayout
                      distributionChannels={distributionChannels}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sales Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <SentimentsGraph salesOvertime={salesOvertime} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 overflow-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products by Sales</CardTitle>
                </CardHeader>
                <ProductTable topProductsBySales={topProductsBySales} />
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Products By Units</CardTitle>
                </CardHeader>
                <ProductByUnitTable topProductsByUnits={topProductsByUnits} />
              </Card>
            </div> */}
            </div>
          </main>
          <div className="mx-8 mb-5 my-[20px] xl:mx-8 p-[12px] rounded border border-[#BFBCC0] bg-white min-h-[17.5vh] overflow-auto">
            <div className="flex justify-between items-center space-x-2 p-2">
              <div>Effect Of Higher-Grain Diet On High Milk Production</div>
              <div className="flex space-x-1">
                {' '}
                {/* Reduced space */}
                {tabData === 'beef' ? (
                  <>
                    <Select
                      value={selectedBeefValue}
                      onValueChange={handleBeefDataChange}
                    >
                      {' '}
                      {/* Set default value */}
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CF717">CF717</SelectItem>
                        <SelectItem value="CF718">CF718</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <>
                    <Select
                      defaultValue="MLK101"
                      onValueChange={handleDataChange}
                    >
                      {' '}
                      {/* Set default value */}
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MLK101">MLK101</SelectItem>
                        <SelectItem value="MLK102">MLK102</SelectItem>
                        <SelectItem value="MLK103">MLK103</SelectItem>
                        <SelectItem value="MLK104">MLK104</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
                <Select defaultValue="light">
                  {' '}
                  {/* Set default value */}
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Last 3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mx-8 mb-5 my-[20px] xl:mx-4 p-[6px] rounded border border-[#BFBCC0] bg-white min-h-[17.5vh] overflow-auto">
              {tabData === 'beef' ? (
                <>
                  {' '}
                  {beefCase1 ? (
                    <CaseStudy717Chart data={selectedData} />
                  ) : (
                    <CaseStudy718Chart data={selectedData} />
                  )}
                </>
              ) : case1 ? (
                <WeeklyControlHighGainChart data={selectedData} />
              ) : case2 ? (
                <WeeklyControlHighStudyChart data={selectedData} />
              ) : null}
            </div>
          </div>

          <main className="px-6 pt-0 sm:p-4">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="col-span-2 lg:col-span-1 bg-[#F5F6FE]">
                  <div className="flex items-center space-x-2 px-5 m-2">
                    <div className="text-[#524E53] font-inter text-2xl font-semibold">
                      KPI's Summary
                    </div>
                  </div>
                  <CardContent
                    className="h-[360px] overflow-y-auto"
                    // summaryPadding={true}
                  >
                    {tabData === 'beef' ? (
                      <>
                        <Summary
                          data={averageBeefYield}
                          title={'Average Weight Gain (Lbs/Day)'}
                        />
                        <Summary
                          data={averageBeefConversationRatio}
                          title={'Feed Conversion Ratio'}
                        />
                      </>
                    ) : (
                      <>
                        <Summary
                          data={milkYieldData}
                          title={'  Average Milk Yield (Gal)'}
                        />

                        <Summary
                          data={milkPercentageData}
                          title={'Milk Fat Percentage %'}
                        />

                        <Summary
                          data={averageLactationDurationData}
                          title={'Lactation Duration (days) %'}
                        />
                        <Summary
                          data={averageDairyStudyDurationData}
                          title={'Study  Duration (Weeks)'}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="col-span-2 lg:col-span-1 bg-[#F5F6FE]">
                  {tabData === 'beef' ? (
                    <BeefStudyProgressChart />
                  ) : (
                    <StudyProgressChart />
                  )}
                </Card>
              </div>
            </div>
          </main>
          <div className="flex justify-between items-center px-11 py-0 text-[#524E53] font-inter text-2xl font-semibold mb-5">
            Anomilies and Outliers
          </div>
          <div className="mx-8 mb-5  rounded border border-[#BFBCC0] bg-white min-h-[17.5vh] overflow-auto  ">
            {tabData === 'beef' ? (
              <AnomiliesTable
                animalInfoTableData={animalInfoTableData}
                beefStudyInfoTableData={beefStudyInfoTableData}
              />
            ) : (
              <DairyAnomaliesTable
                dairyAnimalInfoTableData={dairyAnimalInfoTableData}
                dairyStudyInfoTableData={dairyStudyInfoTableData}
              />
            )}
          </div>
          <ChatIcon />
        </div>
      </div>
    </div>
  )
}

export default CompanyProfilePage
