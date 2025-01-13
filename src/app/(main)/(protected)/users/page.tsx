import React from "react";
import { usersColumns } from "./collumn";
import { getUsers } from "@/actions/user-action";
import { UsersDataTable } from "./data-table";
import { ResponsiveDialogButton } from "@/components/dialog-responsive-button";
import CreateUserForm from "./form-create-user";

export default async function LogsPage() {
  const data = await getUsers();
  return (
    <div className="flex flex-col w-full h-full p-4 gap-4">
      <ResponsiveDialogButton
        title="Create User"
        triggerText="Add User"
        description="Create new user"
      >
        <CreateUserForm />
      </ResponsiveDialogButton>
      <UsersDataTable columns={usersColumns} data={data} />
    </div>
  );
}
