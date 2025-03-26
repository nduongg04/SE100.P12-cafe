"use client";
import { getCookies } from '@/lib/action';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
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
import { toast } from '@/hooks/use-toast';
import { StaffApiAdapter } from '@/lib/apis/staffAPI';
interface StaffData {
  staffId: string;
  staffName: string
  username: string
  isAdmin: boolean
}

interface DataTableProps<TData extends StaffData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onAdd: (data: TData) => void;
    onDelete: (data: TData) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onAdd,
    onDelete
}: DataTableProps<StaffData, TValue>) {
  const staffApi = new StaffApiAdapter();
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [isAdmin, setIsAdmin] = React.useState<boolean>(true);
  const [staffName, setStaffName] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
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
    }
  });
  
  const addStaff= async () => {
    if(staffName==='' || username==='' || password===''){
      toast({
        title: 'Failed to add staff',
        description: 'Please fill in all fields',
        variant: 'destructive'
      })
      return;
    }
    if(staffName.length<10){
      toast({
        title: 'Failed to add staff',
        description: 'Full name must be at least 10 characters',
        variant: 'destructive'
      })
      return;
    }
    if(username.length<10){
      toast({
        title: 'Failed to add staff',
        description: 'Username must be at least 10 characters',
        variant: 'destructive'
      })
      return;
    }
    if(password.length<5){
      toast({
        title: 'Failed to add staff',
        description: 'Password must be at least 5 characters',
        variant: 'destructive'
      })
      return;
    }
    const cookies = await getCookies('refreshToken');
    const token = cookies?.value;
    const url = process.env.BASE_URL;
     try {
       const response = await fetch(`${url}/auth/register`, {
         method: "POST",
         headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ staffName, username, password, isAdmin }),
       });
       if (!response.ok) {
         toast({
           title: "Failed to add staff",
           description: "Please try again later",
           variant: "destructive",
         });
         const data = await response.json();
         throw new Error(data?.message);
       }
       const result = await response.json();
       toast({
         title: "Add staff successfully",
         description: "Staff has been added",
         variant: "success",
       });
       setIsAdmin(true);
       setStaffName("");
       setUsername("");
       setPassword("");
       onAdd(result.data);
     } catch (e: any) {
       toast({
         title: "Failed to add staff",
         description: e.message,
         variant: "destructive",
       });
     }
  }
  const deleteStaff = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast({
        title: 'Failed to delete staff',
        description: 'Please select at least one staff',
        variant: 'destructive'
      })
      return;
    }
    selectedRows.values;
    const staffs = selectedRows.map((row) => {
      return row.original;
    
    });
    const cookies = await getCookies('refreshToken');
    const token = cookies?.value;
    const url = process.env.BASE_URL;
    try{
      await Promise.all(staffs.map(async (staff) => {
        const response = await staffApi.deleteStaff(staff.staffId);
        if (!response) {
          throw new Error('Failed to delete staff: '+ staff.staffId);
        }
        table.setRowSelection({}); 
        toast({
          title: 'Delete staff successfully',
          description: 'Staff has been deleted',
          variant: 'success'
        })
        onDelete(staff);
      }))       
    }
    catch(err:any){
     toast({
        title: 'Failed to delete staff',
        description: err.message,
        variant: 'destructive'
     })
    }
  }
  return (
    <div className="max-w-[calc(100vw-2rem)]">
      <div className="flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0">
        <Input
          placeholder="Search by name"
          value={(table.getColumn("staffName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("staffName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white rounded-md min-w-[100px] w-full md:w-auto"
        />
        <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">         
          {/* <Button variant="secondary" className="mx-4">
            Download all
          </Button> */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete staff</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader className="flex flex-col items-center">
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <TriangleAlert className="text-[#ff0000] size-20" />
                Are you sure you want to delete the selected staff?
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-green-600 hover:bg-green-500" onClick={deleteStaff}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="green" 
                className="md:mx-4"
                >Add staff</Button>
            </DialogTrigger>
            <DialogContent >
              <DialogHeader>
                <DialogTitle>Add new staff</DialogTitle>
                <DialogDescription>
                  Add new staff here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 w-[100%]">
                <table className="border-spacing-2 border-separate">
                  <tr>
                    <td >Role</td>
                    <td >
                      <select 
                        className="border rounded-md p-1" 
                        onChange={(e)=>setIsAdmin(e.target.value==="true")}>
                        <option value="true">Admin</option>
                        <option value="false">Staff</option>
                      </select>
                    </td>
                  </tr>
                  <tr >
                    <td >Full name</td>
                    <td ><Input 
                          placeholder="Full name" 
                          value={staffName} 
                          onChange={(e)=> setStaffName(e.target.value)}
                          required/></td>
                  </tr>
                  <tr >
                    <td >Account</td>
                    <td ><Input 
                            placeholder="Username" 
                            value={username} 
                            onChange={(e)=> setUsername(e.target.value)}
                            required/></td>
                  </tr>
                  <tr>
                    <td >Password</td>
                    <td >
                      <Input 
                        type="password" 
                        placeholder="Password" 
                        onChange={(e)=> setPassword(e.target.value)} 
                        required/>
                    </td>
                  </tr>
                </table>            
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" className="bg-green-600 hover:bg-green-500" onClick={addStaff}>Add</Button>
                </DialogClose>
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

