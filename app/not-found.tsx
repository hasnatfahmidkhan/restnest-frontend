import ErrorDisplay from "@/components/shared/ErrorDisplay";

export default function NotFound() {
  return (
    <ErrorDisplay
      errorCode="404"
      title="Page Not Found"
      description="Oops! The page you are looking for doesn't exist or has been moved. Let's get you back on track."
    />
  );
}
