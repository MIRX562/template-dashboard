"use client";

import { Table } from "@tanstack/react-table";
import { Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { logActions, logResources } from "@/db/schemas";
import { ExportButton } from "@/components/export-button";
import { toast } from "sonner";
import { bulkDeleteLog } from "@/actions/log-action";
import { useRouter } from "next/navigation";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSelected =
    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();
  const selectedRow = table.getSelectedRowModel().rows;
  const selectedData = selectedRow.map((row) => row.original);
  const router = useRouter();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("action") && (
          <DataTableFacetedFilter
            column={table.getColumn("action")}
            title="Action"
            options={logActions}
          />
        )}
        {table.getColumn("resource") && (
          <DataTableFacetedFilter
            column={table.getColumn("resource")}
            title="Resource"
            options={logResources}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
        {isSelected && (
          <>
            <ExportButton data={selectedData} />
            <Button
              variant="destructive"
              className="h-8 px-2 lg:px-3"
              size="sm"
              onClick={() => {
                toast.warning(
                  "Selected logs will be deleted, this action is not reversible!",
                  {
                    closeButton: true,
                    action: {
                      label: "Delete",
                      onClick: () => {
                        toast.promise(bulkDeleteLog(selectedData), {
                          loading: "deleting slected log...",
                          success: "deleted!",
                          error: "error happened, canceling delete!",
                        });
                        table.resetRowSelection();
                        router.refresh();
                      },
                    },
                  }
                );
              }}
            >
              Delete ({selectedData.length})
              <Trash2 />
            </Button>
          </>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
