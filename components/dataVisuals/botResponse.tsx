'use client'

import { BotCard } from '../stocks/message'
import AssumptionExplanationSection from './explanation'
import { ChartComponent } from './chartComponent'
import { SQLResultTable } from './sqlResultTable'
import CodeBlock from './codeBlock'
import CodeBlockSkeleton from './skeletons/codeblockSkeleton'
import ExplanationSkeleton from './skeletons/explanantionSkeleton'
import { TableSkeleton } from './skeletons/tableSkeleton'
import { BarChartSkeleton } from './skeletons/barChartSkeleton'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { GRAPH_ITEMS_PER_PAGE } from '@/lib/utils'
import { useUIState } from 'ai/rsc'
import { AlertCircle } from 'lucide-react'

export function BotResponse({
  sqlQuery,
  assumptions,
  explanation,
  fetchedData,
  graphData,
  columns = [],
  typeOfChart,
  xAxisProperty,
  yAxisProperty,
  totalCount,
  threadId,
  isQueryLoading = false,
  isExplanationLoading = false,
  isTableLoading = false,
  isGraphLoading = false,
  error
}) {
  const router = useRouter()
  const pathname = usePathname()
  const match = pathname.split('/chat/')
  const [messages] = useUIState()
  const routId = match ? +match[1] : null

  const handleChatNavigationAndReload = ({ loading, data }) => {
    if (!routId && !loading && threadId) {
      setTimeout(() => {
        router.push(`/chat/${threadId}`)
      }, 1000)
    }

    if (!loading && data) {
      localStorage.setItem('isResponding', 'false')
      window.dispatchEvent(new Event('respondingStatusChange'))
    }

    const lastReloadCount =
      parseInt(localStorage.getItem('lastReloadCount'), 10) || 0
    const messageCount = messages?.length || 0

    if (
      messageCount % 8 === 0 &&
      messageCount >= 8 &&
      messageCount !== lastReloadCount &&
      !loading &&
      data
    ) {
      localStorage.setItem('lastReloadCount', messageCount)

      window.location.reload()
    }

    if (!loading && data) {
      localStorage.setItem('isResponding', 'false')
      window.dispatchEvent(new Event('respondingStatusChange'))
    }
  }
  const graphCondition = totalCount <= GRAPH_ITEMS_PER_PAGE
  const loading = graphCondition ? isGraphLoading : isTableLoading
  const data = graphCondition ? graphData : fetchedData
  const handleUnmount = () => {
    localStorage.setItem('isResponding', 'false')
    window.dispatchEvent(new Event('respondingStatusChange'))
  }
  useEffect(() => {
    handleChatNavigationAndReload({
      loading: loading,
      data
    })

    return handleUnmount()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routId, loading])

  return (
    <BotCard>
      <div className="max-w-[650px] xs:w-[220px]">
        {isQueryLoading && <CodeBlockSkeleton />}
        {!isQueryLoading && sqlQuery && <CodeBlock query={sqlQuery} />}

        {isExplanationLoading && (
          <div className="my-8">
            <ExplanationSkeleton />
          </div>
        )}
        {!isExplanationLoading && assumptions && explanation && (
          <div className="my-8">
            <AssumptionExplanationSection
              assumption={assumptions}
              explanation={explanation}
            />
          </div>
        )}
        {error && (
          <div className="space-y-2">
            <h3 className="text-lg font-bold mb-5">Query Response</h3>
            <div className="bg-red-50  p-4 mb-4 ">
              <div className="flex items-center">
                <AlertCircle className="size-5 text-red-500 mr-2" />
                <p className="font-bold text-red-700">Error</p>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
            </div>
          </div>
        )}

        {!error && isTableLoading && <TableSkeleton />}
        {!error && fetchedData && (
          <SQLResultTable
            data={fetchedData}
            query={sqlQuery}
            columns={columns}
            assumptions={assumptions}
            explanation={explanation}
            totalCount={totalCount}
            error={error}
          />
        )}
        {!error && isGraphLoading && <BarChartSkeleton />}
        {!error && !isGraphLoading && graphData && (
          <ChartComponent
            graphData={graphData || []}
            typeOfChart={typeOfChart || ''}
            isDataLoading={false}
            query={sqlQuery || ''}
            assumptions={assumptions || ''}
            explanation={explanation || ''}
            tableData={fetchedData}
            xAxisProperty={xAxisProperty || ''}
            yAxisProperty={yAxisProperty || ''}
            isGraphLoading={isGraphLoading}
          />
        )}
      </div>
    </BotCard>
  )
}
