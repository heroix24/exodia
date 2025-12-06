"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Clock } from "lucide-react";

export function SessionExpiredModal() {
  const { isSessionExpired, acknowledgeSessionExpiry } = useAuth();

  return (
    <Dialog open={isSessionExpired} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-7 w-7 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl text-amber-900">
            Session Expired
          </DialogTitle>
          <DialogDescription className="text-center text-amber-700">
            Your session has expired. Please log in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button
            onClick={acknowledgeSessionExpiry}
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
          >
            Log In Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

