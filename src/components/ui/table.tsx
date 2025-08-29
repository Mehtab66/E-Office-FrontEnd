import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../libs/utils";

const tableVariants = cva("w-full border-collapse border", {
  variants: {
    density: {
      default: "table-row",
      compact: "table-row [&>tr>td]:py-2 [&>tr>th]:py-2",
      comfortable: "table-row [&>tr>td]:py-4 [&>tr>th]:py-4",
    },
  },
  defaultVariants: {
    density: "default",
  },
});

interface TableProps<TData> extends VariantProps<typeof tableVariants> {
  data: TData[];
  columns: any[]; // Replace with ColumnDef<TData>[]
  className?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  ({ className, density, data, columns, ...props }, ref) => {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <table
        ref={ref}
        className={cn(tableVariants({ density, className }))}
        {...props}
      >
        <thead className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border px-4 py-3 text-left font-medium"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-4 py-3 text-left">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
);
Table.displayName = "Table";

export { Table, tableVariants };
