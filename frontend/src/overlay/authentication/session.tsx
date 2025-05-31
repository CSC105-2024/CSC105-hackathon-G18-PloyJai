import { useModalStore } from "@/store/modal";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { createModalHook } from "@/hooks/use-modal.tsx";
import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/auth-context.tsx";

function UserSignOutOverlayContent() {
  const { closeModal } = useModalStore();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function onSignOut() {
    try {
      await signOut();
      toast.success("Signed out successfully");
      closeModal("user-sign-out");
      navigate("/authentication/sign-in");
    } catch (error) {
      toast.error("Error signing out");
      console.error(error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <Button onClick={onSignOut} className="w-full flex-1" variant="link">
          Sign out
        </Button>
        <Button
          onClick={() => closeModal("user-sign-out")}
          className="w-full flex-1"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

const useSignOutOverlay = createModalHook(
  UserSignOutOverlayContent,
  "user-sign-out",
  "Are you sure you want to sign out?",
    "Your note, journey and adventure will be staying with us."
);

export { useSignOutOverlay, UserSignOutOverlayContent };
