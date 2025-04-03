import { createFileRoute } from '@tanstack/react-router';

import { FakeNewsDetector } from "@/components/fake-news-detector";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
      <main className="flex min-h-screen">
        <FakeNewsDetector />
      </main>
  );
}
