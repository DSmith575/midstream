import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  return <p>Features</p>
}

export const Route = createFileRoute('/features')({
  component: RouteComponent,
})
