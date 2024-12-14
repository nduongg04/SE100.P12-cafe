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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FilterFn } from "@tanstack/react-table";

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
        const handleUpdate = (status:"Pending"|"Successful") => {
          setBillStatus(status);
          row.original.status = status;
          onUpdate(bill.id, status);
        };
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Pencil className="size-4 cursor-pointer"/>
            </DialogTrigger>
            <BillDialog bill={bill} onUpdate={handleUpdate}>

            </BillDialog>
          </Dialog>
        )
    }
  }
]
