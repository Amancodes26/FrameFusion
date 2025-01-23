"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  actionLabel,
  popular,
}: PricingCardProps) => {
  return (
    <Card className={cn(
      "w-full max-w-sm transition-all duration-300 hover:scale-105",
      popular && "relative border-2 border-blue-500/20 shadow-lg shadow-blue-500/20"
    )}>
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-sm rounded-full font-medium">
          Most Popular
        </span>
      )}
      <CardHeader className="pb-8 pt-6 text-center">
        <CardTitle className="text-2xl font-bold mb-2">{title}</CardTitle>
        <div className="flex justify-center items-baseline mb-4">
          <span className="text-5xl font-extrabold">₹{price}</span>
          <span className="text-gray-500 ml-1">/month</span>
        </div>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm"
          >
            <CheckCircle2 className="text-green-500 h-5 w-5 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="pt-4 pb-8">
        <Button 
          className={cn(
            "w-full text-base font-semibold py-6",
            popular && "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
          )} 
          asChild
        >
          <Link href={`/checkout?amount=${price}`}>{actionLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function Page() {
  const plans = [
    {
      title: "Basic",
      price: 0,
      description: "Perfect for getting started with AI image processing",
      features: [
        "Up to 26 images per month",
        "Basic image enhancement",
        "Standard support",
        "Access to essential tools",
      ],
      actionLabel: "Start with Basic",
    },
    {
      title: "Pro",
      price: 999,
      description: "Ideal for professionals and businesses",
      features: [
        "Unlimited images",
        "Advanced AI processing",
        "Priority support 24/7",
        "Access to all premium features",
      ],
      actionLabel: "Upgrade to Pro",
      popular: true,
    }
  ];

  return (
    <div className="container min-h-screen flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Select the perfect plan for your needs. Upgrade or downgrade at any time.
        </p>
      </div>
      
      <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto place-items-center">
        {plans.map((plan) => (
          <PricingCard key={plan.title} {...plan} />
        ))}
      </section>
    </div>
  );
}
