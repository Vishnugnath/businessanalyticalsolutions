import { createFileRoute } from "@tanstack/react-router";

// Catch-all so TanStack matches every URL; react-router-dom (mounted in __root)
// owns actual page rendering.
export const Route = createFileRoute("/$")({
  component: () => null,
});
