import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavProtected } from "@/components/nav-protected";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AppLogo } from "./app-logo";
import { getCurrentSession } from "@/lib/auth";
import { Separator } from "./ui/separator";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = await getCurrentSession();
  if (!user) return null;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain />
        <Separator />
        {user.role == "Admin" && (
          <>
            <NavProtected />
            <Separator />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
