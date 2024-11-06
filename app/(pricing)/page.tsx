import { auth } from '@/auth'
import { Plan } from './plan'
import { HeroSection } from '@/components/heroSection/heroSection'
const PLANS = [
  {
    // Ensure this matches Stripe price ID
    stripePriceId: 'price_1PQ3YhFOkVwzR3KON3nGiZKA',
    stripeUrl: 'https://buy.stripe.com/test_3cs7vT09zfLm7jq288',
    name: 'AI SaaS Basic',
    description: 'For building your AI apps.',
    price: 50,
    features: [
      {
        name: 'Next.js',
        description:
          'modern code with all the essential features that you need to launch fast.'
      },
      {
        name: 'Supabase',
        description:
          'database for user authentication, thread management, chat history, storage for files.'
      },
      {
        name: 'OpenAI',
        description:
          'integrated seamlessly with OpenAI latest Assistant API, all out-of-the-box.'
      }
    ]
  },
  {
    // Ensure this matches Stripe price ID
    stripePriceId: 'price_1PQ3YhFOkVwzR3KON3nGiZKA',
    stripeUrl: 'https://buy.stripe.com/test_3cs7vT09zfLm7jq288',
    name: 'AI SaaS Pro',
    description: 'For building your AI apps.',
    price: 199,
    features: [
      {
        name: 'Next.js',
        description:
          'modern code with all the essential features that you need to launch fast.'
      },
      {
        name: 'Supabase',
        description:
          'database for user authentication, thread management, chat history, storage for files.'
      },
      {
        name: 'OpenAI',
        description:
          'integrated seamlessly with OpenAI latest Assistant API, all out-of-the-box.'
      }
    ]
  },
  {
    // Ensure this matches Stripe price ID
    stripePriceId: 'price_1PQ3YhFOkVwzR3KON3nGiZKA',
    stripeUrl: 'https://buy.stripe.com/test_3cs7vT09zfLm7jq288',
    name: 'Enterprise',
    description: 'For building your AI apps.',
    price: 299,
    features: [
      {
        name: 'Next.js',
        description:
          'modern code with all the essential features that you need to launch fast.'
      },
      {
        name: 'Supabase',
        description:
          'database for user authentication, thread management, chat history, storage for files.'
      },
      {
        name: 'OpenAI',
        description:
          'integrated seamlessly with OpenAI latest Assistant API, all out-of-the-box.'
      }
    ]
  }
]

export default async function PricingPage() {
  return (
    <main className="flex flex-col p-4">
      <div className="pb-20">
        <HeroSection />
      </div>
      <section id="pricing" className="space-y-16 py-24">
        <h1 className="text-center text-4xl font-bold tracking-tight md:text-5xl dark:text-slate-300">
          Pricing
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 items-start gap-8 sm:px-4 md:px-24">
          {PLANS.map(plan => (
            <Plan plan={plan} key={plan.name} />
          ))}
        </div>
      </section>
    </main>
  )
}
