import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Lumen Research" },
      { name: "description", content: "Simple, usage-based pricing. Start free, upgrade when you need more research capacity." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Try the platform with real research.",
    features: ["5 research reports / day", "Markdown & PDF export", "Full source citations", "Private workspace"],
    cta: "Get started",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "per month",
    description: "For analysts, consultants, and indie researchers.",
    features: ["75 research reports / day", "Priority research queue", "Markdown & PDF export", "Full report history", "Email support"],
    cta: "Upgrade to Pro",
    href: "/signup",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    description: "For teams that run research at scale.",
    features: ["Unlimited reports", "Team workspaces (coming soon)", "API access (coming soon)", "SSO & priority support"],
    cta: "Contact sales",
    href: "mailto:sales@example.com",
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start free. Upgrade when your research volume grows.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-xl border bg-card p-8 ${
                plan.featured ? "border-primary shadow-lg ring-1 ring-primary" : "border-border"
              }`}
            >
              <h3 className="text-xl font-semibold text-card-foreground">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.cadence ? <span className="text-sm text-muted-foreground">/ {plan.cadence}</span> : null}
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {plan.href.startsWith("mailto:") ? (
                  <Button asChild variant={plan.featured ? "default" : "outline"} className="w-full">
                    <a href={plan.href}>{plan.cta}</a>
                  </Button>
                ) : (
                  <Button asChild variant={plan.featured ? "default" : "outline"} className="w-full">
                    <Link to={plan.href}>{plan.cta}</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
