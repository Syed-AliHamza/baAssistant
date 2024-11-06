'use client'
import clsx from 'clsx'
import { useRef } from 'react'

export const Plan = ({ plan }: any) => {
  const ref = useRef<HTMLAnchorElement>(null)

  return (
    <div
      key={plan.name}
      className={clsx(
        'bg-white p-5 py-10 shadow-lg sm:mx-0 sm:rounded-xl sm:px-10 dark:bg-slate-700',
        plan.highlight
          ? 'relative ring-2 ring-yellow-300'
          : 'ring-1 ring-slate-900/10'
      )}
    >
      {plan.highlight && (
        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 uppercase">
          {/* <Badge color="warning">{plan.highlight}</Badge> */}
        </div>
      )}

      <div>
        <h2 className="text-xl font-extrabold leading-7 text-slate-900 dark:text-slate-300">
          {plan.name}
        </h2>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-400">
          {plan.description}
        </p>
      </div>
      <div className="-mx-5 mt-8 ring-1 ring-slate-900/5 sm:mx-0 sm:rounded-xl">
        <div className="flex flex-col gap-4 bg-slate-50 px-5 py-8 sm:rounded-xl dark:bg-slate-800">
          <p className="flex items-center justify-center">
            <span className="text-[2.5rem] leading-none text-slate-900 dark:text-slate-300">
              $<span className="font-bold">{plan.price}</span>
            </span>
          </p>

          <div className="space-y-2">
            <a
              ref={ref}
              className="mt-6 inline-flex w-full justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              href={plan.stripeUrl}
            >
              Get {plan.name}
            </a>
          </div>
        </div>
      </div>
      <h3 className="sr-only">{plan.name} features</h3>
      <ul className="mt-8 space-y-4 text-sm leading-6 text-slate-700 dark:text-slate-400">
        {plan.features.map(feature => (
          <li key={feature.name}>
            <strong className="font-semibold text-slate-900 dark:text-slate-300">
              {feature.name}
            </strong>{' '}
            — {feature.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
