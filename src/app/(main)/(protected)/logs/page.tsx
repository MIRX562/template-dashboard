import { getLogs } from "@/actions/log-action";
import { LogsDataTable } from "@/app/(main)/(protected)/logs/data-table";
import React from "react";
import { logsColumns } from "./collumn";

export default async function LogsPage() {
  const data = await getLogs();
  return (
    <div className="flex flex-col w-full h-full p-4">
      <LogsDataTable columns={logsColumns} data={data} />
    </div>
  );
}
