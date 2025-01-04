import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export function RequireVerification<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function VerificationWrapper(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;

      if (!session?.user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue.",
          variant: "destructive",
        });
        router.push("/");
        return;
      }

      if (!session.user.verified) {
        toast({
          title: "Verification Required",
          description: "Please complete verification to access this feature.",
          variant: "destructive",
        });
        router.push("/verify");
        return;
      }
    }, [session, status, router]);

    if (status === "loading" || !session?.user?.verified) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
