"use client";
import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil, ArrowUpDown } from "lucide-react"
import { Fragment } from "react"
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FilterFn } from "@tanstack/react-table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getCookies } from '@/lib/action';
import {toast} from "@/hooks/use-toast"
import BillDialog from "./bill-dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillInfo = {
  billID: number
  productID: string
  productName: string
  productCount: number
  totalPriceDtail: number
  productPrice: number
}
export type Bill = {
  id: number
  customer: string
  voucherValue: number
  voucherTypeIndex?: number
  staffId: string
  staff: string
  payType: string
  status: "Pending" | "Successful" 
  totalPrice: number
  createdAt: Date
  dateString: string
  billInfo: BillInfo[]
}
export const dateRangeFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const [start, end] = filterValue as [Date | undefined, Date | undefined];
  const rowDate = new Date(row.getValue(columnId)); // Getting the date from the row

  if (start && end) {
    return rowDate >= start && rowDate <= end;
  }
  if (start) {
    return rowDate >= start;
  }
  if (end) {
    return rowDate <= end;
  }
  return true; // No filter if both start and end are undefined
};
export const idFilter: FilterFn<any> = (row, columnId, filterValue) => {
  console.log(row.getValue(columnId), filterValue)
  return row.getValue(columnId) == filterValue;
};
export const columns: (onUpdate: (billId: number, newStatus: "Pending" | "Successful") => void) => ColumnDef<Bill>[] = (onUpdate) =>[
  {
    id: "id",
    accessorKey: "id",
    filterFn: idFilter,
    header: "ID",
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    filterFn: dateRangeFilter
  },
  {
    accessorKey: "dateString",
    header: "Created At"
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => { 
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPrice"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "VND",
      }).format(amount)
 
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return row.getValue("status")==="Pending"? <Label className="text-red-500">Pending</Label> : <Label className="text-green-500">Successful</Label>
    }
  },
  {
    id: "actions",
      cell: ({ row }) => {
        const bill = row.original
        const [billStatus, setBillStatus] = React.useState(bill.status);
        const [initialStatus] = React.useState(bill.status);
        const [currentStatus, setCurrentStatus] = React.useState<"Pending"|"Successful">(bill.status);
        const handleUpdate = (status:"Pending"|"Successful") => {
          setBillStatus(status);
          row.original.status = status;
          onUpdate(bill.id, status);
        };
        const handleSave = async () => {
          const url = process.env.BASE_URL;
          if (initialStatus !== currentStatus) {
            try {
              const token = await getCookies('refreshToken');
              const response = await fetch(`${url}/bill/updatestatus/${bill.id}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token?.value}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({status: currentStatus })
              });
              console.log("Update: ",response)
              if (!response.ok) {
                toast({
                  title: 'Failed to update status',
                  description: 'Please try again later',
                  variant: 'destructive'
                })
                return
              }
              bill.status = currentStatus;
              const result = await response.json();
              handleUpdate(currentStatus);
              toast({
                title: 'Update status successfully',
                description: `Bill #${bill.id} status has been updated to ${currentStatus}`,
                variant: 'success'
              })
            } catch (error) {
              toast({
                title: 'Failed to update status',
                description: 'Please try again later',
                variant: 'destructive'
              })
            }
          } else {
            toast({
              title: 'No changes',
              description: 'No changes have been made',
              variant: 'default'
          })}
        };
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Pencil className="size-4 cursor-pointer"/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px]">
              <DialogHeader>
              <DialogTitle>Edit bill status #{bill.id}</DialogTitle>
              <DialogDescription>
                  Make changes to bill status here. Click save when you're done.
              </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 w-[100%]">
              <div className="flex justify-between">
                  <Label 
                      >Staff: <span className="font-normal">{bill.staff}</span></Label>            
                  <Label 
                      >Customer: <span className="font-normal">{bill.customer}</span></Label>
                  <div className="flex">
                      <Label className="mx-4">Status</Label>
                      <RadioGroup defaultValue={bill.status} onValueChange={(value) => setCurrentStatus(value as "Pending" | "Successful")}>
                      <div className="flex items-center space-x-2 text-red-500">
                          <RadioGroupItem value="Pending" id="r1" />
                          <Label htmlFor="r1">Pending</Label>
                      </div>
                      <div className="flex items-center space-x-2 text-green-400">
                          <RadioGroupItem value="Successful" id="r2" />
                          <Label htmlFor="r2">Successful</Label>
                      </div>                   
                      </RadioGroup>              
                  </div>
              </div>
              <Label>Product List</Label>
              <div className="overflow-y-auto max-h-48">
                  <Table>
                  <TableHeader>
                      <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead >Total Price</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody >
                      {
                      bill.billInfo.map((billInfo, index) => (
                          <Fragment key={billInfo.productID}>
                              <TableRow>
                              <TableCell className="text-left">{index + 1}</TableCell>
                              <TableCell>{billInfo.productName}</TableCell>
                              <TableCell>{billInfo.productCount}</TableCell>
                              <TableCell>{billInfo.productPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                              <TableCell>{billInfo.totalPriceDtail.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                              </TableRow>
                          </Fragment>
                          ))
                      }
                  </TableBody>
                  </Table>
              </div>
              <div className="flex justify-between">
                  <Label>Payment Type: <span className="font-normal">{bill.payType}</span></Label>       
                  <Label>Created At: <span className="font-normal">{bill.dateString}</span></Label>   
              </div>
              <Label htmlFor="discount" className="text-orange-500 text-right">Discount: <span>{bill.voucherTypeIndex==2? bill.voucherValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }):bill.voucherValue}</span> {bill.voucherTypeIndex==2?'':'%'}</Label>
              <Label htmlFor="totalPrice" className="text-red-600 text-right">Sub Total: <span>{bill.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></Label>
              </div>
              <DialogFooter>
              <DialogClose asChild>
                  <Button type="submit" className="bg-green-600 hover:bg-green-500" onClick={handleSave}>Save changes</Button>
                </DialogClose>
              </DialogFooter>
          </DialogContent>
          </Dialog>
        )
    }
  }
]
