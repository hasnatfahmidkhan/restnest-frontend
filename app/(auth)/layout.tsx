import { GoogleOAuthProvider } from "@react-oauth/google";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        {children}
      </div>
    </GoogleOAuthProvider>
  );
}
