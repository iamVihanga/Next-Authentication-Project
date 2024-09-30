import { CardWrapper } from "@/components/auth/card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface ErrorCardProps {}

export function ErrorCard({}: ErrorCardProps) {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong"
      backButtonHref="/auth/login"
      backButtonLabel="Go back to login"
    >
      <div className="w-full flex items-center justify-center">
        <div className="bg-destructive/10 p-5 rounded-full">
          <ExclamationTriangleIcon
            className="text-destructive"
            width={25}
            height={25}
          />
        </div>
      </div>
    </CardWrapper>
  );
}
