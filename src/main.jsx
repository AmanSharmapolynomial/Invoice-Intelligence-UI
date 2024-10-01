import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routing/index.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const client = new QueryClient();
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={client}>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </QueryClientProvider>
);
