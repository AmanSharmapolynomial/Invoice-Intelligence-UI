import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import App from "@/App";
import "@/index.css";

import { queryClient } from "./lib/utils.js";
import { router } from "./routing/index.jsx";
import ErrorBoundary from "./components/common/ErrorBoundaries.jsx";

// Initialize Sentry before rendering
Sentry.init({
  dsn: "https://bc3120adb6c43cadd8982712658c11a6@o4509682681905152.ingest.us.sentry.io/4509688521228288",
  sendDefaultPii: true,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  // tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
});

// Theme setup
const storedTheme = localStorage.getItem("theme") || "light";
if (storedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// Render app
const root = document.getElementById("root");
createRoot(root).render(
  <Sentry.ErrorBoundary fallback={<p>An error has occurred.</p>}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </RouterProvider>
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
);
