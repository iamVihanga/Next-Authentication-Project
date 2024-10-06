"use client";
import { useTransition } from "react";
import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { IoMdLogOut } from "react-icons/io";
import { Loader2 } from "lucide-react";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      onClick={() => {
        startTransition(() => {
          logout();
        });
      }}
      variant={"destructive"}
      className="bg-destructive/25 text-destructive hover:bg-destructive/30"
    >
      {isPending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <IoMdLogOut className="mr-2 size-4" />
      )}
      Logout
    </Button>
  );
}
