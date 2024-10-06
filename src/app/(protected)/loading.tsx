import { Loader2 } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="w-full flex items-center justify-center">
      <Loader2 className="text-white mr-2 size-12 animate-spin" />
    </div>
  );
}
