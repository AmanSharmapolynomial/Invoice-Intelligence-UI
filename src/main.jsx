import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { router } from "./routing/index.jsx";
import { queryClient } from "./lib/utils.js";
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}>
      <App />
     
    </RouterProvider>
  </QueryClientProvider>
);
