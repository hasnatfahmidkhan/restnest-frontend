"use client";

import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProfileForm() {
  const user = useAuthStore((state) => state.user);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-heading">My Profile</CardTitle>
        <CardDescription>View and update your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.name || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user?.email || ""} readOnly />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Account Type</Label>
            <Input id="role" defaultValue={user?.role || ""} readOnly className="capitalize" />
          </div>

          <Button type="button">Save Changes (Mock)</Button>
        </form>
      </CardContent>
    </Card>
  );
}