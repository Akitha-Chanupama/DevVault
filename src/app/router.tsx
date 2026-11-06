import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ToolDirectoryPage } from '@/features/tool-directory/ToolDirectoryPage';
import { TOOL_REGISTRY } from '@/tools/registry';
import { Loader2 } from 'lucide-react';

const PageLoader = () => (
  <div className="flex h-96 w-full items-center justify-center gap-2 text-muted-foreground text-xs">
    <Loader2 className="w-5 h-5 animate-spin text-primary" />
    <span>Loading utility...</span>
  </div>
);

// Map available tools from registry
const toolRoutes = TOOL_REGISTRY.filter((tool) => tool.component).map((tool) => {
  const Component = tool.component!;
  return {
    path: tool.route,
    element: (
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    ),
  };
});

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'tools',
        element: <ToolDirectoryPage />,
      },
      ...toolRoutes,
      {
        path: '*',
        element: (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <h2 className="text-xl font-bold text-foreground">Page Not Found</h2>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              The tool or route you are looking for does not exist or has moved.
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md text-xs font-medium bg-primary text-primary-foreground h-8 px-4"
            >
              Back to Dashboard
            </a>
          </div>
        ),
      },
    ],
  },
]);
