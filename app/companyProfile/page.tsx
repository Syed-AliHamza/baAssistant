import React, { cache } from 'react'
import CompanyProfilePage from '../../components/pages/companyProfile/company-profile'
import {
  fetchAverageDairyMilkYield,
  fetchAverageMilkPercentage,
  fetchBeefAnimalInfoForTable,
  fetchBeefCF500CaseStudy,
  fetchBeefConversationRatiO,
  fetchBeefStudyInfoForTable,
  fetchBeefYieldAverage,
  fetchDairyAnimalInfoForTable,
  fetchDairyMLK101Yield,
  fetchDairyMLK102Yield,
  fetchDairyMLK103Yield,
  fetchDairyMLK104Yield,
  fetchDairyStudyDuration,
  fetchDairyStudyInfoForTable,
  fetchgetBeefCF717CaseStudy,
  fetchgetBeefCF718CaseStudy,
  fetchLactationDuration
} from '../actions'
// import {
//   fetchTopProductsBySales,
//   fetchTopProductsByUnitsSold,
//   fetchTopSalesReps,
//   fetchTotalAmountPerMonth
// } from '../actions'

const averageMilkYieldData = cache(async () => {
  return await Promise.all([fetchAverageDairyMilkYield()])
})
const averageMilkPercentageData = cache(async () => {
  return await Promise.all([fetchAverageMilkPercentage()])
})
const averageactationDuration = cache(async () => {
  return await Promise.all([fetchLactationDuration()])
})

const averageDairyStudyDuration = cache(async () => {
  return await Promise.all([fetchDairyStudyDuration()])
})

const getDairyMLK101Yield = cache(async () => {
  return await Promise.all([fetchDairyMLK101Yield()])
})
const getDairyMLK102Yield = cache(async () => {
  return await Promise.all([fetchDairyMLK102Yield()])
})
const getDairyMLK103Yield = cache(async () => {
  return await Promise.all([fetchDairyMLK103Yield()])
})
const getDairyMLK104Yield = cache(async () => {
  return await Promise.all([fetchDairyMLK104Yield()])
})
const getBeefYieldAverage = cache(async () => {
  return await Promise.all([fetchBeefYieldAverage()])
})
const getBeefConversationRatio = cache(async () => {
  return await Promise.all([fetchBeefConversationRatiO()])
})
const getBeefCF717CaseStudy = cache(async () => {
  return await Promise.all([fetchgetBeefCF717CaseStudy()])
})
const getBeefCF718CaseStudy = cache(async () => {
  return await Promise.all([fetchgetBeefCF718CaseStudy()])
})
const getBeefCF500CaseStudy = cache(async () => {
  return await Promise.all([fetchBeefCF500CaseStudy()])
})
const getBeefAnimalInfoForTable = cache(async () => {
  return await Promise.all([fetchBeefAnimalInfoForTable()])
})
const getBeefStudyInfoForTable = cache(async () => {
  return await Promise.all([fetchBeefStudyInfoForTable()])
})

const getDairyAnimalInfoForTable = cache(async () => {
  return await Promise.all([fetchDairyAnimalInfoForTable()])
})
const getDairyStudyInfoForTable = cache(async () => {
  return await Promise.all([fetchDairyStudyInfoForTable()])
})

export default async function companyProfile() {
  const milkYieldData = await averageMilkYieldData()
  const milkPercentageData = await averageMilkPercentageData()
  const averageLactationDurationData = await averageactationDuration()
  const averageDairyStudyDurationData = await averageDairyStudyDuration()
  const averageDairyMLK101Yield = await getDairyMLK101Yield()
  const averageDairyMLK102Yield = await getDairyMLK102Yield()
  const averageDairyMLK103Yield = await getDairyMLK103Yield()
  const averageDairyMLK104Yield = await getDairyMLK104Yield()
  const averageBeefYield = await getBeefYieldAverage()
  const averageBeefConversationRatio = await getBeefConversationRatio()
  const averageBeefF717CaseStudyYield = await getBeefCF717CaseStudy()
  const averageBeefF718CaseStudyYield = await getBeefCF718CaseStudy()
  const averageBeefF500CaseStudyYield = await getBeefCF500CaseStudy()
  const animalInfoTableData = await getBeefAnimalInfoForTable()
  const beefStudyInfoTableData = await getBeefStudyInfoForTable()
  const dairyAnimalInfoTableData = await getDairyAnimalInfoForTable()
  const dairyStudyInfoTableData = await getDairyStudyInfoForTable()

  return (
    <main className="bg-gray-100">
      <h1 className="p-5 custom-heading">Company Overview</h1>
      <div>
        <CompanyProfilePage
          milkYieldData={milkYieldData}
          milkPercentageData={milkPercentageData}
          averageLactationDurationData={averageLactationDurationData}
          averageDairyStudyDurationData={averageDairyStudyDurationData}
          averageDairyMLK101Yield={averageDairyMLK101Yield}
          averageDairyMLK102Yield={averageDairyMLK102Yield}
          averageDairyMLK103Yield={averageDairyMLK103Yield}
          averageDairyMLK104Yield={averageDairyMLK104Yield}
          averageBeefYield={averageBeefYield}
          averageBeefConversationRatio={averageBeefConversationRatio}
          averageBeefF717CaseStudyYield={averageBeefF717CaseStudyYield}
          averageBeefF718CaseStudyYield={averageBeefF718CaseStudyYield}
          animalInfoTableData={animalInfoTableData}
          beefStudyInfoTableData={beefStudyInfoTableData}
          dairyAnimalInfoTableData={dairyAnimalInfoTableData}
          dairyStudyInfoTableData={dairyStudyInfoTableData}
        />
      </div>
    </main>
  )
}
