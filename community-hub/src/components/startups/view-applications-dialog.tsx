import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Application } from "@prisma/client";
import { Mail } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";

interface ViewApplicationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applications: Application[] & {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  }[];
  positionTitle: string;
}

export function ViewApplicationsDialog({
  open,
  onOpenChange,
  applications,
  positionTitle,
}: ViewApplicationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Applications for {positionTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {applications.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No applications received yet
            </p>
          ) : (
            applications.map((application) => (
              <div
                key={application.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-white/10"
              >
                {/* Applicant Image */}
                <div className="flex-shrink-0">
                  {application.user.image ? (
                    <Image
                      src={application.user.image}
                      alt={application.user.name || ""}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-xl text-gray-400">
                        {application.user.name?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Applicant Details */}
                <div className="flex-grow space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        {application.user.name || "Anonymous"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        application.status === "ACCEPTED"
                          ? "success"
                          : application.status === "REJECTED"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {application.status}
                    </Badge>
                  </div>

                  {/* Contact Button */}
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = `mailto:${application.user.email}`;
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Applicant
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
