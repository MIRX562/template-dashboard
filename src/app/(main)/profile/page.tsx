import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";
import React from "react";
import UserProfileForm from "./user-form";
import ResetPasswordForm from "./reset-password-form";
import CopyToClipboardButton from "@/components/copy-button";

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
            <div className="flex items-center gap-2">
              <p className="font-bold">
                Id: <span className="font-normal">{user.id}</span>
              </p>
              <CopyToClipboardButton textToCopy={user.id} />
            </div>
            <p className="font-bold">
              Role: <span className="font-normal">{user.role}</span>
            </p>
          </div>
          <UserProfileForm
            name={user.name}
            email={user.email}
            userId={user.id}
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
