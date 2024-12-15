import React, { useState } from 'react';
import { getCookies } from '@/lib/action';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose ,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Fragment } from "react"
import {toast} from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Bill } from './columns';
const BillDialog = ({bill, onUpdate} : {bill:Bill, onUpdate: (status: "Pending"|"Successful")=>void}) => {
  const [initialStatus] = useState(bill.status);
  const [currentStatus, setCurrentStatus] = useState<"Pending"|"Successful">(bill.status);

  const handleSave = async () => {
    const url = process.env.BASE_URL;
    if (initialStatus !== currentStatus) {
      try {
        const token = await getCookies('refreshToken');
        const response = await fetch(`${url}/bill/updatestatus/${bill.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({status: currentStatus })
        });

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
        onUpdate(currentStatus);
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
    <DialogContent className="sm:max-w-[925px]">
        <DialogHeader>
        <DialogTitle>Edit bill status #{bill.id}</DialogTitle>
        <DialogDescription>
            Make changes to bill status here. Click save when you're done.
        </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 w-[100%]">
        <div className="flex justify-between">
            <Label 
                >Staff: <span className="font-normal">{bill.staffId}</span></Label>            
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
                        <TableCell>{billInfo.productPrice}</TableCell>
                        <TableCell>{billInfo.totalPriceDtail}</TableCell>
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
        <Label htmlFor="totalPrice" className="text-red-600 text-right">Sub Total: <span>{bill.totalPrice}</span></Label>
        </div>
        <DialogFooter>
        <DialogClose asChild>
            <Button type="submit" className="bg-green-600 hover:bg-green-500" onClick={handleSave}>Save changes</Button>
          </DialogClose>
        </DialogFooter>
    </DialogContent>
  );
};

export default BillDialog;