import {
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { lazy, Suspense } from "react";

import appCss from "../styles.css?url";

const App = lazy(() => import("../spa/App"));

function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0B0F19",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "2px solid rgba(99,102,241,0.25)",
            borderTopColor: "#818cf8",
            borderRightColor: "#34d399",
            borderRadius: "50%",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }
  return <>{children}</>;
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Business Analytical Solutions — Interactive Business Dashboards" },
      {
        name: "description",
        content:
          "Business Analytical Solutions turns spreadsheets, ERPs, and databases into secure, automated, interactive dashboards for modern businesses.",
      },
      { name: "author", content: "Business Analytical Solutions" },
      { property: "og:title", content: "Business Analytical Solutions — Interactive Business Dashboards" },
      {
        property: "og:description",
        content:
          "Turn raw data & Google Sheets into interactive business dashboards. Automated sync, enterprise security, embedded analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ClientOnly>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </ClientOnly>
  );
}
