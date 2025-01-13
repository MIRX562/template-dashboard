import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";
import React from "react";
import UserProfileForm from "./user-form";
import ResetPasswordForm from "./reset-password-form";
import CopyToClipboardButton from "@/components/copy-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { ProfileImageUpload } from "@/app/(main)/profile/profile-image-upload";

export default async function ProfielPage() {
  const { user } = await getCurrentSession();
  if (!user) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 p-4 gap-4">
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <ProfileImageUpload />
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-bold">
                  Id: <span className="font-normal">{user.id}</span>{" "}
                  <CopyToClipboardButton textToCopy={user.id} />
                </p>
                <p className="font-bold">
                  Role: <span className="font-normal">{user.role}</span>
                </p>
              </div>
            </div>
          </div>
          <UserProfileForm name={user.name} email={user.email} id={user.id} />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm id={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
