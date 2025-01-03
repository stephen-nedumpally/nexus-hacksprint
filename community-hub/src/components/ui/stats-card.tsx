"use client";

import { Card } from "./card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  number: string;
  label: string;
  className?: string;
}

export function StatsCard({ number, label, className }: StatsCardProps) {
  return (
    <Card className={cn("text-center p-8 border-none bg-black/50 hover:bg-black/70 transition-colors", className)}>
      <div className="font-bold text-4xl mb-2 text-white">
        {number}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </Card>
  );
}
