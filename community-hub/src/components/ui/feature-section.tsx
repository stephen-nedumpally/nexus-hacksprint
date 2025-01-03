"use client";

import { cn } from "@/lib/utils";

interface FeatureSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureSection({
  icon,
  title,
  description,
  className,
}: FeatureSectionProps) {
  return (
    <div className={cn("text-center space-y-3", className)}>
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <div className="text-primary w-6 h-6">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
