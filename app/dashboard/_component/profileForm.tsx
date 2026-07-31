"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth-store";

export default function ProfileForm() {
  const user = useAuthStore((state) => state.user);

  return (
    <Card className="max-w-2xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-20 h-20 border">
          <AvatarImage
            src={user?.profile?.profilePhoto || undefined}
            alt={user?.name || "User"}
          />
          <AvatarFallback className="text-xl bg-primary/10 text-primary">
            {user?.name?.charAt(0).toUpperCase() ||
              user?.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl font-heading">My Profile</CardTitle>
          <CardDescription>
            View and update your personal information.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                defaultValue={user?.name || ""}
                placeholder="Not set"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                readOnly
                className="bg-muted/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                defaultValue={user?.phone || ""}
                placeholder="Not set"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Input
                id="role"
                defaultValue={user?.role || ""}
                readOnly
                className="bg-muted/50 capitalize"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              defaultValue={user?.profile?.bio || ""}
              placeholder="Tell us a little about yourself..."
            />
          </div>

          <Button type="button">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}
