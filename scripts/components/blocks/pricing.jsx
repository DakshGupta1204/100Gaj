"use client";
import { buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
export function PricingUI({ plans, title = "Simple, Transparent Pricing", description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.", }) {
    const [isMonthly, setIsMonthly] = useState(true);
    const switchRef = useRef(null);
    const handleToggle = (checked) => {
        setIsMonthly(!checked);
        if (checked && switchRef.current) {
            const rect = switchRef.current.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { x: x / window.innerWidth, y: y / window.innerHeight },
                colors: [
                    "hsl(var(--primary))",
                    "hsl(var(--accent))",
                    "hsl(var(--secondary))",
                    "hsl(var(--muted))",
                ],
                ticks: 200,
                gravity: 1.2,
                decay: 0.94,
                startVelocity: 30,
                shapes: ["circle"],
            });
        }
    };
    return (<div className="container py-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg whitespace-pre-line max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center items-center mb-12 gap-4">
        <span className="text-sm font-medium text-muted-foreground">
          Monthly
        </span>
        <Switch ref={switchRef} checked={!isMonthly} onCheckedChange={handleToggle} className="data-[state=checked]:bg-primary"/>
        <span className="text-sm font-medium text-muted-foreground">
          Annual <span className="text-primary">(Save 20%)</span>
        </span>
      </div>

      {/* Pricing cards */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
        {plans.map((plan, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.2 }} className={cn("relative flex flex-col rounded-3xl border bg-background p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-2xl", plan.isPopular ? "border-primary scale-105" : "border-border", "bg-background")}>
            {plan.isPopular && (<div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Star className="h-3 w-3 fill-current"/>
                Popular
              </div>)}

            <h3 className="text-lg font-semibold text-muted-foreground">
              {plan.name}
            </h3>

            <div className="mt-6 flex items-end justify-center gap-2">
              <span className="text-5xl font-bold tracking-tight text-foreground">
                <NumberFlow value={isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)} format={{
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }} transformTiming={{ duration: 500, easing: "ease-out" }} willChange className="tabular-nums"/>
              </span>
              <span className="text-sm text-muted-foreground">
                /{plan.period}
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {isMonthly ? "Billed monthly" : "Billed annually"}
            </p>

            <ul className="mt-8 space-y-3 text-sm text-left">
              {plan.features.map((feature, idx) => (<li key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary"/>
                  {feature}
                </li>))}
            </ul>

            <Link href={plan.href} className={cn(buttonVariants({ variant: "outline" }), "mt-8 w-full text-lg font-semibold transition-all duration-300 hover:bg-primary hover:text-primary-foreground")}>
              {plan.buttonText}
            </Link>

            <p className="mt-6 text-xs text-muted-foreground">
              {plan.description}
            </p>
          </motion.div>))}
      </div>
    </div>);
}
