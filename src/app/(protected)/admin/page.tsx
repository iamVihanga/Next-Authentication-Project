"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/global/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function AdminPage() {
  const role = useCurrentRole();
  const [isServerActionPending, startServerActionTransition] = useTransition();

  const onAPIRouteClick = () => {
    fetch("/api/admin").then((res) => {
      if (res.ok) {
        toast.success("Allowed API Route");
      } else {
        toast.error("Forbidden API Route");
      }
    });
  };

  const onServerActionClick = () => {
    admin().then((data) => {
      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        toast.success(data.success);
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message={"You are allowed to see this content"} />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Routes</p>

          <Button onClick={onAPIRouteClick}>Click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>

          <Button
            disabled={isServerActionPending}
            onClick={() => startServerActionTransition(onServerActionClick)}
          >
            {isServerActionPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Click to test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
