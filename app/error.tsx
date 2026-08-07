"use client";

import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error tracking service like Sentry
    console.error(error);
  }, [error]);

  return (
    <ErrorDisplay
      errorCode="500"
      title="Something Went Wrong"
      description="An unexpected error occurred on our end. Don't worry, our team has been notified. Please try again."
      showRetry
      onRetry={reset} // The reset function attempts to re-render the Error boundary segment
    />
  );
}
