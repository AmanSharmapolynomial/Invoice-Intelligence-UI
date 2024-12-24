import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import App from "@/App";
import "@/index.css";
import { queryClient } from "./lib/utils.js";
import { router } from "./routing/index.jsx";
import ErrorBoundary from "./components/common/ErrorBoundaries.jsx";
const root = document.getElementById("root");

// Initialize the theme globally from localStorage
const storedTheme = localStorage.getItem("theme") || "light";
if (storedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(root).render(
  
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}>
    <ErrorBoundary>
      <App />
  </ErrorBoundary>
    </RouterProvider>
  </QueryClientProvider>
);
