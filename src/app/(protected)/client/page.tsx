"use client";
import { LogoutButton } from "@/components/auth/logout-button";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function SettingsPage() {
  const user = useCurrentUser();

  return (
    <div className="">
      <p>Settings Page</p>
      <p>{JSON.stringify(user)}</p>

      <LogoutButton />
    </div>
  );
}
