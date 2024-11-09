'use client'

import { useEffect } from 'react'
import { MemoizedReactMarkdown } from '../markdown'
import { CodeBlock } from '../ui/codeblock'
import { usePathname, useRouter } from 'next/navigation'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'
import { cn } from '@/lib/utils'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { StreamableValue, useUIState } from 'ai/rsc'
import Image from 'next/image'
import { IconArrowRight } from '@/components/ui/icons'
import { htmlToMarkdown, markdownToHtml, markdownToHtmlTable } from '../parser'

export function BotMessage({
  content,
  className,
  isCopied,
  id,
  isFinish
}: {
  content: string | StreamableValue<string>
  className?: string
  isCopied: string
  id: number
  isFinish?: boolean
}) {
  const text = useStreamableText(content)

  const router = useRouter()
  const pathname = usePathname()
  const [messages] = useUIState()
  const match = pathname.split('/chat/')
  const routId = match ? +match[1] : null

  const handleMoveToCanvas = text => {
    localStorage.setItem('isCopied', localStorage.getItem('isCopied') + text)
    window.dispatchEvent(new Event('respondingisCopied'))
  }

  const handleUnmount = () => {
    localStorage.setItem('isResponding', 'false')
    window.dispatchEvent(new Event('respondingStatusChange'))
  }

  useEffect(() => {
    if (!routId && isFinish) {
      setTimeout(() => {
        router.push(`/chat/${id}`)
      }, 500)
    }
    const messageCount = messages?.length || 0

    const lastReloadCount =
      parseInt(localStorage.getItem('lastReloadCount'), 10) || 0

    if (
      messageCount % 8 === 0 &&
      messageCount >= 8 &&
      messageCount !== lastReloadCount &&
      isFinish
    ) {
      localStorage.setItem('lastReloadCount', messageCount)
      // window.location.reload()
    }

    return handleUnmount

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routId])

  useEffect(() => {
    if (isFinish) {
      localStorage.setItem('isResponding', 'false')
      window.dispatchEvent(new Event('respondingStatusChange'))
    }
  }, [isFinish])

  console.log(isCopied, 'isCopied')
  return (
    <div
      className={cn(
        'group relative bottom-[20px] flex items-start systemChat rounded-lg border',
        className
      )}
    >
      <div
        className="flex size-[40px] shrink-0 select-none items-center justify-center rounded-lg border shadow-sm"
        style={{ backgroundColor: '#D9D9D9' }}
      >
        <Image
          src="/images/novaAgent.jpg"
          alt="cosmic logo"
          width={40}
          height={80}
        />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 ouptput-div">
        {/* <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        ></MemoizedReactMarkdown> */}
        {/* {markdownToHtmlTable(text)} */}
        <div
          dangerouslySetInnerHTML={{ __html: markdownToHtmlTable(text) }}
        ></div>
        <div className="flex justify-end">
          <div
            className="move-buttonClick"
            onClick={() => handleMoveToCanvas(markdownToHtmlTable(text))}
            style={{ borderLeft: '2px solid #000', cursor: 'pointer' }}
          >
            <IconArrowRight style={{ color: '#000' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
