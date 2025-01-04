import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: {
    badge: "h-4 w-4",
    icon: "h-2 w-2",
  },
  md: {
    badge: "h-5 w-5",
    icon: "h-3 w-3",
  },
  lg: {
    badge: "h-6 w-6",
    icon: "h-4 w-4",
  },
};

export function VerificationBadge({ className, size = "md" }: VerificationBadgeProps) {
  const sizeClasses = sizes[size];
  
  return (
    <Badge 
      variant="secondary" 
      className={cn(
        sizeClasses.badge,
        "rounded-full bg-blue-500 flex items-center justify-center p-0",
        className
      )}
    >
      <Check className={cn(sizeClasses.icon, "text-white")} />
    </Badge>
  );
}
