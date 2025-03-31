import { createFileRoute } from '@tanstack/react-router'
import App from "../app/dashboard/playground.tsx"

export const Route = createFileRoute('/app')({
  component: App
})
