import { Suspense } from "react";
import ProfileForm from "../../_component/profileForm";

export default function AdminProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">Admin Profile</h1>
      
      <Suspense
        fallback={
          <div className="text-muted-foreground">Loading profile...</div>
        }
      >
        <ProfileForm />
      </Suspense>
    </div>
  );
}
