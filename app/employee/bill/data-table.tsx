"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { DateRangePicker } from "@/components/custom/date-range-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import * as React from "react"
import { dateRangeFilter, idFilter } from "./columns";
import { toast } from "sonner"
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,

}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-01-01'))
  const [endDate, setEndDate] = React.useState<Date | undefined>(new Date())
  const [columnVisibility, setColumnVisibility] = React.useState({
    createdAt: false,
  });
  const [pagination, setPagination] = React.useState({ pageSize: 12, pageIndex: 0 });
  
  // Custom filter function for date range
  

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      pagination
    },
    filterFns: {
      dateRangeFilter,
      idFilter
    },
  });

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    table.getColumn("createdAt")?.setFilterValue([date, endDate]);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    table.getColumn("createdAt")?.setFilterValue([startDate, date]);
  };

  return (
    <div className="max-w-[calc(100vw-2rem)]">
      <div className="flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0">
        <Input
          placeholder="Search by id"
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
          {
            console.log("Column id: ", table.getColumn("id"))
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          }
          className="max-w-sm bg-white rounded-md min-w-[100px] md:min-w-[250px] w-full md:w-auto"
        />
        <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={handleStartDateChange}
            setEndDate={handleEndDateChange}
          />
          {/* <Button variant="secondary" className="mx-4">
            Download all
          </Button>         */}
        </div>
      </div>

      <div className="rounded-md border p-4 bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bottom-0 justify-center items-center">
        {/* <div className="flex-1 text-sm text-muted-foreground mt-2">
          
        </div> */}
        <div className="flex items-center space-x-2 py-4 mx-auto justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination({pageSize:pagination.pageSize, pageIndex:pagination.pageIndex-1})}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination({pageSize:pagination.pageSize, pageIndex:pagination.pageIndex+1})}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

    </div>
  );
}

