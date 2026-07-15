import { createFileRoute } from "@tanstack/react-router";

// SPA is mounted in __root.tsx (react-router-dom BrowserRouter).
// This route exists only so TanStack Router has a match for "/".
export const Route = createFileRoute("/")({
  component: () => null,
});
