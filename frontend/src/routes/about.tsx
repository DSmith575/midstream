import { createFileRoute } from '@tanstack/react-router'
import { Block, Reveal } from '@/components/animation/'
import { AboutUsHero } from '@/components/hero/AboutUsHero'

const RouteComponent = () => {
  const aboutText = [
    'MidStream is the platform that helps whānau access support effortlessly and manage their support and daily tasks with ease.',
    "Using our Personalised Intelligent Agent (PIA), MidStream automatically finds what you're eligible for, helps with applications, and keeps everything organised for you.",
    'Track your health, social, and financial goals — all in one place.',
    'Easily manage appointments, tasks, and support services to stay on top of everything.',
    'MidStream is also designed to improve collaboration across workers, providers, and decision-makers, ensuring that everyone can work seamlessly to support whānau.',
  ]

  const standForText = [
    'Support should come to you.',
    'Your time matters.',
    'Systems should work for you, not against you.',
    'Data should be simple and easy to navigate.',
  ]

  return (
    <main className="space-y-8">
      <AboutUsHero />
      {/* About MidStream */}
      <Block className={'flex flex-col max-w-full justify-end mx-4'}>
        <p className="text-lg italic text-center">Support made simple. Easy.</p>
        <ul className={'mt-6'}>
          {aboutText.map((item, index) => (
            <li key={index} className="mb-4 text-md">
              {item}
            </li>
          ))}
        </ul>
      </Block>

      {/* What We Stand For */}
      <Block className={'mx-4'}>
        <h2 className="mb-4 text-3xl font-bold">What We Stand For</h2>

        <ul>
          {standForText.map((item, index) => (
            <Reveal key={index}>
              <li key={index} className="mb-4 text-md">
                {item}
              </li>
            </Reveal>
          ))}
        </ul>
      </Block>

      {/* Our Vision */}
      <Block className={'mx-4'}>
        <h2 className="mb-4 text-3xl font-bold">Our Vision</h2>
        <Reveal>
          <p className="text-lg font-semibold">
            Support within reach. Simple. Easy.
          </p>
        </Reveal>
      </Block>
    </main>
  )
}

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})
