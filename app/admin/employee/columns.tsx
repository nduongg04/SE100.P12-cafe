"use client";

import { getCookies } from "@/lib/action";
import * as React from "react";
import { toast } from "@/hooks/use-toast";
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

export type Staff = {
  staffId: string
  staffName: string
  username: string
  isAdmin: boolean
}

export const columns: (
  onUpdate: (
    staff: string, 
    staffName: string, 
    username: string
  ) => void) => ColumnDef<Staff>[] =(onUpdate) => [
  {
    accessorKey: "staffId",
    header: "ID",
  },
  {
    accessorKey: "staffName",
    header: "Full name"
  },
  {
    accessorKey: "username",
    header: "Account"
  },
  {
    accessorKey: "isAdmin",
    header: "Role",
    cell: ({ row }) => {
      return row.getValue("isAdmin")==true? <Label className="text-red-500">Admin</Label> : <Label className="text-green-500">Staff</Label>
    }
  },
  {
    id: "actions",
      cell: ({ row }) => {
        const staff= row.original;
        const [staffName, setStaffName] = React.useState(staff.staffName);
        const [username, setUserName] = React.useState(staff.username);

        const handleSave = async () => {
          if (staffName == staff.staffName && username == staff.username){
            toast({
              title: 'No changes',
              description: 'Please make some changes before saving',
              variant: 'default'
            })
            return;
          }
          if(staffName.length <10 || username.length < 10){
            toast({
              title: 'Invalid input',
              description: 'Please enter valid input',
              variant: 'destructive'
            })
            return;
          }
          const cookies = await getCookies('refreshToken');
          const token = cookies?.value;
          const url = process.env.BASE_URL;
          if (staffName !== staff.staffName || username !== staff.username) {
            try {
              const response = await fetch(`${url}/staff/update/${row.original.staffId}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ staffName: staffName, username: username})
              });
              if (!response.ok) {
                toast({
                  title: 'Failed to update staff',
                  description: 'Please try again later',
                  variant: 'destructive'
                })
                return;
              }
              const result = await response.json();
              onUpdate(staff.staffId, staffName, username);
              toast({
                title: 'Update staff successfully',
                description: `Staff #${staff.staffId} has been updated`,
                variant: 'success'
              })
            } catch (error) {
              toast({
                title: 'Failed to update staff',
                description: 'Please try again later',
                variant: 'destructive'
              })
            }
          }
        };
        
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Pencil className="size-4 cursor-pointer"/>
            </DialogTrigger>
            <DialogContent >
              <DialogHeader>
                <DialogTitle>Edit staff #{staff.staffId}</DialogTitle>
                <DialogDescription>
                  Make changes to staff here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 w-[100%]">
                <table className="border-spacing-2 border-separate">
                  <tr >
                    <td >Full name</td>
                    <td ><Input defaultValue={staff.staffName} value={staffName} onChange={(e)=>setStaffName(e.target.value)} /></td>
                  </tr>
                  <tr >
                    <td >Account</td>
                    <td ><Input defaultValue={staff.username} value={username} onChange={(e)=>setUserName(e.target.value)} /></td>
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
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
