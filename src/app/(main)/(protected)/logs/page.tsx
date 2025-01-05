import { getLogs } from "@/actions/log-action";
import { DataTable } from "@/app/(main)/(protected)/logs/data-table";
import React from "react";
import { logsColumns } from "./collumn";

export default async function LogsPage() {
  const data = await getLogs();
  return (
    <div className="flex flex-col w-full h-full p-4">
      <DataTable columns={logsColumns} data={data} />
    </div>
  );
}
