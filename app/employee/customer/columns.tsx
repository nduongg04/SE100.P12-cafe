"use client";
import * as React from "react";
import { getCookies } from "@/lib/action";
import {toast} from "sonner";
import { ColumnDef } from "@tanstack/react-table"
import { Pencil, ArrowUpDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Customer = {
  customerId: string
  customerType: CustomerType | null
  customerName: string
  phoneNumber: string
  email: string
  revenue: number
}
export type CustomerType = {
  customerTypeId: string
  customerTypeName: string
  boundaryRevenue: number
  discountValue: number
}
export const columns:(
  onUpdate:(
    customerId: string,
    customerName: string,
    phoneNumber: string,
    email: string
  ) => void) => ColumnDef<Customer>[] =(onUpdate) => [
  {
    accessorKey: "customerId",
    header: "ID",
  },
  {
    accessorKey: "customerName",
    header: "Full name"
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number"
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => { 
      return (
        <Button
          className="m-0 p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Spending
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("revenue"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "VND",
      }).format(amount)
 
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "customerType",
    header: "Membership",
    cell: ({ row }) => {
      return <div className="">{row.original.customerType?row.original.customerType.customerTypeName:"Visting customer"}</div>
    },
  },
  {
    id: "actions",
      cell: ({ row }) => {
        const [customerName, setCustomerName] = React.useState(row.original.customerName);
        const [phoneNumber, setPhoneNumber] = React.useState(row.original.phoneNumber);
        const [email, setEmail] = React.useState(row.original.email);
        const customer = row.original
        const handleSave = async () => {
          if (customerName == customer.customerName && phoneNumber == customer.phoneNumber&& email == customer.email){
            toast.error("No changes detected")
            return
          }
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
          try{
            const cookies = await getCookies('refreshToken');
            const token = cookies?.value;
            const url = process.env.BASE_URL;
            const response = await fetch(`${url}/customer/update/${customer.customerId}`, {
              method: "PUT",
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({customerName: customerName, phoneNumber: phoneNumber, email: email}),
            });
            console.log(response)
            const data = await response.json()
            if (!response.ok) {
              toast.error("Failed to save changes: " + data.message)
              return
            }
          }catch(e){
            toast.error("Failed to save changes: "+ e)
            return;
          }

          toast.success("Changes saved")
          onUpdate(customer.customerId, customerName, phoneNumber, email)
        }
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Pencil className="size-4 cursor-pointer"/>
            </DialogTrigger>
            <DialogContent >
              <DialogHeader>
                <DialogTitle>Edit customer #{customer.customerId}</DialogTitle>
                <DialogDescription>
                  Make changes to customer here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 w-[100%]">
                <table className="border-spacing-2 border-separate">
                  <tr >
                    <td >Full name</td>
                    <td ><Input defaultValue={customer.customerName} value={customerName} onChange={(e)=>setCustomerName(e.target.value)} /></td>
                  </tr>
                  <tr >
                    <td >Phone Number</td>
                    <td ><Input defaultValue={customer.phoneNumber} value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)}/></td>
                  </tr>
                  <tr >
                    <td >Email</td>
                    <td ><Input type='email' defaultValue={customer.email} value={email} onChange={(e)=>setEmail(e.target.value)}/></td>
                  ,</tr>
                  <tr>
                    <td >Membership</td>
                    <td ><Input defaultValue={customer.customerType?customer.customerType.customerTypeName:"Visting customer"} disabled={true} /></td>
                  </tr>
                  <tr>
                    <td >Spending</td>
                    <td ><Input defaultValue={new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(parseFloat(customer.revenue.toString()))}
                      disabled={true} />
                    </td>
                  </tr>
                </table>            
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-600 hover:bg-green-500" onClick={handleSave}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
    }
  },
 
]
