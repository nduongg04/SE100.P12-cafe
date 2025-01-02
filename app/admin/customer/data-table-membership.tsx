"use client";
import { getCookies} from "@/lib/action";
import {toast} from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CustomerType } from "./columns";
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
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onAdd?: (data: CustomerType) => void;
    onDelete?: (data: CustomerType) => void;
}

export function DataTableMemberShip<TData, TValue>({
    columns,
    data,
    onAdd,
    onDelete
}: DataTableProps<CustomerType, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [customerTypeName, setCustomerTypeName] = React.useState<string>("");
  const [discountValue, setDiscountValue] = React.useState<number>(0);
  const [boundaryRevenue, setBoundaryRevenue] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  // Custom filter function for date range
  const handleAdd = async() => {
    if(customerTypeName === "" || discountValue === 0 || boundaryRevenue === 0){
      toast({
        title: 'Failed to add new membership',
        description: 'Please fill in all the fields',
        variant: 'destructive'
      })
      return;
    }
    if(discountValue > 100 || discountValue < 0){
      toast({
        title: 'Failed to add new membership',
        description: 'Discount value must be between 0 and 100',
        variant: 'destructive'
      })
      return;
    }
    const cookies = await getCookies('refreshToken');
    const token = cookies?.value;
    const url = process.env.BASE_URL;
    try{
      const response = await fetch(`${url}/customertype/create`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({customerTypeName, discountValue, boundaryRevenue})
      });
      const data = await response.json();
        console.log(data);
      if (!response.ok) {
        throw new Error( data.message);
      }
      onAdd?.({
        customerTypeId: data.data.customerTypeID,
        customerTypeName: customerTypeName,
        discountValue: discountValue,
        boundaryRevenue: boundaryRevenue,
      });
      toast({
        title: 'Successfully added new membership',
        description: 'New membership has been added',
        variant: 'success'
      })
    }catch(e){
      toast({
        title: 'Failed to add new membership',
        description: "",
        variant: 'destructive'
      })
      return;
    }
  }
  const handleDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast({
        title: 'Failed to delete membership',
        description: 'Please select membership to delete',
        variant: 'destructive'
      })
      return;
    }
    const customerType = selectedRows.map((row) => row.original);
    try{
      const cookies = await getCookies('refreshToken');
      const token = cookies?.value;
      const url = process.env.BASE_URL;
      await Promise.all(
        customerType.map(async (customerType) => {
          const response = await fetch(`${url}/customertype/delete/${customerType.customerTypeId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (!response.ok) {
            console.log(data);
            throw new Error("Failed to delete data: " + data.message+" "+response.status);
            
          }
          onDelete?.(customerType);
        })
      );
      toast({
        title: 'Successfully deleted membership',
        description: 'Membership has been deleted',
        variant: 'success'
      })
    }catch(error: any){
      toast({
        title: 'Failed to delete membership',
        description: error.message,
        variant: 'destructive'
      })
    }
    table.setRowSelection({});
  }

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
          value={(table.getColumn("customerTypeName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("customerTypeName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white rounded-md min-w-[100px] w-full md:w-auto"
        />
        <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">         
          {/* <Button variant="secondary" className="mx-4">
            Download all
          </Button> */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete membership</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader className="flex flex-col items-center">
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <TriangleAlert className="text-[#ff0000] size-20" />
                Are you sure you want to delete the selected memberships?
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-green-600 hover:bg-green-500" onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="green" className="md:mx-4">Add membership</Button>
            </DialogTrigger>
            <DialogContent >
              <DialogHeader>
                <DialogTitle>Add new membership</DialogTitle>
                <DialogDescription>
                  Add new membership here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 w-[100%]">
              <table className="border-spacing-2 border-separate">
                <tr >
                  <td >Membership</td>
                  <td ><Input placeholder="Mebership name" value={customerTypeName} onChange={(e)=>setCustomerTypeName(e.target.value)} /></td>
                </tr>
                <tr >
                  <td >Minium spending</td>
                  <td ><Input placeholder="Minium spending" value={boundaryRevenue} onChange={(e)=>setBoundaryRevenue(!Number.parseInt(e.target.value)?0:Number.parseInt(e.target.value))} /></td>
                </tr>
                <tr>
                  <td >Discount(%)</td>
                  <td ><Input placeholder="Discount rate" value={discountValue} onChange={(e)=>setDiscountValue(!Number.parseInt(e.target.value)?0:Number.parseInt(e.target.value))}/></td>
                </tr>
              </table>            
            </div>
              <DialogFooter>
                {loading && 
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                }
                <Button type="submit" className="bg-green-600 hover:bg-green-500" onClick={handleAdd} disabled={loading}>Add</Button>
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

