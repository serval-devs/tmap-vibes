import { SidebarProvider } from "@/components/ui/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Outlet />
        <TanStackRouterDevtools />
      </SidebarProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  ),
});
