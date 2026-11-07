import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ToolDirectoryPage } from '@/features/tool-directory/ToolDirectoryPage';
import { TOOL_REGISTRY } from '@/tools/registry';

const PageLoader = () => (
  <div className="w-full max-w-5xl mx-auto space-y-6 py-4 animate-pulse">
    <div className="h-8 w-64 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl" />
    <div className="h-4 w-96 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      <div className="h-48 bg-slate-200/40 dark:bg-slate-800/40 rounded-2xl border border-border/50" />
      <div className="h-48 bg-slate-200/40 dark:bg-slate-800/40 rounded-2xl border border-border/50" />
    </div>
  </div>
);

// Lazy load workspace features
const SnippetListPage = React.lazy(
  () => import('@/features/snippets/components/SnippetListPage')
);
const HistoryPage = React.lazy(
  () => import('@/features/history/components/HistoryPage')
);
const SettingsPage = React.lazy(
  () => import('@/features/settings/components/SettingsPage')
);
const AboutDeveloperPage = React.lazy(
  () => import('@/features/about/AboutDeveloperPage')
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
      {
        path: 'snippets',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SnippetListPage />
          </Suspense>
        ),
      },
      {
        path: 'history',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HistoryPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutDeveloperPage />
          </Suspense>
        ),
      },
      {
        path: 'developer',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutDeveloperPage />
          </Suspense>
        ),
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
