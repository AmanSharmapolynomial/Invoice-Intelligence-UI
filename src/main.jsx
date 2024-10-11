import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import App from "@/App";
import "@/index.css";
import { queryClient } from "./lib/utils.js";
import { router } from "./routing/index.jsx";
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}>
      <App />
     
    </RouterProvider>
  </QueryClientProvider>
);
