"use client";
import {toast} from "sonner";
import { Customer } from "./columns";
import { getCookies } from "@/lib/action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { TriangleAlert } from "lucide-react"
import * as React from "react"
import { set } from "date-fns";
import { CustomerType } from "./columns";
interface CustomerData {
    customerId: string;
    customerName: string;
    phoneNumber: string;
    email: string;
    revenue: number;
    customerType: CustomerType | null;
}

interface DataTableProps<TData extends CustomerData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onAdd?: (data: Customer) => void;
    onDelete?: (data: Customer) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onAdd,
    onDelete,
}: DataTableProps<CustomerData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  // Custom filter function for date range
  const [customerName, setCustomerName] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");

  const handleAdd = async () => {

    // Validate phone number
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error('Phone number must be 10 digits and start with 0');
      return;
    }
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email address');
      return;
    }
    const cookies = await getCookies('refreshToken');
    const token = cookies?.value;
    const url = process.env.BASE_URL;
    try{
      const response = await fetch(`${url}/customer/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerName,
          phoneNumber: phoneNumber,
          email: email,
          revenue: 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      } else {
        toast.success("Customer added successfully");
      }
      setCustomerName("");
      setPhoneNumber("");
      setEmail("");
      onAdd?.({
        email: email,
        customerId: data.data.customerID,
        customerName: customerName,
        phoneNumber: phoneNumber,
        revenue: 0,
        customerType:null,
      });
    }catch(e){
      toast.error("Failed to add customer: " + e);
    }

  };
  
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
    }
  });
  
  return (
    <div className="max-w-[calc(100vw-2rem)]">
      <div className="flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0">
        <Input
          placeholder="Search by name"
          value={(table.getColumn("customerName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("customerName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white rounded-md min-w-[100px] w-full md:w-auto"
        />
        <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">         
          {/* <Button variant="secondary" className="mx-4">
            Download all
          </Button> */}
         
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="green" className="md:mx-4">Add customer</Button>
            </DialogTrigger>
            <DialogContent >
              <DialogHeader>
                <DialogTitle>Add new customer</DialogTitle>
                <DialogDescription>
                  Add new customer here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 w-[100%]">
                <table className="border-spacing-2 border-separate">
                  <tr >
                    <td >Full name</td>
                    <td >
                      <Input 
                        placeholder="Fullname" 
                        value={customerName} 
                        onChange={(e)=>setCustomerName(e.target.value)}
                        required/>
                    </td>
                  </tr>
                  <tr >
                    <td >Phone Number</td>
                    <td >
                      <Input 
                        placeholder="Phone Number" 
                        value={phoneNumber} 
                        required
                        onChange={(e)=>setPhoneNumber(e.target.value)}/>
                    </td>
                  </tr>
                  <tr >
                    <td >Email</td>
                    <td >
                      <Input 
                        type="email"
                        placeholder="Email" 
                        value={email} 
                        required
                        onChange={(e)=>setEmail(e.target.value)}/>
                    </td>
                  </tr>              
                </table>            
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-600 hover:bg-green-500" onClick={handleAdd}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>          
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex">
        <div className="flex-1 text-sm text-muted-foreground mt-2">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

    </div>
  );
}

