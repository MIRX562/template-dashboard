"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { exportFile } from "@/lib/sheet";

interface ExportButtonProps {
  data: any[];
}

export function ExportButton({ data }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: "xlsx" | "xls" | "csv") => {
    setIsExporting(true);
    // Placeholder for export logic
    exportFile(data, `logs-${new Date().toLocaleDateString("id")}`, format);
    console.log(`Exporting data in ${format} format`, data);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
    }, 1000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isExporting}
          className="h-8 px-2 lg:px-3"
          size="sm"
        >
          {isExporting ? (
            <>Exporting...</>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export ({data.length})
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("xlsx")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as XLSX
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("xls")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as XLS
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
